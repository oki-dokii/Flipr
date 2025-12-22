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

    // Real Email Alert for Critical Errors
    let alertLog = '';
    const isCritical = errorMessage.includes('CRITICAL') || errorMessage.includes('Connection failed') || errorMessage.includes('System Alert');

    if (isCritical) {
        alertLog = `[ALERT SENT] Subject: Critical Error Detected | Timestamp: ${timestamp}\n`;

        // Fire and forget email
        import('./emailService.js').then(({ sendAlertEmail }) => {
            sendAlertEmail('Critical Error Detected', `Error Details:\n${errorMessage}\n\nRequest Info:\n${requestInfo}`)
                .then(result => {
                    if (result && result.previewUrl) {
                        const successMsg = `[EMAIL SUCCESS] View at: ${result.previewUrl}\n`;
                        fs.appendFile(logFile, successMsg, () => { });
                        console.log(successMsg.trim());
                    }
                })
                .catch(err => console.error('Failed to send email:', err));
        }).catch(err => console.error('Failed to load email service:', err));
    }

    const logEntry = `[${timestamp}] ${requestInfo}\n${alertLog}${errorMessage}\n----------------------------------------\n`;

    // Always log to console for dev visibility
    console.error(`[${timestamp}] ERROR:`, errorMessage);

    // Append to file
    fs.appendFile(logFile, logEntry, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
};
