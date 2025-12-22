import { sendAlertEmail } from './backend/utils/emailService.js';

const verify = async () => {
    console.log('Sending Test Email via Ethereal...');
    const result = await sendAlertEmail('Test Verification', 'This is a test to verify Ethereal configuration.');

    if (result && result.previewUrl) {
        console.log('✅ Success! Preview URL:', result.previewUrl);
    } else {
        console.error('❌ Failed to get preview URL');
    }
};

verify();
