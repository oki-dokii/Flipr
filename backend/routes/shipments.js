import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    createShipment,
    getShipmentsByWarehouse,
    getShipmentById,
    updateShipment,
    deleteShipment,
    getPendingShipments
} from '../models/Shipment.js';
import { calculateMockLocation, calculateETA, getTrackingTimeline } from '../services/trackingService.js';
import db from '../database.js';

const router = express.Router();

// Get Pending Shipments for Optimization
router.get('/pending', authenticateToken, requireRole('warehouse'), (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM shipments WHERE warehouse_id = ? AND status = "pending" ORDER BY created_at DESC');
        const shipments = stmt.all(req.userId);
        res.json(shipments);
    } catch (error) {
        console.error('Get pending shipments error:', error);
        res.status(500).json({ error: 'Failed to fetch pending shipments' });
    }
});

// Upload new shipment (warehouse only)
router.post('/', authenticateToken, requireRole('warehouse'), async (req, res) => {
    try {
        const shipmentData = req.body;

        // Validation
        const requiredFields = [
            'shipment_name', 'weight_kg', 'volume_m3', 'destination_city', 'destination_state', 'delivery_deadline'
        ];

        for (const field of requiredFields) {
            if (!shipmentData[field]) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }

        const shipmentId = createShipment(req.userId, shipmentData);

        res.status(201).json({
            message: 'Shipment uploaded successfully',
            shipmentId
        });
    } catch (error) {
        console.error('Shipment upload error:', error);
        res.status(500).json({ error: 'Failed to upload shipment' });
    }
});

// Get shipments (role-based)
router.get('/', authenticateToken, (req, res) => {
    try {
        if (req.userRole === 'warehouse') {
            // Warehouses see their own shipments
            const shipments = getShipmentsByWarehouse(req.userId);
            res.json({ shipments });
        } else {
            // Dealers see pending shipments for optimization
            const shipments = getPendingShipments();
            res.json({ shipments });
        }
    } catch (error) {
        console.error('Get shipments error:', error);
        res.status(500).json({ error: 'Failed to fetch shipments' });
    }
});

// Get single shipment
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const shipment = getShipmentById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Warehouses can only see their own shipments
        if (req.userRole === 'warehouse' && shipment.warehouse_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ shipment });
    } catch (error) {
        console.error('Get shipment error:', error);
        res.status(500).json({ error: 'Failed to fetch shipment' });
    }
});

// Update shipment (warehouse only)
router.put('/:id', authenticateToken, requireRole('warehouse'), (req, res) => {
    try {
        const success = updateShipment(req.params.id, req.userId, req.body);

        if (!success) {
            return res.status(404).json({ error: 'Shipment not found or access denied' });
        }

        res.json({ message: 'Shipment updated successfully' });
    } catch (error) {
        console.error('Update shipment error:', error);
        res.status(500).json({ error: 'Failed to update shipment' });
    }
});

// Delete shipment (warehouse only)
router.delete('/:id', authenticateToken, requireRole('warehouse'), (req, res) => {
    try {
        const success = deleteShipment(req.params.id, req.userId);

        if (!success) {
            return res.status(404).json({ error: 'Shipment not found or access denied' });
        }

        res.json({ message: 'Shipment deleted successfully' });
    } catch (error) {
        console.error('Delete shipment error:', error);
        res.status(500).json({ error: 'Failed to delete shipment' });
    }
});

// Update shipment status to in_transit (dealer only)
router.put('/:id/in-transit', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const shipment = getShipmentById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        if (shipment.status !== 'assigned') {
            return res.status(400).json({
                error: 'Shipment must be assigned before marking as in transit',
                currentStatus: shipment.status
            });
        }

        const success = updateShipment(req.params.id, shipment.warehouse_id, {
            ...shipment,
            status: 'in_transit'
        });

        if (!success) {
            return res.status(500).json({ error: 'Failed to update shipment status' });
        }

        res.json({ message: 'Shipment marked as in transit' });
    } catch (error) {
        console.error('Update to in-transit error:', error);
        res.status(500).json({ error: 'Failed to update shipment status' });
    }
});

