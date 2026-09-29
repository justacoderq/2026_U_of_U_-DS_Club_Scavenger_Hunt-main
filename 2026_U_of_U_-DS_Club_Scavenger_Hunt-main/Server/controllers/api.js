/*
Router for /api/ endpoint
*/
import fs from 'fs';
import { TOKEN_MAP_PATH, PUZZLES_PATH } from '../utils/config.js';
import { getTeam, saveTeam } from '../utils/teamStore.js';

import express from 'express';
const apiRouter = express.Router();

// ==============================
// Load Data Files
// ==============================
const tokenMap = JSON.parse(fs.readFileSync(TOKEN_MAP_PATH, 'utf8'));

// ==============================
// API: Get First Token (start of route)
// ==============================
apiRouter.get('/start', (req, res) => {
    const { route } = req.query;

    const first = Object.entries(tokenMap).find(
        ([_, v]) => v.route === route && v.stage === 1
    );

    if (!first)
        return res.status(404).json({ error: "Route not found" });

    res.json({ firstToken: first[0] });
});


const puzzles = JSON.parse(fs.readFileSync(PUZZLES_PATH, 'utf8'));

// ==============================
// API: Get Token Info (for interstitial)
// ==============================
apiRouter.get('/token/:token', (req, res) => {
    const token = req.params.token;
    const record = tokenMap[token];
    if (!record) return res.status(404).json({ error: 'Invalid token' });

    res.json(record);
});

// ==============================
// API: Get Clue Info (legacy, still used for route/stage lookup)
// ==============================
apiRouter.get('/clue/:token', (req, res) => {
    const token = req.params.token;
    const record = tokenMap[token];
    if (!record) return res.status(404).json({ error: 'Invalid token' });

    const { route, stage, clue, keywords } = record;
    res.json({ route, stage, clue, keywords });
});

// ==============================
// API: Get Puzzle (question + hint; the answer never leaves the server)
// ==============================
apiRouter.get('/puzzle/:route/:stage', (req, res) => {
    const route = Number(req.params.route);
    const stage = Number(req.params.stage);

    const puzzle = puzzles.find(
        p => Number(p.route) === Number(route) &&
            Number(p.stage) === Number(stage)
    );

    if (!puzzle) {
        return res.status(404).json({ error: "Puzzle not found" });
    }

    res.json({
        question: puzzle.question,
        hint: puzzle.hint,
        image: puzzle.image || null
    });
});


// ==============================
// API: Check Answer & Return Next Token
// ==============================
apiRouter.post('/checkAnswer', async (req, res) => {
    const { route, stage, answer, team } = req.body;

    // Find puzzle
    const puzzle = puzzles.find(
        p => Number(p.route) === Number(route) &&
            Number(p.stage) === Number(stage)
    );

    if (!puzzle) {
        return res.status(400).json({ error: 'Puzzle not found' });
    }

    const correct =
        puzzle.answer.trim().toLowerCase() === String(answer ?? '').trim().toLowerCase();

    if (!correct) {
        return res.json({ correct: false });
    }

    try {
        const teamEntry = await getTeam(team);

        if (!teamEntry) {
            return res.status(400).json({ error: "Team not registered" });
        }

        teamEntry.stages = teamEntry.stages || {};
        teamEntry.stages[stage] = Date.now();

        if (Number(stage) === 4) {
            teamEntry.endTime = teamEntry.stages[stage];
        }

        await saveTeam(teamEntry);
    } catch (err) {
        console.error("Error saving progress:", err);
        return res.status(500).json({ error: "Could not save progress" });
    }

    // Find next token
    const next = Object.entries(tokenMap).find(([_, v]) =>
        Number(v.route.replace("route", "")) === Number(route) &&
        Number(v.stage) === Number(stage) + 1
    );

    res.json({
        correct: true,
        nextToken: next ? next[0] : null
    });
});

// ==============================
// API: Get clue based on route + stage (SECURE INTERSTITIAL)
// ==============================
apiRouter.get('/clueForStage', (req, res) => {
    const route = Number(req.query.route);
    const stage = Number(req.query.stage);

    if (!route || !stage) {
        return res.status(400).json({ error: "Missing route or stage." });
    }

    // Find token with matching route + stage
    const entry = Object.entries(tokenMap).find(([_, v]) =>
        Number(v.route.replace("route", "")) === route &&
        Number(v.stage) === stage
    );

    if (!entry) {
        return res.status(404).json({ error: "Clue not found for this stage." });
    }

    const record = entry[1];

    return res.json({
        clue: record.clue,
        route: record.route,
        stage: record.stage
    });
});


export default apiRouter;
