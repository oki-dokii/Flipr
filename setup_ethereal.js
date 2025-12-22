import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, 'backend', '.env');

const setupEthereal = async () => {
    console.log('Generating Ethereal Test Account...');
    try {
        const testAccount = await nodemailer.createTestAccount();

        console.log('Account Created!');
        console.log('User:', testAccount.user);
        console.log('Pass:', testAccount.pass);

        // Read .env
        let envContent = fs.readFileSync(envPath, 'utf8');

        // Replace or Append
        const newLines = [
            `EMAIL_USER=${testAccount.user}`,
            `EMAIL_PASS=${testAccount.pass}`,
            `EMAIL_HOST=${testAccount.smtp.host}`,
            `EMAIL_PORT=${testAccount.smtp.port}`
        ];

        // Remove old email vars
        envContent = envContent.replace(/^EMAIL_USER=.*$/gm, '');
        envContent = envContent.replace(/^EMAIL_PASS=.*$/gm, '');
        // Clean up empty lines
        envContent = envContent.replace(/^\s*[\r\n]/gm, '');

        // Add new ones
        envContent += '\n' + newLines.join('\n') + '\n';

        fs.writeFileSync(envPath, envContent);
        console.log('Updated backend/.env with Ethereal credentials.');

    } catch (err) {
        console.error('Failed to create account:', err);
    }
};

setupEthereal();
