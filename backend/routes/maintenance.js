import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    createMaintenance,
    getMaintenanceByTruck,
    getMaintenanceByDealer,
    getUpcomingMaintenance,
    getMaintenanceById,
    updateMaintenance,
    completeMaintenance,
    deleteMaintenance
} from '../models/Maintenance.js';

const router = express.Router();

// Get all maintenance records for dealer's trucks
router.get('/', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const { status } = req.query;
        const maintenance = getMaintenanceByDealer(req.userId, status);
        res.json({ maintenance });
    } catch (error) {
        console.error('Get maintenance error:', error);
        res.status(500).json({ error: 'Failed to fetch maintenance records' });
    }
});

// Get upcoming maintenance (next 30 days)
router.get('/upcoming', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const maintenance = getUpcomingMaintenance(req.userId);
        res.json({ maintenance });
    } catch (error) {
        console.error('Get upcoming maintenance error:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming maintenance' });
    }
});

// Get maintenance records for a specific truck
router.get('/truck/:truckId', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const maintenance = getMaintenanceByTruck(req.params.truckId);
        res.json({ maintenance });
    } catch (error) {
        console.error('Get truck maintenance error:', error);
        res.status(500).json({ error: 'Failed to fetch truck maintenance' });
    }
});

// Get single maintenance record
router.get('/:id', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const maintenance = getMaintenanceById(req.params.id);

        if (!maintenance) {
            return res.status(404).json({ error: 'Maintenance record not found' });
        }

        // Verify ownership
        if (maintenance.dealer_id !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json({ maintenance });
    } catch (error) {
        console.error('Get maintenance error:', error);
        res.status(500).json({ error: 'Failed to fetch maintenance record' });
    }
});

// Create new maintenance record
router.post('/', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const { truck_id, maintenance_type, scheduled_date, notes, cost } = req.body;

        // Validation
        if (!truck_id || !maintenance_type || !scheduled_date) {
            return res.status(400).json({
                error: 'truck_id, maintenance_type, and scheduled_date are required'
            });
        }

        const maintenanceId = createMaintenance(truck_id, req.userId, {
            maintenance_type,
            scheduled_date,
            notes,
            cost
        });

        const maintenance = getMaintenanceById(maintenanceId);
        res.status(201).json({
            message: 'Maintenance scheduled successfully',
            maintenance
        });
    } catch (error) {
        console.error('Create maintenance error:', error);
        res.status(500).json({ error: error.message || 'Failed to create maintenance record' });
    }
});

// Update maintenance record
router.put('/:id', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const { maintenance_type, scheduled_date, notes, cost, status } = req.body;

        const success = updateMaintenance(req.params.id, req.userId, {
            maintenance_type,
            scheduled_date,
            notes,
            cost,
            status
        });

        if (success) {
            const maintenance = getMaintenanceById(req.params.id);
            res.json({
                message: 'Maintenance updated successfully',
                maintenance
            });
        } else {
            res.status(404).json({ error: 'Maintenance record not found' });
        }
    } catch (error) {
        console.error('Update maintenance error:', error);
        res.status(500).json({ error: error.message || 'Failed to update maintenance record' });
    }
});

// Mark maintenance as completed
router.put('/:id/complete', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const { completion_date, notes, cost } = req.body;

        const success = completeMaintenance(req.params.id, req.userId, {
            completion_date,
            notes,
            cost
        });

        if (success) {
            const maintenance = getMaintenanceById(req.params.id);
            res.json({
                message: 'Maintenance marked as completed',
                maintenance
            });
        } else {
            res.status(404).json({ error: 'Maintenance record not found' });
        }
    } catch (error) {
        console.error('Complete maintenance error:', error);
        res.status(500).json({ error: error.message || 'Failed to complete maintenance' });
    }
});

// Delete maintenance record
router.delete('/:id', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const success = deleteMaintenance(req.params.id, req.userId);

        if (success) {
            res.json({ message: 'Maintenance record deleted successfully' });
        } else {
            res.status(404).json({ error: 'Maintenance record not found' });
        }
    } catch (error) {
        console.error('Delete maintenance error:', error);
        res.status(500).json({ error: error.message || 'Failed to delete maintenance record' });
    }
});

export default router;
