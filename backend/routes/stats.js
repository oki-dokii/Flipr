import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import db from '../database.js';

const router = express.Router();

// Get warehouse statistics
router.get('/warehouse', authenticateToken, requireRole('warehouse'), (req, res) => {
    try {
        const warehouseId = req.userId;

        // Total shipments
        const totalShipments = db.prepare(`
            SELECT COUNT(*) as count FROM shipments WHERE warehouse_id = ?
        `).get(warehouseId).count;

        // Optimization percentage (assigned + in_transit + delivered / total)
        const optimizedShipments = db.prepare(`
            SELECT COUNT(*) as count FROM shipments 
            WHERE warehouse_id = ? AND status IN ('assigned', 'in_transit', 'delivered')
        `).get(warehouseId).count;

        const optimizationPercentage = totalShipments > 0
            ? Math.round((optimizedShipments / totalShipments) * 100)
            : 0;

        // Pending bookings count
        const pendingBookings = db.prepare(`
            SELECT COUNT(*) as count FROM booking_requests 
            WHERE warehouse_id = ? AND status = 'requested'
        `).get(warehouseId).count;

        // Average utilization from approved bookings
        const utilizationData = db.prepare(`
            SELECT 
                AVG((s.weight_kg / t.max_weight_kg + s.volume_m3 / t.max_volume_m3) / 2 * 100) as avg_utilization
            FROM booking_requests br
            JOIN shipments s ON br.shipment_id = s.id
            JOIN trucks t ON br.truck_id = t.id
            WHERE br.warehouse_id = ? AND br.status = 'approved'
        `).get(warehouseId);

        const avgUtilization = utilizationData.avg_utilization
            ? Math.round(utilizationData.avg_utilization)
            : 0;

        // Shipment Status Distribution (Pie Chart)
        const statusDistribution = db.prepare(`
            SELECT status, COUNT(*) as count 
            FROM shipments 
            WHERE warehouse_id = ? 
            GROUP BY status
        `).all(warehouseId);

        // Shipments Created Over Time (Bar Chart - Last 7 Days)
        const shipmentsOverTime = db.prepare(`
            SELECT DATE(created_at) as date, COUNT(*) as count
            FROM shipments
            WHERE warehouse_id = ? AND created_at >= date('now', '-7 days')
            GROUP BY DATE(created_at)
            ORDER BY date
        `).all(warehouseId);

        res.json({
            totalShipments,
            optimizationPercentage,
            pendingBookings,
            avgUtilization,
            statusDistribution,
            shipmentsOverTime
        });
    } catch (error) {
        console.error('Get warehouse stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Get dealer statistics
router.get('/dealer', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const dealerId = req.userId;

        // Total trucks
        const totalTrucks = db.prepare(`
            SELECT COUNT(*) as count FROM trucks WHERE dealer_id = ?
        `).get(dealerId).count;

        // Pending booking requests
        const pendingRequests = db.prepare(`
            SELECT COUNT(*) as count FROM booking_requests 
            WHERE dealer_id = ? AND status = 'requested'
        `).get(dealerId).count;

        // Average utilization from approved bookings
        const utilizationData = db.prepare(`
            SELECT 
                AVG((s.weight_kg / t.max_weight_kg + s.volume_m3 / t.max_volume_m3) / 2 * 100) as avg_utilization
            FROM booking_requests br
            JOIN shipments s ON br.shipment_id = s.id
            JOIN trucks t ON br.truck_id = t.id
            WHERE br.dealer_id = ? AND br.status = 'approved'
        `).get(dealerId);

        const avgUtilization = utilizationData.avg_utilization
            ? Math.round(utilizationData.avg_utilization)
            : 0;

        // Truck Availability Status (Pie Chart)
        const truckAvailability = db.prepare(`
            SELECT availability_status as status, COUNT(*) as count
            FROM trucks
            WHERE dealer_id = ?
            GROUP BY availability_status
        `).all(dealerId);

        // Booking Trends (Line Chart - Last 7 Days)
        const bookingTrends = db.prepare(`
            SELECT DATE(requested_at) as date, COUNT(*) as count
            FROM booking_requests
            WHERE dealer_id = ? AND requested_at >= date('now', '-7 days')
            GROUP BY DATE(requested_at)
            ORDER BY date
        `).all(dealerId);

        res.json({
            totalTrucks,
            pendingRequests,
            avgUtilization,
            truckAvailability,
            bookingTrends
        });
    } catch (error) {
        console.error('Get dealer stats error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;
