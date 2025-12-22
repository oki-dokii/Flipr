import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { getShipmentById } from '../models/Shipment.js';
import { getAvailableTrucks } from '../models/Truck.js';
import { optimizeTruckForShipment } from '../services/optimizer.js';
import { findUserById } from '../models/User.js';
import { getCityCoordinates } from '../services/addressService.js';

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

        const warehouse = findUserById(req.userId);

        console.log(`[Optimize] optimizing for User ID: ${req.userId}, Warehouse found: ${warehouse ? 'Yes' : 'No'}`);
        if (warehouse) console.log(`[Optimize] Warehouse Loc: ${warehouse.city}, ${warehouse.state}`);

        // Enhance shipment object with origin details
        const enrichedShipment = {
            ...shipment,
            origin_latitude: warehouse?.latitude || null,
            origin_longitude: warehouse?.longitude || null,
            origin_city: warehouse?.city || shipment.origin_city,
            origin_state: warehouse?.state || shipment.origin_state
        };

        // Attempt fallback geocoding if origin coords missing
        if (!enrichedShipment.origin_latitude && enrichedShipment.origin_city) {
            const coords = getCityCoordinates(enrichedShipment.origin_city);
            if (coords) {
                enrichedShipment.origin_latitude = coords.lat;
                enrichedShipment.origin_longitude = coords.lon || coords.lng;
            }
        }

        // Run optimization (NOW ASYNC - uses Google Maps/Fallback for real distances!)
        // Note: Optimizer now calculates Truck -> Shipment Origin distance
        const recommendations = await optimizeTruckForShipment(enrichedShipment, trucks);

        res.json({
            shipment: {
                id: shipment.id,
                name: shipment.shipment_name,
                weight: shipment.weight_kg,
                volume: shipment.volume_m3,
                origin: enrichedShipment.origin_city && enrichedShipment.origin_state
                    ? `${enrichedShipment.origin_city}, ${enrichedShipment.origin_state}`
                    : enrichedShipment.origin_city || null,
                destination: enrichedShipment.destination_city && enrichedShipment.destination_state
                    ? `${enrichedShipment.destination_city}, ${enrichedShipment.destination_state}`
                    : enrichedShipment.destination
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
