import { createTeam, listTeams } from '../utils/teamStore.js';

const START_PASSWORD = process.env.START_PASSWORD;
const ROUTES = ['route1', 'route2', 'route3'];

// Register a new team
export async function registerTeam(req, res) {
    const { teamName, contact, password, route } = req.body;

    // Fail closed: if the password isn't configured, nobody can start
    if (!START_PASSWORD) {
        return res.status(500).json({ error: "Hunt start password is not configured on the server." });
    }
    if (password !== START_PASSWORD) {
        return res.status(401).json({ error: "Incorrect hunt password." });
    }

    if (!teamName || !contact) {
        return res.status(400).json({ error: "teamName and contact required" });
    }

    const newTeam = {
        teamName,
        contact,
        route: ROUTES.includes(route) ? route : null,
        startTime: Date.now(),
        endTime: null
    };

    try {
        // Prevent duplicates
        const created = await createTeam(newTeam);
        if (!created) {
            return res.status(400).json({ error: "Team name already exists." });
        }

        return res.json({ message: "Team registered", team: newTeam });
    } catch (err) {
        console.error("Error registering team:", err);
        return res.status(500).json({ error: "Could not register team." });
    }
}

// Leaderboard sorted by completion time
export async function getLeaderboard(req, res) {
    try {
        const teams = await listTeams();

        const finished = teams.filter(t => t.endTime);

        const sorted = finished.sort((a, b) => {
            const timeA = a.endTime - a.startTime;
            const timeB = b.endTime - b.startTime;
            return timeA - timeB;
        });

        // Only expose what the leaderboard shows (no contact info)
        res.setHeader("Cache-Control", "no-store");
        return res.json(sorted.map(({ teamName, startTime, endTime }) => ({ teamName, startTime, endTime })));
    } catch (err) {
        console.error("Error loading leaderboard:", err);
        return res.status(500).json({ error: "Could not load leaderboard." });
    }
}