// Update shipment status to delivered (dealer only)
router.put('/:id/deliver', authenticateToken, requireRole('dealer'), async (req, res) => {
    try {
        const shipment = getShipmentById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        if (shipment.status !== 'in_transit') {
            return res.status(400).json({
                error: 'Shipment must be in transit before marking as delivered',
                currentStatus: shipment.status
            });
        }

        // Get the booking to find the truck
        const { getBookingByShipmentId } = await import('../models/Booking.js');
        const { updateTruckAnalytics } = await import('../models/Truck.js');
        const { getTruckById } = await import('../models/Truck.js');

        const booking = getBookingByShipmentId(req.params.id);

        if (booking && booking.truck_id) {
            const truck = getTruckById(booking.truck_id);

            // Calculate distance (use estimated or actual)
            const distance = shipment.estimated_distance_km || 0;

            // Calculate CO₂ saved based on utilization
            // Formula: utilization% × distance × emission_factor
            const weightUtilization = shipment.weight_kg / truck.max_weight_kg;
            const volumeUtilization = shipment.volume_m3 / truck.max_volume_m3;
            const avgUtilization = (weightUtilization + volumeUtilization) / 2;

            // 0.5 kg CO₂ per km baseline, scaled by utilization
            const co2Saved = avgUtilization * distance * 0.5;

            // Update truck analytics
            updateTruckAnalytics(booking.truck_id, distance, co2Saved);
        }

        // Update shipment status and delivered_at timestamp
        const success = updateShipment(req.params.id, shipment.warehouse_id, {
            ...shipment,
            status: 'delivered'
        });

        if (!success) {
            return res.status(500).json({ error: 'Failed to update shipment status' });
        }

        // Set delivered_at timestamp
        db.prepare('UPDATE shipments SET delivered_at = ? WHERE id = ?')
            .run(new Date().toISOString(), req.params.id);

        // Generate trip summary
        try {
            const { generateTripSummary } = await import('../services/tripService.js');
            const summary = generateTripSummary(req.params.id);
            console.log('[Delivery] Trip summary generated:', summary);
        } catch (summaryError) {
            console.error('[Delivery] Failed to generate trip summary:', summaryError);
            // Don't fail the delivery if summary generation fails
        }

        res.json({ message: 'Shipment marked as delivered' });
    } catch (error) {
        console.error('Update to delivered error:', error);
        res.status(500).json({ error: 'Failed to update shipment status' });
    }
});

// Get shipment tracking data (mock GPS)
router.get('/:id/tracking', authenticateToken, async (req, res) => {
    try {
        const shipmentId = req.params.id;

        // Get shipment details
        const shipment = getShipmentById(shipmentId);
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        // Get warehouse location
        const warehouse = db.prepare('SELECT * FROM users WHERE id = ?').get(shipment.warehouse_id);

        // Get booking and truck info if available
        const booking = db.prepare(`
            SELECT b.*, t.truck_name, t.truck_type, u.city as dealer_city, u.latitude as dealer_lat, u.longitude as dealer_lng
            FROM booking_requests b
            JOIN trucks t ON b.truck_id = t.id
            JOIN users u ON t.dealer_id = u.id
            WHERE b.shipment_id = ? AND b.status = 'approved'
            LIMIT 1
        `).get(shipmentId);

        // Calculate mock location based on status
        const trackingData = calculateMockLocation(shipment, warehouse, {
            latitude: shipment.destination_latitude,
            longitude: shipment.destination_longitude
        });

        // Calculate ETA using delivery deadline
        const distance = shipment.estimated_distance_km || 500;
        const eta = calculateETA(distance, trackingData.progress, shipment.delivery_deadline);

        // Get timeline
        const timeline = getTrackingTimeline(shipment);

        res.json({
            shipment: {
                id: shipment.id,
                name: shipment.shipment_name,
                status: shipment.status,
                destination: `${shipment.destination_city}, ${shipment.destination_state}`
            },
            truck: booking ? {
                name: booking.truck_name,
                type: booking.truck_type,
                dealer_city: booking.dealer_city
            } : null,
            tracking: trackingData,
            eta,
            distance,
            timeline
        });
    } catch (error) {
        console.error('Tracking error:', error);
        res.status(500).json({ error: 'Failed to get tracking data' });
    }
});

// Cleanup endpoint - auto-close old delivered trips
router.post('/cleanup', authenticateToken, requireRole('warehouse'), async (req, res) => {
    try {
        const { autoCloseDeliveredTrips } = await import('../services/tripService.js');
        const daysOld = req.body.daysOld || 7;

        const result = autoCloseDeliveredTrips(daysOld);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Cleanup error:', error);
        res.status(500).json({ error: 'Failed to cleanup trips' });
    }
});

export default router;
