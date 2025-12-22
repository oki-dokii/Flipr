import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSafetyMetrics } from '../models/Booking.js';

const router = express.Router();

// Get safety metrics (user-specific)
router.get('/safety', authenticateToken, (req, res) => {
    try {
        const metrics = getSafetyMetrics(req.userId, req.userRole);
        res.json(metrics);
    } catch (error) {
        console.error('Get safety metrics error:', error);
        res.status(500).json({ error: 'Failed to fetch safety metrics' });
    }
});

export default router;
