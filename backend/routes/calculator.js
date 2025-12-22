import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { calculateTotalVolume, estimateWeightFromVolume, validateBoxes, calculateBoxSummary } from '../services/volumeCalculator.js';
import { createCalculatorLog, getCalculatorLogsByUser } from '../models/CalculatorLog.js';
import { optimizeTruckForShipment } from '../services/optimizer.js';
import { getAvailableTrucks } from '../models/Truck.js';

const router = express.Router();

/**
 * POST /api/calculator/estimate
 * Calculate volume and get truck recommendations
 */
router.post('/estimate', async (req, res) => {
    try {
        const { boxes, destination } = req.body;

        // Validate boxes
        const validation = validateBoxes(boxes);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Validate destination
        if (!destination || !destination.city || !destination.state) {
            return res.status(400).json({ error: 'Destination city and state are required' });
        }

        // Calculate volume and weight
        const summary = calculateBoxSummary(boxes);

        // Create a temporary shipment object for optimizer
        const tempShipment = {
            weight_kg: summary.estimatedWeight,
            volume_m3: summary.totalVolume,
            destination_city: destination.city,
            destination_state: destination.state,
            delivery_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        };

        // Get available trucks
        const trucks = getAvailableTrucks();

        // Check if there are any trucks
        if (!trucks || trucks.length === 0) {
            return res.json({
                summary,
                recommendations: [],
                destination,
                message: 'No trucks available. Please add trucks to get recommendations.'
            });
        }

        // Get truck recommendations
        const recommendations = await optimizeTruckForShipment(tempShipment, trucks);

        // Log calculator usage
        const userId = req.userId || null; // Optional - works for both logged in and anonymous
        const recommendedTruckId = recommendations.length > 0 ? recommendations[0].truck.id : null;

        createCalculatorLog({
            user_id: userId,
            boxes_data: boxes,
            destination_city: destination.city,
            destination_state: destination.state,
            total_volume_m3: summary.totalVolume,
            total_weight_kg: summary.estimatedWeight,
            recommended_truck_id: recommendedTruckId
        });

        res.json({
            summary,
            recommendations,
            destination
        });
    } catch (error) {
        console.error('Calculator estimate error:', error);
        res.status(500).json({ error: 'Failed to calculate estimate' });
    }
});

/**
 * GET /api/calculator/history
 * Get calculator history for logged-in user
 */
router.get('/history', authenticateToken, (req, res) => {
    try {
        const logs = getCalculatorLogsByUser(req.userId, 20);
        res.json({ logs });
    } catch (error) {
        console.error('Get calculator history error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

export default router;
