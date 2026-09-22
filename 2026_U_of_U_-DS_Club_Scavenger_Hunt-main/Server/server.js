/*
This is the express server head for the Scavenger Hunt Backend Server
Will handle frontend static files + QR links + other logic
*/
import express from 'express';
import { PUBLIC_DIR, PORT } from './utils/config.js';
import morgan from 'morgan';
import compression from 'compression';
import { registerTeam, finishTeam, getLeaderboard } from './controllers/teamController.js';

import qrRouter from './controllers/qr.js';
import apiRouter from './controllers/api.js';

import fs from "fs";

const app = express();

// MIDDLEWARE
app.use(compression());
app.use(express.static(PUBLIC_DIR));   // Serve static frontend files
app.use(express.json());
app.use(morgan('dev'));

// MAIN ROUTES
app.use('/qr', qrRouter);
app.use('/api', apiRouter);
app.post('/api/team/start', registerTeam);
app.post('/api/team/finish', finishTeam);
app.get('/api/leaderboard', getLeaderboard);

// DEBUG ROUTES (now ABOVE app.listen)
app.get("/debug/public-dir", (req, res) => {
    res.json({
        PUBLIC_DIR,
        CWD: process.cwd()
    });
});

app.get("/debug/list-public", (req, res) => {
    try {
        const files = fs.readdirSync(PUBLIC_DIR);
        res.json(files);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// ADMIN ROUTES (also ABOVE app.listen)
import {
    adminGetTeams,
    adminDeleteTeam,
    adminUpdateTeam
} from "./controllers/adminController.js";

app.get("/secret/admin/teams", adminGetTeams);
app.post("/secret/admin/update", adminUpdateTeam);
app.post("/secret/admin/delete", adminDeleteTeam);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
