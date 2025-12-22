import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import db from '../database.js';

const router = express.Router();

// Helper to convert array of objects to CSV string
const toCSV = (data) => {
    if (!data || data.length === 0) return '';

    // Get headers from first object
    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(','));

    // Add data rows
    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header];
            // Escape quotes and wrap in quotes if necessary
            const escaped = ('' + (val ?? '')).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
};

// Export Shipments Report (Warehouse)
router.get('/shipments/csv', authenticateToken, requireRole('warehouse'), (req, res) => {
    try {
        const warehouseId = req.userId;

        const shipments = db.prepare(`
            SELECT 
                s.id, 
                s.shipment_name, 
                s.origin_city, 
                s.destination_city, 
                s.status,
                s.created_at,
                s.delivery_deadline,
                s.weight_kg,
                s.volume_m3,
                s.priority
            FROM shipments s
            WHERE s.warehouse_id = ?
            ORDER BY s.created_at DESC
        `).all(warehouseId);

        const csv = toCSV(shipments);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=shipments_report.csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error('Export shipments error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

// Export Bookings/Trucks Report (Dealer)
router.get('/bookings/csv', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const dealerId = req.userId;

        const bookings = db.prepare(`
            SELECT 
                br.id as booking_id,
                br.status,
                br.requested_at,
                t.truck_name,
                t.truck_type,
                s.origin_city,
                s.destination_city,
                s.shipment_name
            FROM booking_requests br
            JOIN trucks t ON br.truck_id = t.id
            JOIN shipments s ON br.shipment_id = s.id
            WHERE br.dealer_id = ?
            ORDER BY br.requested_at DESC
        `).all(dealerId);

        const csv = toCSV(bookings);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=bookings_report.csv');
        res.status(200).send(csv);
    } catch (error) {
        console.error('Export bookings error:', error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

export default router;
