import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Detect if running on Render
const ON_RENDER = !!process.env.RENDER_SERVICE_ID;

// Determine base directory for data files
// Local: use Server dir
// Render: use persistent disk
const SERVER_DIR = process.cwd();
const DATA_DIR = ON_RENDER ? "/var/data" : SERVER_DIR;

// Make sure the directory exists (especially on Render)
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Existing paths
const ROOT_DIR = path.join(SERVER_DIR, '../');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const TOKEN_MAP_PATH = path.join(SERVER_DIR, 'tokenMap.json');
const LOG_PATH = path.join(DATA_DIR, 'processLog.json');

// NEW: Teams storage
const TEAMS_PATH = path.join(DATA_DIR, 'teams.json');

// Initialize teams file if it doesn't exist
if (!fs.existsSync(TEAMS_PATH)) {
    console.log("Initializing teams.json at:", TEAMS_PATH);
    fs.writeFileSync(TEAMS_PATH, JSON.stringify({ teams: [] }, null, 2));
}

const PORT = process.env.PORT || 8080;

export { PUBLIC_DIR, TOKEN_MAP_PATH, LOG_PATH, TEAMS_PATH, PORT };