import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getShipmentById } from '../models/Shipment.js';
import { getAvailableTrucks } from '../models/Truck.js';
import { optimizeTruckForShipment } from '../services/optimizer.js';

const router = express.Router();

// Get optimized truck recommendations for a shipment
router.post('/:shipmentId', authenticateToken, requireRole('warehouse'), async (req, res) => {
    try {
        const shipmentId = req.params.shipmentId;

        // Get shipment details
        const shipment = getShipmentById(shipmentId);
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Verify ownership
        if (shipment.warehouse_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get all available trucks
        const trucks = getAvailableTrucks();

        if (trucks.length === 0) {
            return res.json({
                shipment: {
                    id: shipment.id,
                    name: shipment.shipment_name,
                    weight: shipment.weight_kg,
                    volume: shipment.volume_m3,
                    destination: shipment.destination
                },
                recommendations: [],
                message: 'No available trucks found'
            });
        }

        // Run optimization
        const recommendations = optimizeTruckForShipment(shipment, trucks);

        res.json({
            shipment: {
                id: shipment.id,
                name: shipment.shipment_name,
                weight: shipment.weight_kg,
                volume: shipment.volume_m3,
                destination: shipment.destination
            },
            recommendations,
            message: recommendations.length === 0
                ? 'No suitable trucks found for this shipment'
                : `Found ${recommendations.length} recommended truck(s)`
        });
    } catch (error) {
        console.error('Optimization error:', error);
        res.status(500).json({ error: 'Optimization failed' });
    }
});

export default router;
