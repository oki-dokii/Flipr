import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import db from '../database.js';

const router = express.Router();

// Get Admin Overview Stats
router.get('/stats', authenticateToken, requireRole('admin'), (req, res) => {
    try {
        // Total Users
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
        const totalWarehouses = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'warehouse'").get().count;
        const totalDealers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'dealer'").get().count;

        // Total Shipments
        const totalShipments = db.prepare('SELECT COUNT(*) as count FROM shipments').get().count;
        const completedShipments = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'delivered'").get().count;
        const activeShipments = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status IN ('assigned', 'in_transit')").get().count;

        // Total Trucks
        const totalTrucks = db.prepare('SELECT COUNT(*) as count FROM trucks').get().count;
        const availableTrucks = db.prepare("SELECT COUNT(*) as count FROM trucks WHERE availability_status = 'available'").get().count;

        // System Health (Mock)
        const systemHealth = {
            status: 'operational', // functional
            uptime: Math.floor(process.uptime()),
            lastBackup: new Date().toISOString() // Mock
        };

        // Recent Activity (Combined Shipments & Bookings)
        const recentActivity = db.prepare(`
            SELECT 'shipment' as type, shipment_name as description, created_at as date FROM shipments
            UNION ALL
            SELECT 'booking' as type, 'Booking for ' || shipment_id as description, requested_at as date FROM booking_requests
            ORDER BY date DESC
            LIMIT 10
        `).all();

        res.json({
            stats: {
                totalUsers,
                totalWarehouses,
                totalDealers,
                totalShipments,
                completedShipments,
                activeShipments,
                totalTrucks,
                availableTrucks
            },
            systemHealth,
            recentActivity
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

// Get all users
router.get('/users', authenticateToken, requireRole('admin'), (req, res) => {
    try {
        const users = db.prepare('SELECT id, name, email, role, company, city, state, created_at FROM users ORDER BY created_at DESC').all();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get all shipments
router.get('/shipments', authenticateToken, requireRole('admin'), (req, res) => {
    try {
        const shipments = db.prepare(`
            SELECT s.*, u.company as warehouse_name 
            FROM shipments s
            LEFT JOIN users u ON s.warehouse_id = u.id
            ORDER BY s.created_at DESC
        `).all();
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch shipments' });
    }
});

// Get all trucks
router.get('/trucks', authenticateToken, requireRole('admin'), (req, res) => {
    try {
        const trucks = db.prepare(`
            SELECT t.*, u.company as dealer_name
            FROM trucks t
            LEFT JOIN users u ON t.dealer_id = u.id
            ORDER BY t.created_at DESC
        `).all();
        res.json(trucks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trucks' });
    }
});

export default router;
