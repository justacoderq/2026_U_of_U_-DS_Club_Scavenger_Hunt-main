/*
Generates a QR code PNG for every token in tokenMap.json, plus a printable sheet.
Output goes to ../assets/qr (outside public/, so the codes are not served to players).

Usage (from Server/):
  npm run qr -- https://your-event-domain
*/
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { TOKEN_MAP_PATH } from '../utils/config.js';

const baseUrl = (process.argv[2] || '').replace(/\/+$/, '');
if (!baseUrl) {
    console.error('Usage: npm run qr -- <base-url>   e.g. npm run qr -- https://hunt.example.com');
    process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), '../assets/qr');
fs.mkdirSync(OUT_DIR, { recursive: true });

const tokenMap = JSON.parse(fs.readFileSync(TOKEN_MAP_PATH, 'utf8'));
const entries = Object.entries(tokenMap).sort(([, a], [, b]) =>
    a.route.localeCompare(b.route) || a.stage - b.stage
);

const cards = [];
for (const [token, { route, stage, _location }] of entries) {
    const url = `${baseUrl}/qr/${token}`;
    const file = `${route}_stage${stage}.png`;
    await QRCode.toFile(path.join(OUT_DIR, file), url, { width: 600, margin: 2 });
    console.log(`${file}  ->  ${url}`);
    cards.push({ route, stage, url, file, location: _location || '' });
}

const escape = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const sheet = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Scavenger Hunt QR Codes</title>
<style>
    body { font-family: sans-serif; margin: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .card { border: 1px solid #ccc; border-radius: 8px; padding: 12px; text-align: center; break-inside: avoid; }
    .card img { width: 100%; max-width: 220px; }
    .card h2 { margin: 4px 0; font-size: 1.1rem; }
    .loc { font-size: 0.8rem; color: #555; }
    .url { font-size: 0.7rem; color: #888; word-break: break-all; }
    @media print { .note { display: none; } }
</style>
</head>
<body>
<h1>Scavenger Hunt QR Codes</h1>
<p class="note">Base URL: <code>${escape(baseUrl)}</code>. Location notes are for organizers only; cut them off before posting.</p>
<div class="grid">
${cards.map(c => `    <div class="card">
        <h2>${escape(c.route.replace('route', 'Route '))} &middot; Stage ${c.stage}</h2>
        <img src="${c.file}" alt="QR for ${escape(c.route)} stage ${c.stage}" />
        <div class="loc">${escape(c.location)}</div>
        <div class="url">${escape(c.url)}</div>
    </div>`).join('\n')}
</div>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), sheet);
console.log(`\nWrote ${cards.length} codes + printable sheet to ${OUT_DIR}/index.html`);
