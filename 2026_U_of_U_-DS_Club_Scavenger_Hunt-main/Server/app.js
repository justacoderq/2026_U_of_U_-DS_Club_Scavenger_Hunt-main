/*
Express app for the Scavenger Hunt backend.
Handles frontend static files + QR links + other logic.
Started locally by server.js; imported directly by Vercel (api/index.js).
*/
import express from 'express';
import { PUBLIC_DIR } from './utils/config.js';
import morgan from 'morgan';
import compression from 'compression';
import { registerTeam, getLeaderboard } from './controllers/teamController.js';
import {
    adminGetTeams,
    adminDeleteTeam,
    adminUpdateTeam
} from "./controllers/adminController.js";

import qrRouter from './controllers/qr.js';
import apiRouter from './controllers/api.js';

const app = express();

// MIDDLEWARE
app.use(compression());
app.use(express.static(PUBLIC_DIR));   // Serve static frontend files (Vercel serves public/ itself)
app.use(express.json());
app.use(morgan('dev'));

// MAIN ROUTES
app.use('/qr', qrRouter);
app.use('/api', apiRouter);
app.post('/api/team/start', registerTeam);
app.get('/api/leaderboard', getLeaderboard);

// ADMIN ROUTES
app.get("/secret/admin/teams", adminGetTeams);
app.post("/secret/admin/update", adminUpdateTeam);
app.post("/secret/admin/delete", adminDeleteTeam);

export default app;
