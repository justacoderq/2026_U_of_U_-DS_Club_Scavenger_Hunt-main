import path from 'path';
import { fileURLToPath } from 'url';

// Resolve paths from this file, not process.cwd(), so they work both
// locally (npm start from Server/) and on Vercel (cwd is the project root)
const SERVER_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_DIR = path.join(SERVER_DIR, '..');

const ON_VERCEL = !!process.env.VERCEL;

const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const TOKEN_MAP_PATH = path.join(SERVER_DIR, 'tokenMap.json');
const PUZZLES_PATH = path.join(SERVER_DIR, 'puzzles.json');

// Local-only data files (on Vercel, teams live in Redis and logs go to the console)
const LOG_PATH = path.join(SERVER_DIR, 'processLog.json');
const TEAMS_PATH = path.join(SERVER_DIR, 'teams.json');

const PORT = process.env.PORT || 8080;

export { ON_VERCEL, PUBLIC_DIR, TOKEN_MAP_PATH, PUZZLES_PATH, LOG_PATH, TEAMS_PATH, PORT };
