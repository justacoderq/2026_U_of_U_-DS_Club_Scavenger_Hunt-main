import fs from "fs";
import { TEAMS_PATH } from "../utils/config.js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Verify request header
function checkAuth(req) {
    const key = req.headers["x-admin-key"];
    return key && key === ADMIN_PASSWORD;
}

// GET all teams
export function adminGetTeams(req, res) {
    if (!checkAuth(req)) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const raw = fs.readFileSync(TEAMS_PATH, "utf8");
        const data = JSON.parse(raw);
        res.setHeader("Cache-Control", "no-store");
        res.json(data);
    } catch (err) {
        console.error("Error reading teams:", err);
        res.status(500).json({ error: "Could not read team data" });
    }
}

// DELETE a team by name
export function adminDeleteTeam(req, res) {
    if (!checkAuth(req)) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { teamName } = req.body;

    if (!teamName) {
        return res.status(400).json({ error: "Missing teamName" });
    }

    try {
        const raw = fs.readFileSync(TEAMS_PATH, "utf8");
        const data = JSON.parse(raw);

        const before = data.teams.length;
        data.teams = data.teams.filter(t => t.teamName !== teamName);

        if (data.teams.length === before) {
            return res.status(404).json({ error: "Team not found" });
        }

        fs.writeFileSync(TEAMS_PATH, JSON.stringify(data, null, 2));

        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting team:", err);
        res.status(500).json({ error: "Error modifying team data" });
    }
}

// UPDATE arbitrary fields
export function adminUpdateTeam(req, res) {
    if (!checkAuth(req)) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { teamName, updates } = req.body;

    if (!teamName || !updates) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const raw = fs.readFileSync(TEAMS_PATH, "utf8");
        const data = JSON.parse(raw);

        const team = data.teams.find(t => t.teamName === teamName);
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        Object.assign(team, updates);

        fs.writeFileSync(TEAMS_PATH, JSON.stringify(data, null, 2));
        res.json({ success: true, team });
    } catch (err) {
        console.error("Error updating team:", err);
        res.status(500).json({ error: "Error writing to team file" });
    }
}
