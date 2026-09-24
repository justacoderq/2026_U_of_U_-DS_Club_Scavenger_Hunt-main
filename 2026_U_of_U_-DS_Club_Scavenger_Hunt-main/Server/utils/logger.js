import fs from 'fs';
import { LOG_PATH, ON_VERCEL } from '../utils/config.js';

const logEvent = (token, event, team = 'unknown') => {
  const logEntry = {
    token,
    team,
    event,
    timestamp: new Date().toISOString(),
  };

  // Vercel's filesystem is read-only; its runtime logs capture console output instead
  if (ON_VERCEL) {
    console.log(JSON.stringify(logEntry));
    return;
  }

  let logData = [];
  if (fs.existsSync(LOG_PATH)) {
    logData = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
  }

  logData.push(logEntry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logData, null, 2));
};

export default logEvent;
