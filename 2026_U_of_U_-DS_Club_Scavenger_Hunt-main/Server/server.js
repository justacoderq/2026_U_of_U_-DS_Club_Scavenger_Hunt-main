/*
Local entry point for the Scavenger Hunt backend (npm start).
The app itself lives in app.js so Vercel can import it without listening.
*/
import app from './app.js';
import { PORT } from './utils/config.js';

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
