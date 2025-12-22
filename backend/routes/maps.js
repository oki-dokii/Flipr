import express from 'express';
import { calculateDistance, getRoute, geocodeAddress } from '../services/maps.js';

const router = express.Router();

/**
 * GET /api/maps/config
 * Get Google Maps API Key
 */
router.get('/config', (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Maps API Key not configured' });
    }
    res.json({ apiKey });
});

/**
 * POST /api/maps/distance
 * Calculate distance between two locations
 */
router.post('/distance', async (req, res) => {
    try {
        const { origin, destination } = req.body;

        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const result = await calculateDistance(origin, destination);
        res.json(result);
    } catch (error) {
        console.error('[Maps API] Distance error:', error);
        res.status(500).json({ error: 'Failed to calculate distance' });
    }
});

/**
 * POST /api/maps/route
 * Get detailed route information
 */
router.post('/route', async (req, res) => {
    try {
        const { origin, destination } = req.body;

        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const route = await getRoute(origin, destination);

        if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }

        res.json(route);
    } catch (error) {
        console.error('[Maps API] Route error:', error);
        res.status(500).json({ error: 'Failed to get route' });
    }
});

/**
 * POST /api/maps/geocode
 * Convert address to coordinates
 */
router.post('/geocode', async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const location = await geocodeAddress(address);

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.json(location);
    } catch (error) {
        console.error('[Maps API] Geocode error:', error);
        res.status(500).json({ error: 'Failed to geocode address' });
    }
});

/**
 * GET /api/maps/route/:shipmentId/:truckId
 * Get route between dealer location and shipment destination
 */
router.get('/route/:shipmentId/:truckId', async (req, res) => {
    try {
        const { shipmentId, truckId } = req.params;

        // Get shipment details
        const shipment = req.db.prepare(`
            SELECT s.*, u.latitude as warehouse_lat, u.longitude as warehouse_lng, u.city as warehouse_city
            FROM shipments s
            JOIN users u ON s.warehouse_id = u.id
            WHERE s.id = ?
        `).get(shipmentId);

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Get truck/dealer details
        const truck = req.db.prepare(`
            SELECT t.*, u.latitude as dealer_lat, u.longitude as dealer_lng, u.city as dealer_city
            FROM trucks t
            JOIN users u ON t.dealer_id = u.id
            WHERE t.id = ?
        `).get(truckId);

        if (!truck) {
            return res.status(404).json({ error: 'Truck not found' });
        }

        // Build origin and destination strings
        const origin = truck.dealer_lat && truck.dealer_lng
            ? `${truck.dealer_lat},${truck.dealer_lng}`
            : truck.dealer_city || 'Mumbai, India';

        const destination = shipment.destination_latitude && shipment.destination_longitude
            ? `${shipment.destination_latitude},${shipment.destination_longitude}`
            : `${shipment.destination_city}, ${shipment.destination_state}, India`;

        const route = await getRoute(origin, destination);

        if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }

        res.json({
            ...route,
            origin: {
                city: truck.dealer_city,
                lat: truck.dealer_lat,
                lng: truck.dealer_lng,
            },
            destination: {
                city: shipment.destination_city,
                state: shipment.destination_state,
                lat: shipment.destination_latitude,
                lng: shipment.destination_longitude,
            },
        });
    } catch (error) {
        console.error('[Maps API] Shipment route error:', error);
        res.status(500).json({ error: 'Failed to get route' });
    }
});

export default router;
