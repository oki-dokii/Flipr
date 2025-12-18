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

const router = express.Router();

// Upload new shipment (warehouse only)
router.post('/', authenticateToken, requireRole('warehouse'), async (req, res) => {
    try {
        const shipmentData = req.body;

        // Validation
        const requiredFields = [
            'shipment_name', 'weight_kg', 'volume_m3', 'destination', 'delivery_deadline'
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
router.put('/:id/deliver', authenticateToken, requireRole('dealer'), (req, res) => {
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

        const success = updateShipment(req.params.id, shipment.warehouse_id, {
            ...shipment,
            status: 'delivered'
        });

        if (!success) {
            return res.status(500).json({ error: 'Failed to update shipment status' });
        }

        res.json({ message: 'Shipment marked as delivered' });
    } catch (error) {
        console.error('Update to delivered error:', error);
        res.status(500).json({ error: 'Failed to update shipment status' });
    }
});

export default router;
