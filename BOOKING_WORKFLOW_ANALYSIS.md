# 📋 Booking Workflow Analysis & Implementation Guide

## Current Implementation Status

### ✅ What's Already Implemented

#### 1. **Database Schema** (Ready)
The database already supports the complete booking workflow:

```sql
CREATE TABLE shipments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_id INTEGER NOT NULL,
  shipment_name TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  volume_m3 REAL NOT NULL,
  destination TEXT NOT NULL,
  delivery_deadline DATETIME NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'assigned', 'in_transit', 'delivered')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES users(id)
);
```

**Status Field Values:**
- ✅ `pending` - Initial state when warehouse creates shipment
- ✅ `assigned` - After dealer assigns a truck
- ✅ `in_transit` - Truck is on the way
- ✅ `delivered` - Shipment completed

#### 2. **Backend Models** (Partial)

**File**: [`backend/models/Shipment.js`](file:///Users/sohambanerjee/Downloads/smart-load-optimize-main/backend/models/Shipment.js)

**Available Functions:**
- ✅ `createShipment()` - Create new shipment (status = 'pending')
- ✅ `getShipmentsByWarehouse()` - Get all shipments for a warehouse
- ✅ `getShipmentById()` - Get single shipment
- ✅ `updateShipment()` - Update shipment (includes status)
- ✅ `getPendingShipments()` - Get all pending shipments
- ✅ `deleteShipment()` - Delete shipment

#### 3. **Optimization System** (Complete)
- ✅ Algorithm recommends best trucks
- ✅ Scorecard displays recommendations
- ✅ Warehouse can see which trucks are best

---

### ❌ What's Missing

#### 1. **Booking Request Table**
No table to track booking requests between warehouses and dealers.

**Needed:**
```sql
CREATE TABLE booking_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shipment_id INTEGER NOT NULL,
  truck_id INTEGER NOT NULL,
  warehouse_id INTEGER NOT NULL,
  dealer_id INTEGER NOT NULL,
  status TEXT DEFAULT 'requested' CHECK(status IN ('requested', 'approved', 'rejected')),
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id),
  FOREIGN KEY (truck_id) REFERENCES trucks(id),
  FOREIGN KEY (warehouse_id) REFERENCES users(id),
  FOREIGN KEY (dealer_id) REFERENCES users(id)
);
```

#### 2. **Booking API Endpoints**
No routes for booking workflow.

**Needed:**
- `POST /api/bookings/request` - Warehouse requests a truck
- `GET /api/bookings/warehouse/:warehouseId` - Get warehouse's booking requests
- `GET /api/bookings/dealer/:dealerId` - Get dealer's pending requests
- `PUT /api/bookings/:id/approve` - Dealer approves request
- `PUT /api/bookings/:id/reject` - Dealer rejects request

#### 3. **Shipment Status Update Endpoints**
No routes to update shipment status through the workflow.

**Needed:**
- `PUT /api/shipments/:id/assign` - Mark as assigned
- `PUT /api/shipments/:id/in-transit` - Mark as in transit
- `PUT /api/shipments/:id/deliver` - Mark as delivered

#### 4. **Frontend Pages**
No UI for booking workflow.

**Needed:**
- Booking request button on recommendations page
- Dealer's booking requests page
- Shipment status tracking page

---

## Complete Booking Workflow Design

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOKING WORKFLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. WAREHOUSE CREATES SHIPMENT
   ┌──────────────────┐
   │ Warehouse        │
   │ Creates Shipment │──→ Status: pending
   └──────────────────┘

2. WAREHOUSE GETS RECOMMENDATIONS
   ┌──────────────────┐
   │ Clicks "Optimize"│──→ Algorithm runs
   │ Views Scorecard  │    Shows top 3 trucks
   └──────────────────┘

3. WAREHOUSE INITIATES BOOKING
   ┌──────────────────┐
   │ Clicks "Book     │──→ Creates booking_request
   │ This Truck"      │    Status: requested
   └──────────────────┘    Shipment: pending

4. DEALER RECEIVES REQUEST
   ┌──────────────────┐
   │ Dealer Dashboard │──→ Shows pending requests
   │ Views Request    │    Shipment details
   └──────────────────┘    Truck details

5. DEALER APPROVES/REJECTS
   
   APPROVE:                      REJECT:
   ┌──────────────────┐         ┌──────────────────┐
   │ Clicks "Approve" │         │ Clicks "Reject"  │
   └────────┬─────────┘         └────────┬─────────┘
            │                            │
            ▼                            ▼
   booking_request:             booking_request:
   status = approved            status = rejected
   
   shipment:                    shipment:
   status = assigned            status = pending
   
   truck:                       truck:
   availability = booked        availability = available

6. SHIPMENT LIFECYCLE
   ┌──────────────────┐
   │ Dealer Updates   │
   │ Status           │
   └────────┬─────────┘
            │
            ▼
   pending → assigned → in_transit → delivered
```

---

## Implementation Plan

### Phase 1: Database Setup

#### Create Booking Requests Table

**File**: `backend/database.js`

Add after the shipments table:

```javascript
CREATE TABLE IF NOT EXISTS booking_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shipment_id INTEGER NOT NULL,
  truck_id INTEGER NOT NULL,
  warehouse_id INTEGER NOT NULL,
  dealer_id INTEGER NOT NULL,
  status TEXT DEFAULT 'requested' CHECK(status IN ('requested', 'approved', 'rejected')),
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  responded_at DATETIME,
  notes TEXT,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (truck_id) REFERENCES trucks(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (dealer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_booking_warehouse ON booking_requests(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_booking_dealer ON booking_requests(dealer_id);
CREATE INDEX IF NOT EXISTS idx_booking_status ON booking_requests(status);
```

---

### Phase 2: Backend Models

#### Create Booking Model

**File**: `backend/models/Booking.js` (NEW)

```javascript
import db from '../database.js';

// Create booking request
export const createBookingRequest = (bookingData) => {
    const { shipment_id, truck_id, warehouse_id, dealer_id, notes } = bookingData;
    
    const stmt = db.prepare(`
        INSERT INTO booking_requests (
            shipment_id, truck_id, warehouse_id, dealer_id, notes
        ) VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(shipment_id, truck_id, warehouse_id, dealer_id, notes || null);
    return result.lastInsertRowid;
};

// Get booking requests for warehouse
export const getBookingsByWarehouse = (warehouseId) => {
    const stmt = db.prepare(`
        SELECT 
            br.*,
            s.shipment_name, s.weight_kg, s.volume_m3, s.destination,
            t.truck_name, t.truck_type,
            u.name as dealer_name, u.company as dealer_company
        FROM booking_requests br
        JOIN shipments s ON br.shipment_id = s.id
        JOIN trucks t ON br.truck_id = t.id
        JOIN users u ON br.dealer_id = u.id
        WHERE br.warehouse_id = ?
        ORDER BY br.requested_at DESC
    `);
    return stmt.all(warehouseId);
};

// Get booking requests for dealer
export const getBookingsByDealer = (dealerId, status = null) => {
    let query = `
        SELECT 
            br.*,
            s.shipment_name, s.weight_kg, s.volume_m3, s.destination, s.delivery_deadline,
            t.truck_name, t.truck_type,
            u.name as warehouse_name, u.company as warehouse_company
        FROM booking_requests br
        JOIN shipments s ON br.shipment_id = s.id
        JOIN trucks t ON br.truck_id = t.id
        JOIN users u ON br.warehouse_id = u.id
        WHERE br.dealer_id = ?
    `;
    
    const params = [dealerId];
    
    if (status) {
        query += ' AND br.status = ?';
        params.push(status);
    }
    
    query += ' ORDER BY br.requested_at DESC';
    
    const stmt = db.prepare(query);
    return stmt.all(...params);
};

// Approve booking request
export const approveBooking = (bookingId, dealerId) => {
    const stmt = db.prepare(`
        UPDATE booking_requests 
        SET status = 'approved', responded_at = CURRENT_TIMESTAMP
        WHERE id = ? AND dealer_id = ? AND status = 'requested'
    `);
    
    const result = stmt.run(bookingId, dealerId);
    return result.changes > 0;
};

// Reject booking request
export const rejectBooking = (bookingId, dealerId) => {
    const stmt = db.prepare(`
        UPDATE booking_requests 
        SET status = 'rejected', responded_at = CURRENT_TIMESTAMP
        WHERE id = ? AND dealer_id = ? AND status = 'requested'
    `);
    
    const result = stmt.run(bookingId, dealerId);
    return result.changes > 0;
};

// Get booking by ID
export const getBookingById = (id) => {
    const stmt = db.prepare('SELECT * FROM booking_requests WHERE id = ?');
    return stmt.get(id);
};
```

---

### Phase 3: Backend Routes

#### Create Booking Routes

**File**: `backend/routes/bookings.js` (NEW)

```javascript
import express from 'express';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import {
    createBookingRequest,
    getBookingsByWarehouse,
    getBookingsByDealer,
    approveBooking,
    rejectBooking,
    getBookingById
} from '../models/Booking.js';
import { getShipmentById, updateShipment } from '../models/Shipment.js';
import { getTruckById, updateTruck } from '../models/Truck.js';

const router = express.Router();

// Warehouse creates booking request
router.post('/request', authenticateToken, requireRole('warehouse'), async (req, res) => {
    try {
        const { shipment_id, truck_id, notes } = req.body;
        
        // Verify shipment ownership
        const shipment = getShipmentById(shipment_id);
        if (!shipment || shipment.warehouse_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // Get truck and dealer info
        const truck = getTruckById(truck_id);
        if (!truck) {
            return res.status(404).json({ error: 'Truck not found' });
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
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Get dealer's booking requests
router.get('/dealer', authenticateToken, requireRole('dealer'), (req, res) => {
    try {
        const status = req.query.status; // optional filter
        const bookings = getBookingsByDealer(req.userId, status);
        res.json({ bookings });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Dealer approves booking
router.put('/:id/approve', authenticateToken, requireRole('dealer'), async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        // Get booking details
        const booking = getBookingById(bookingId);
        if (!booking || booking.dealer_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        if (booking.status !== 'requested') {
            return res.status(400).json({ error: 'Booking already processed' });
        }
        
        // Approve booking
        const approved = approveBooking(bookingId, req.userId);
        if (!approved) {
            return res.status(500).json({ error: 'Failed to approve booking' });
        }
        
        // Update shipment status to 'assigned'
        const shipment = getShipmentById(booking.shipment_id);
        updateShipment(booking.shipment_id, shipment.warehouse_id, {
            ...shipment,
            status: 'assigned'
        });
        
        // Update truck availability to 'booked'
        const truck = getTruckById(booking.truck_id);
        updateTruck(booking.truck_id, req.userId, {
            ...truck,
            availability_status: 'booked'
        });
        
        res.json({ 
            success: true,
            message: 'Booking approved and truck assigned'
        });
    } catch (error) {
        console.error('Approve booking error:', error);
        res.status(500).json({ error: 'Failed to approve booking' });
    }
});

// Dealer rejects booking
router.put('/:id/reject', authenticateToken, requireRole('dealer'), async (req, res) => {
    try {
        const bookingId = req.params.id;
        
        // Get booking details
        const booking = getBookingById(bookingId);
        if (!booking || booking.dealer_id !== req.userId) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        if (booking.status !== 'requested') {
            return res.status(400).json({ error: 'Booking already processed' });
        }
        
        // Reject booking
        const rejected = rejectBooking(bookingId, req.userId);
        if (!rejected) {
            return res.status(500).json({ error: 'Failed to reject booking' });
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

export default router;
```

#### Update Shipment Routes

**File**: `backend/routes/shipments.js`

Add these endpoints:

```javascript
// Update shipment status to in_transit
router.put('/:id/in-transit', authenticateToken, requireRole('dealer'), (req, res) => {
    // Implementation
});

// Update shipment status to delivered
router.put('/:id/deliver', authenticateToken, requireRole('dealer'), (req, res) => {
    // Implementation
});
```

---

### Phase 4: Frontend Implementation

#### 1. Update TruckRecommendations Page

**File**: `src/pages/TruckRecommendations.tsx`

Replace the "Assign This Truck" button with:

```tsx
<Button 
    className="w-full bg-gradient-to-r from-teal to-cyan"
    onClick={() => handleBookingRequest(rec.truck.id)}
>
    Request Booking
</Button>
```

Add handler:

```tsx
const handleBookingRequest = async (truckId: number) => {
    try {
        const response = await fetch('http://localhost:3001/api/bookings/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                shipment_id: shipmentId,
                truck_id: truckId,
                notes: ''
            })
        });
        
        if (response.ok) {
            toast.success('Booking request sent to dealer!');
        }
    } catch (error) {
        toast.error('Failed to send booking request');
    }
};
```

#### 2. Create Booking Requests Page (Dealer)

**File**: `src/pages/BookingRequests.tsx` (NEW)

Shows pending booking requests for dealers with approve/reject buttons.

#### 3. Create My Bookings Page (Warehouse)

**File**: `src/pages/MyBookings.tsx` (NEW)

Shows booking request status for warehouses.

---

## Summary

### Current State
- ✅ Database schema ready
- ✅ Optimization algorithm working
- ✅ Basic shipment CRUD operations
- ❌ No booking request system
- ❌ No dealer approval workflow
- ❌ No status tracking UI

### What Needs to Be Built
1. **Database**: Add `booking_requests` table
2. **Backend**: Create booking model and routes
3. **Frontend**: Add booking UI components
4. **Integration**: Connect optimization → booking → tracking

### Workflow Summary
```
Warehouse → Create Shipment (pending)
         ↓
Warehouse → Get Recommendations
         ↓
Warehouse → Request Booking
         ↓
Dealer → Approve/Reject
         ↓
If Approved → Shipment (assigned) + Truck (booked)
         ↓
Dealer → Update to in_transit
         ↓
Dealer → Update to delivered
```

The foundation is there, but the booking workflow needs to be fully implemented!
