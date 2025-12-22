import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendAlertEmail = async (subject, text) => {
    // 1. Force reload .env to get latest Ethereal credentials
    dotenv.config({ path: path.join(__dirname, '..', '.env'), override: true });

    // 2. Create transporter DYNAMICALLY so it uses the new env vars
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials missing. Skipping email alert.');
        return { success: false, error: 'Missing credentials' };
    }

    const mailOptions = {
        from: '"LoadOptimize System" <admin@loadoptimize.com>',
        to: 'admin@loadoptimize.com',
        subject: `[LoadOptimize Alert] ${subject}`,
        text: text,
        html: `<div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #d9534f;">System Alert Triggered</h2>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; border: 1px solid #f5c6cb;">
                    <pre style="white-space: pre-wrap;">${text}</pre>
                </div>
                <p style="font-size: 12px; color: #777; margin-top: 20px;">
                    This is a test email sent via Ethereal.email.
                </p>
               </div>`
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.messageId);

        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL: ' + previewUrl);

        return { success: true, previewUrl };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
