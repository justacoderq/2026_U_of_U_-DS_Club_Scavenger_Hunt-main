import fs from 'fs';
import { LOG_PATH } from '../utils/config.js';

const logEvent = (token, event, team = 'unknown') => {
  const logEntry = {
    token,
    team,
    event,
    timestamp: new Date().toISOString(),
  };

  let logData = [];
  if (fs.existsSync(LOG_PATH)) {
    logData = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8'));
  }

  logData.push(logEntry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logData, null, 2));
};

export default logEvent;
