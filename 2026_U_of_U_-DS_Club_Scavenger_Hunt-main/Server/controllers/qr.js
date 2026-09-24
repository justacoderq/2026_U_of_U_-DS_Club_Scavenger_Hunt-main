/*
  Serves appropriate HTML page when a QR code URL is accessed.
*/
import fs from 'fs';
import path from 'path';
import { TOKEN_MAP_PATH, PUBLIC_DIR } from '../utils/config.js';
import logEvent from '../utils/logger.js';

import express from 'express';
const qrRouter = express.Router();

let tokenMap = {};
if (fs.existsSync(TOKEN_MAP_PATH)) {
  tokenMap = JSON.parse(fs.readFileSync(TOKEN_MAP_PATH, 'utf8'));
}

// ==============================
// Serve stage.html for QR tokens
// ==============================
qrRouter.get('/:token', (req, res) => {
  const token = req.params.token;
  if (!tokenMap[token]) {
    return res.status(404).send('<h1>Invalid or expired QR code.</h1>');
  }

  // Optional: Log page visit
  logEvent(token, 'scan');

  res.sendFile(path.join(PUBLIC_DIR, 'stage.html'));
});

export default qrRouter;
