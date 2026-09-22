import fs from 'fs';
import { TEAMS_PATH } from '../utils/config.js';

// Helpers
function readTeams() {
    const raw = fs.readFileSync(TEAMS_PATH, 'utf8');
    return JSON.parse(raw);
}

function writeTeams(data) {
    fs.writeFileSync(TEAMS_PATH, JSON.stringify(data, null, 2));
}

// Register a new team
export function registerTeam(req, res) {
    const { teamName, contact } = req.body;

    if (!teamName || !contact) {
        return res.status(400).json({ error: "teamName and contact required" });
    }

    const data = readTeams();

    // Prevent duplicates
    const existing = data.teams.find(t => t.teamName === teamName);
    if (existing) {
        return res.status(400).json({ error: "Team name already exists." });
    }

    const newTeam = {
        teamName,
        contact,
        startTime: Date.now(),
        endTime: null
    };

    data.teams.push(newTeam);
    writeTeams(data);

    return res.json({ message: "Team registered", team: newTeam });
}

// Mark a team as finished
export function finishTeam(req, res) {
    const { teamName } = req.body;

    if (!teamName) {
        return res.status(400).json({ error: "teamName required" });
    }

    const data = readTeams();
    const team = data.teams.find(t => t.teamName === teamName);

    if (!team) {
        return res.status(400).json({ error: "Team not found." });
    }

    team.endTime = Date.now();
    writeTeams(data);

    return res.json({ message: "Finish recorded" });
}

// Leaderboard sorted by completion time
export function getLeaderboard(req, res) {
    const data = readTeams();

    const finished = data.teams.filter(t => t.endTime);

    const sorted = finished.sort((a, b) => {
        const timeA = a.endTime - a.startTime;
        const timeB = b.endTime - b.startTime;
        return timeA - timeB;
    });

    return res.json(sorted);
}
