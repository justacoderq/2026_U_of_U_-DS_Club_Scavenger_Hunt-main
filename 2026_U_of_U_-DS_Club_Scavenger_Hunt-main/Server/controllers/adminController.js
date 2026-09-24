import { listTeams, getTeam, saveTeam, deleteTeam } from "../utils/teamStore.js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Verify request header
function checkAuth(req) {
    const key = req.headers["x-admin-key"];
    return key && key === ADMIN_PASSWORD;
}

// GET all teams
export async function adminGetTeams(req, res) {
    if (!checkAuth(req)) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const teams = await listTeams();
        res.setHeader("Cache-Control", "no-store");
        res.json({ teams });
    } catch (err) {
        console.error("Error reading teams:", err);
        res.status(500).json({ error: "Could not read team data" });
    }
}

// DELETE a team by name
export async function adminDeleteTeam(req, res) {
    if (!checkAuth(req)) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { teamName } = req.body;

    if (!teamName) {
        return res.status(400).json({ error: "Missing teamName" });
    }

    try {
        const removed = await deleteTeam(teamName);

        if (!removed) {
            return res.status(404).json({ error: "Team not found" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting team:", err);
        res.status(500).json({ error: "Error modifying team data" });
    }
}

// UPDATE arbitrary fields
export async function adminUpdateTeam(req, res) {
    if (!checkAuth(req)) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    const { teamName, updates } = req.body;

    if (!teamName || !updates) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // The team name is the storage key, so it can't be edited in place
    delete updates.teamName;

    try {
        const team = await getTeam(teamName);
        if (!team) {
            return res.status(404).json({ error: "Team not found" });
        }

        Object.assign(team, updates);

        await saveTeam(team);
        res.json({ success: true, team });
    } catch (err) {
        console.error("Error updating team:", err);
        res.status(500).json({ error: "Error writing to team file" });
    }
}
