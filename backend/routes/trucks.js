import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    createTruck,
    getTrucksByDealer,
    getTruckById,
    updateTruck,
    deleteTruck,
    getAvailableTrucks
} from '../models/Truck.js';
import { uploadTruckImage } from '../middleware/upload.js';

const router = express.Router();

// Register new truck (dealer only)
router.post('/', authenticateToken, requireRole('dealer'), async (req, res) => {
    try {
        const truckData = req.body;

        // Validation
        const requiredFields = [
            'truck_name', 'truck_type', 'max_weight_kg', 'max_volume_m3',
            'length_m', 'width_m', 'height_m', 'service_regions', 'cost_per_km', 'base_cost'
        ];

        for (const field of requiredFields) {
            if (!truckData[field]) {
                return res.status(400).json({ error: `${field} is required` });
            }
        }

        // Validate service_regions is an array
        if (!Array.isArray(truckData.service_regions) || truckData.service_regions.length === 0) {
            return res.status(400).json({ error: 'service_regions must be a non-empty array' });
        }

        const truckId = createTruck(req.userId, truckData);

        res.status(201).json({
            message: 'Truck registered successfully',
            truckId
        });
    } catch (error) {
        console.error('Truck registration error:', error);
        res.status(500).json({ error: 'Failed to register truck' });
    }
});

// Get trucks (role-based)
router.get('/', authenticateToken, (req, res) => {
    try {
        if (req.userRole === 'dealer') {
            // Dealers see their own trucks
            const trucks = getTrucksByDealer(req.userId);
            res.json({ trucks });
        } else {
            // Warehouse users see available trucks
            const filters = {
                min_weight: req.query.min_weight,
                min_volume: req.query.min_volume,
                truck_type: req.query.truck_type
            };
            const trucks = getAvailableTrucks(filters);
            res.json({ trucks });
        }
    } catch (error) {
        console.error('Get trucks error:', error);
        res.status(500).json({ error: 'Failed to fetch trucks' });
    }
});

// Get single truck
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const truck = getTruckById(req.params.id);

        if (!truck) {
            return res.status(404).json({ error: 'Truck not found' });
        }

        // Dealers can only see their own trucks
        if (req.userRole === 'dealer' && truck.dealer_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ truck });
    } catch (error) {
        console.error('Get truck error:', error);
        res.status(500).json({ error: 'Failed to fetch truck' });
    }
});

// Update truck (dealer only)
router.put('/:id', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const success = updateTruck(req.params.id, req.userId, req.body);

        if (!success) {
            return res.status(404).json({ error: 'Truck not found or access denied' });
        }

        res.json({ message: 'Truck updated successfully' });
    } catch (error) {
        console.error('Update truck error:', error);
        res.status(500).json({ error: 'Failed to update truck' });
    }
});

// Delete truck (dealer only)
router.delete('/:id', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const success = deleteTruck(req.params.id, req.userId);

        if (!success) {
            return res.status(404).json({ error: 'Truck not found or access denied' });
        }

        res.json({ message: 'Truck deleted successfully' });
    } catch (error) {
        console.error('Delete truck error:', error);
        res.status(500).json({ error: 'Failed to delete truck' });
    }
});

// Upload truck image (dealer only)
router.post('/:id/upload-image',
    authenticateToken,
    requireRole('dealer'),
    uploadTruckImage.single('image'),
    async (req, res) => {
        try {
            const truckId = req.params.id;

            // Verify truck ownership
            const truck = getTruckById(truckId);
            if (!truck) {
                return res.status(404).json({ error: 'Truck not found' });
            }

            if (truck.dealer_id !== req.userId) {
                return res.status(403).json({ error: 'Access denied - not your truck' });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'No image file uploaded' });
            }

            // Generate image URL
            const imageUrl = `/uploads/trucks/${req.file.filename}`;

            // Update truck with image URL
            const success = updateTruck(truckId, req.userId, {
                ...truck,
                service_regions: truck.service_regions,
                image_url: imageUrl
            });

            if (!success) {
                return res.status(500).json({ error: 'Failed to update truck with image' });
            }

            res.json({
                message: 'Image uploaded successfully',
                imageUrl
            });
        } catch (error) {
            console.error('Upload image error:', error);
            res.status(500).json({ error: error.message || 'Failed to upload image' });
        }
    }
);

export default router;
