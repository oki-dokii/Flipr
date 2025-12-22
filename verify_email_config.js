import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from backend directory
dotenv.config({ path: path.join(__dirname, 'backend/.env') });

console.log('Testing Email Configuration...');
console.log('User:', process.env.EMAIL_USER);
// Don't log full password, just check if it exists
console.log('Pass:', process.env.EMAIL_PASS ? '****** (Present)' : 'MISSING');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendTestEmail = async () => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'LoadOptimize Configuration Verification',
            text: 'If you are reading this, your email configuration is correct!'
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Email Failed:');
        console.error(error.message);
        if (error.response) console.error('Server Response:', error.response);
    }
};

sendTestEmail();
