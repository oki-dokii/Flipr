import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    // For development, use ethereal email (fake SMTP)
    // For production, use real SMTP credentials from environment variables

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
        // Production configuration
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_PORT === '465',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    } else {
        // Development: Log emails to console instead of sending
        console.log('⚠️  Email service running in development mode - emails will be logged to console');
        return null;
    }
};

const transporter = createTransporter();

/**
 * Send email notification when booking is approved
 */
export const sendBookingApprovedEmail = async (bookingData) => {
    const { warehouse_email, warehouse_name, shipment_name, truck_name, dealer_name } = bookingData;

    const subject = '✅ Booking Request Approved';
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .label { font-weight: bold; color: #6b7280; }
                .value { color: #111827; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Booking Approved!</h1>
                </div>
                <div class="content">
                    <p>Hi ${warehouse_name},</p>
                    <p>Great news! Your booking request has been approved by ${dealer_name}.</p>
                    
                    <div class="details">
                        <h3>Booking Details</h3>
                        <div class="detail-row">
                            <span class="label">Shipment:</span>
                            <span class="value">${shipment_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Truck:</span>
                            <span class="value">${truck_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Dealer:</span>
                            <span class="value">${dealer_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value" style="color: #10b981;">✅ Approved</span>
                        </div>
                    </div>
                    
                    <p>Your shipment has been assigned to the truck. The dealer will coordinate with you for pickup and delivery.</p>
                    
                    <center>
                        <a href="http://localhost:8080/bookings/my-bookings" class="button">View My Bookings</a>
                    </center>
                    
                    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                        This is an automated notification from Smart Load Optimize.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(warehouse_email, subject, html);
};

/**
 * Send email notification when booking is rejected
 */
export const sendBookingRejectedEmail = async (bookingData) => {
    const { warehouse_email, warehouse_name, shipment_name, truck_name, dealer_name } = bookingData;

    const subject = '❌ Booking Request Declined';
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .button { display: inline-block; background: #14b8a6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .label { font-weight: bold; color: #6b7280; }
                .value { color: #111827; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Booking Request Update</h1>
                </div>
                <div class="content">
                    <p>Hi ${warehouse_name},</p>
                    <p>Unfortunately, your booking request has been declined by ${dealer_name}.</p>
                    
                    <div class="details">
                        <h3>Booking Details</h3>
                        <div class="detail-row">
                            <span class="label">Shipment:</span>
                            <span class="value">${shipment_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Truck:</span>
                            <span class="value">${truck_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Dealer:</span>
                            <span class="value">${dealer_name}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value" style="color: #ef4444;">❌ Declined</span>
                        </div>
                    </div>
                    
                    <p><strong>What's next?</strong></p>
                    <ul>
                        <li>Review other truck recommendations for your shipment</li>
                        <li>Request booking with a different truck</li>
                        <li>Contact the dealer for more information</li>
                    </ul>
                    
                    <center>
                        <a href="http://localhost:8080/shipments" class="button">View Shipments</a>
                    </center>
                    
                    <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                        This is an automated notification from Smart Load Optimize.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;

    return sendEmail(warehouse_email, subject, html);
};

/**
 * Helper function to send email
 */
const sendEmail = async (to, subject, html) => {
    if (!transporter) {
        // Development mode - log to console
        console.log('\n📧 EMAIL NOTIFICATION (Development Mode)');
        console.log('═══════════════════════════════════════');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log('───────────────────────────────────────');
        console.log('Email content would be sent in production');
        console.log('═══════════════════════════════════════\n');
        return { success: true, mode: 'development' };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Smart Load Optimize" <noreply@smartload.com>',
            to,
            subject,
            html
        });

        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
    }
};

export default {
    sendBookingApprovedEmail,
    sendBookingRejectedEmail
};
