
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { consolidateShipments, runSimulation } from '../services/optimizationService.js';

const router = express.Router();

// GET /api/optimization/consolidate
// Analyze pending shipments and suggest grouping
router.get('/consolidate', authenticateToken, async (req, res) => {
    try {
        const warehouseId = req.userId; // Assumption: user is warehouse
        const result = await consolidateShipments(warehouseId);
        res.json(result);
    } catch (error) {
        console.error('Consolidation error:', error);
        res.status(500).json({ error: 'Failed to consolidate shipments' });
    }
});

// POST /api/optimization/simulate
// Run cost simulation on selected shipments
router.post('/simulate', authenticateToken, async (req, res) => {
    try {
        const { shipmentIds, options } = req.body;

        if (!shipmentIds || !Array.isArray(shipmentIds)) {
            return res.status(400).json({ error: 'shipmentIds array is required' });
        }

        const result = await runSimulation(shipmentIds, options);
        res.json(result);
    } catch (error) {
        console.error('Simulation error:', error);
        res.status(500).json({ error: 'Failed to run simulation' });
    }
});

export default router;
