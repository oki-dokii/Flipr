import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Go up one level from utils to backend root
const logDir = path.join(__dirname, '..', 'logs');

// Ensure stats directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'error.log');

export const logError = (error, req = null) => {
    const timestamp = new Date().toISOString();
    const errorMessage = error.stack || error.message || error;
    const requestInfo = req ? `[${req.method} ${req.url}] User:${req.userId || 'anon'}` : '';

    const logEntry = `[${timestamp}] ${requestInfo}\n${errorMessage}\n----------------------------------------\n`;

    // Always log to console for dev visibility
    console.error(`[${timestamp}] ERROR:`, errorMessage);

    // Append to file
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
};
