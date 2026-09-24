/*
Team storage.
- Deployed: Upstash Redis (env vars added by Vercel's Upstash integration).
  Each team is its own key (team:<name>) plus a set of all names, so teams
  answering at the same time never overwrite each other's progress.
- Local: falls back to teams.json when no Redis env vars are set.
*/
import fs from 'fs';
import { Redis } from '@upstash/redis';
import { TEAMS_PATH } from './config.js';

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const TEAM_SET = 'teams';
const teamKey = name => `team:${name}`;

// ------------------------------
// Local file helpers
// ------------------------------
function readFile() {
    if (!fs.existsSync(TEAMS_PATH)) return { teams: [] };
    return JSON.parse(fs.readFileSync(TEAMS_PATH, 'utf8'));
}

function writeFile(data) {
    fs.writeFileSync(TEAMS_PATH, JSON.stringify(data, null, 2));
}

// ------------------------------
// Public API
// ------------------------------
export async function listTeams() {
    if (!redis) return readFile().teams;

    const names = await redis.smembers(TEAM_SET);
    if (names.length === 0) return [];
    const teams = await redis.mget(...names.map(teamKey));
    return teams.filter(Boolean);
}

export async function getTeam(teamName) {
    if (!redis) return readFile().teams.find(t => t.teamName === teamName) || null;
    return await redis.get(teamKey(teamName));
}

// Returns false if the team name is already taken
export async function createTeam(team) {
    if (!redis) {
        const data = readFile();
        if (data.teams.some(t => t.teamName === team.teamName)) return false;
        data.teams.push(team);
        writeFile(data);
        return true;
    }

    const created = await redis.set(teamKey(team.teamName), team, { nx: true });
    if (!created) return false;
    await redis.sadd(TEAM_SET, team.teamName);
    return true;
}

export async function saveTeam(team) {
    if (!redis) {
        const data = readFile();
        const i = data.teams.findIndex(t => t.teamName === team.teamName);
        if (i === -1) data.teams.push(team);
        else data.teams[i] = team;
        writeFile(data);
        return;
    }

    await redis.set(teamKey(team.teamName), team);
}

// Returns false if the team did not exist
export async function deleteTeam(teamName) {
    if (!redis) {
        const data = readFile();
        const before = data.teams.length;
        data.teams = data.teams.filter(t => t.teamName !== teamName);
        if (data.teams.length === before) return false;
        writeFile(data);
        return true;
    }

    const removed = await redis.del(teamKey(teamName));
    await redis.srem(TEAM_SET, teamName);
    return removed > 0;
}
