import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    createBookingRequest,
    getBookingsByWarehouse,
    getBookingsByDealer,
    approveBooking,
    rejectBooking,
    getBookingById,
    checkExistingBooking
} from '../models/Booking.js';
import { getShipmentById, updateShipment } from '../models/Shipment.js';
import { getTruckById, updateTruck } from '../models/Truck.js';
import { sendBookingApprovedEmail, sendBookingRejectedEmail } from '../services/emailService.js';

const router = express.Router();

// Warehouse creates a booking request
router.post('/request', authenticateToken, requireRole('warehouse'), async (req, res) => {
    try {
        const { shipment_id, truck_id, notes } = req.body;

        if (!shipment_id || !truck_id) {
            return res.status(400).json({ error: 'Shipment ID and Truck ID are required' });
        }

        // Verify shipment ownership
        const shipment = getShipmentById(shipment_id);
        if (!shipment) {
            return res.status(404).json({ error: 'Shipment not found' });
        }

        if (shipment.warehouse_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied - not your shipment' });
        }

        // Check if shipment is already assigned
        if (shipment.status !== 'pending') {
            return res.status(400).json({ error: 'Shipment is already assigned or in transit' });
        }

        // Get truck and dealer info
        const truck = getTruckById(truck_id);
        if (!truck) {
            return res.status(404).json({ error: 'Truck not found' });
        }

        if (truck.availability_status !== 'available') {
            return res.status(400).json({ error: 'Truck is not available' });
        }

        // Check for existing booking request
        const existing = checkExistingBooking(shipment_id, truck_id);
        if (existing) {
            return res.status(400).json({
                error: 'Booking request already exists for this truck',
                existingStatus: existing.status
            });
        }

        // Create booking request
        const bookingId = createBookingRequest({
            shipment_id,
            truck_id,
            warehouse_id: req.userId,
            dealer_id: truck.dealer_id,
            notes
        });

        res.json({
            success: true,
            bookingId,
            message: 'Booking request sent to dealer'
        });
    } catch (error) {
        console.error('Booking request error:', error);
        res.status(500).json({ error: 'Failed to create booking request' });
    }
});

// Get warehouse's booking requests
router.get('/warehouse', authenticateToken, requireRole('warehouse'), (req, res) => {
    try {
        const bookings = getBookingsByWarehouse(req.userId);
        res.json({ bookings });
    } catch (error) {
        console.error('Get warehouse bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get dealer's booking requests
router.get('/dealer', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        console.log('=== Dealer Bookings Request ===');
        console.log('Dealer ID:', req.userId);
        console.log('Status filter:', req.query.status);

        const status = req.query.status; // optional filter: 'requested', 'approved', 'rejected'
        const bookings = getBookingsByDealer(req.userId, status);

        console.log('Bookings found:', bookings.length);
        console.log('Bookings data:', JSON.stringify(bookings, null, 2));

        res.json({ bookings });
    } catch (error) {
        console.error('Get dealer bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Dealer approves a booking request
router.put('/:id/approve', authenticateToken, requireRole('dealer'), async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Get booking details
        const booking = getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking request not found' });
        }

        if (booking.dealer_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied - not your truck' });
        }

        if (booking.status !== 'requested') {
            return res.status(400).json({
                error: 'Booking already processed',
                currentStatus: booking.status
            });
        }

        // Approve booking
        const approved = approveBooking(bookingId, req.userId);
        if (!approved) {
            return res.status(500).json({ error: 'Failed to approve booking' });
        }

        // Update shipment status to 'assigned'
        const shipment = getShipmentById(booking.shipment_id);
        updateShipment(booking.shipment_id, booking.warehouse_id, {
            ...shipment,
            status: 'assigned'
        });

        // Update truck availability to 'booked'
        const truck = getTruckById(booking.truck_id);
        updateTruck(booking.truck_id, req.userId, {
            ...truck,
            service_regions: truck.service_regions, // Keep as is
            availability_status: 'booked'
        });

        // Send email notification to warehouse
        try {
            const fullBooking = getBookingById(bookingId);
            await sendBookingApprovedEmail(fullBooking);
        } catch (emailError) {
            console.error('Email notification error:', emailError);
            // Don't fail the request if email fails
        }

        res.json({
            success: true,
            message: 'Booking approved - truck assigned to shipment'
        });
    } catch (error) {
        console.error('Approve booking error:', error);
        res.status(500).json({ error: 'Failed to approve booking' });
    }
});

// Dealer rejects a booking request
router.put('/:id/reject', authenticateToken, requireRole('dealer'), async (req, res) => {
    try {
        const bookingId = req.params.id;

        // Get booking details
        const booking = getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: 'Booking request not found' });
        }

        if (booking.dealer_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied - not your truck' });
        }

        if (booking.status !== 'requested') {
            return res.status(400).json({
                error: 'Booking already processed',
                currentStatus: booking.status
            });
        }

        // Reject booking
        const rejected = rejectBooking(bookingId, req.userId);
        if (!rejected) {
            return res.status(500).json({ error: 'Failed to reject booking' });
        }

        // Send email notification to warehouse
        try {
            const fullBooking = getBookingById(bookingId);
            await sendBookingRejectedEmail(fullBooking);
        } catch (emailError) {
            console.error('Email notification error:', emailError);
            // Don't fail the request if email fails
        }

        res.json({
            success: true,
            message: 'Booking request rejected'
        });
    } catch (error) {
        console.error('Reject booking error:', error);
        res.status(500).json({ error: 'Failed to reject booking' });
    }
});

// Get single booking details
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const booking = getBookingById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Check access - must be either the warehouse or dealer involved
        if (booking.warehouse_id !== req.userId && booking.dealer_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ booking });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

export default router;
