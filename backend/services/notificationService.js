/**
 * Notification Service
 * For hackathon: Console logging instead of actual emails
 */

/**
 * Send booking approval notification to warehouse
 * @param {object} booking - Full booking object with all details
 */
export const sendBookingApprovedEmail = async (booking) => {
    const message = `
╔════════════════════════════════════════════════════════════╗
║          ✅ BOOKING APPROVED                               ║
╠════════════════════════════════════════════════════════════╣
║  Good news! The dealer has approved your booking request.  ║
║                                                            ║
║  🚚 Truck: ${(booking.truck_name || 'N/A').padEnd(45)}║
║  📦 Shipment: ${(booking.shipment_name || 'N/A').padEnd(42)}║
║  🏢 Dealer: ${(booking.dealer_name || 'N/A').padEnd(44)}║
║  📍 Destination: ${(booking.destination_city || 'N/A').padEnd(39)}║
╠════════════════════════════════════════════════════════════╣
║  The shipment status has been updated to "Assigned"        ║
║  View details: http://localhost:8080/shipments             ║
╚════════════════════════════════════════════════════════════╝
  `;

    console.log(message);
    return true;
};

/**
 * Send booking rejection notification to warehouse
 * @param {object} booking - Full booking object with all details
 */
export const sendBookingRejectedEmail = async (booking) => {
    const message = `
╔════════════════════════════════════════════════════════════╗
║          ❌ BOOKING REJECTED                               ║
╠════════════════════════════════════════════════════════════╣
║  Unfortunately, the dealer has declined your request.      ║
║                                                            ║
║  🚚 Truck: ${(booking.truck_name || 'N/A').padEnd(45)}║
║  📦 Shipment: ${(booking.shipment_name || 'N/A').padEnd(42)}║
║  📍 Destination: ${(booking.destination_city || 'N/A').padEnd(39)}║
╠════════════════════════════════════════════════════════════╣
║  You can try requesting a different truck from the         ║
║  recommendations page.                                     ║
╚════════════════════════════════════════════════════════════╝
  `;

    console.log(message);
    return true;
};

/**
 * Send booking request notification to dealer
 * @param {string} dealerEmail - Dealer's email address
 * @param {object} bookingDetails - Details about the booking
 */
export const sendBookingRequestEmail = async (dealerEmail, bookingDetails) => {
    const message = `
╔════════════════════════════════════════════════════════════╗
║          📧 BOOKING REQUEST NOTIFICATION                   ║
╠════════════════════════════════════════════════════════════╣
║  To: ${dealerEmail.padEnd(50)}     ║
║  Subject: New Truck Booking Request                        ║
╠════════════════════════════════════════════════════════════╣
║  🚚 Truck: ${bookingDetails.truckName.padEnd(45)}║
║  📦 Shipment: ${bookingDetails.shipmentName.padEnd(42)}║
║  📍 Destination: ${bookingDetails.destination.padEnd(39)}║
║  ⚖️  Weight: ${String(bookingDetails.weight + 'kg').padEnd(45)}║
║  📏 Volume: ${String(bookingDetails.volume + 'm³').padEnd(45)}║
╠════════════════════════════════════════════════════════════╣ ║  👉 Login to approve/reject:                               ║
║     http://localhost:8080/booking-requests                 ║
╚════════════════════════════════════════════════════════════╝
  `;

    console.log(message);
    return true;
};

// In production, you would use nodemailer:
// const transporter = nodemailer.createTransporter({...});
// await transporter.sendMail({...});
