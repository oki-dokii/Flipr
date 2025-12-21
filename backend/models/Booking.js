import db from '../database.js';

/**
 * Create a new booking request
 */
export const createBookingRequest = (bookingData) => {
    const { shipment_id, truck_id, warehouse_id, dealer_id, notes, start_date, end_date } = bookingData;

    // Detect Overload Risk (95% Safety Margin)
    const shipment = db.prepare('SELECT weight_kg, volume_m3 FROM shipments WHERE id = ?').get(shipment_id);
    const truck = db.prepare('SELECT max_weight_kg, max_volume_m3 FROM trucks WHERE id = ?').get(truck_id);

    let status = 'requested';
    let systemNotes = notes || '';

    if (shipment && truck) {
        const weightUtil = shipment.weight_kg / truck.max_weight_kg;
        const volumeUtil = shipment.volume_m3 / truck.max_volume_m3;

        // Safety Margin: 0.95 (95%)
        if (weightUtil > 0.95 || volumeUtil > 0.95) {
            status = 'on_hold';
            const riskType = weightUtil > 0.95 ? (volumeUtil > 0.95 ? 'Weight & Volume' : 'Weight') : 'Volume';
            const riskValue = Math.max(weightUtil, volumeUtil) * 100;

            systemNotes += `\n[SYSTEM] Overload Protection: Booking placed on HOLD. Usage: ${riskValue.toFixed(1)}% (${riskType}). exceed safety margin of 95%.`;

            // Resolution Guidance
            systemNotes += `\n[GUIDANCE] Resolution:`;
            if (weightUtil > 0.95) {
                const excess = shipment.weight_kg - (truck.max_weight_kg * 0.95);
                systemNotes += `\n- Reduce weight by at least ${excess.toFixed(0)} kg.`;
            }
            if (volumeUtil > 0.95) {
                const excess = shipment.volume_m3 - (truck.max_volume_m3 * 0.95);
                systemNotes += `\n- Reduce volume by at least ${excess.toFixed(2)} m3.`;
            }
            systemNotes += `\n- Consider splitting the shipment or requesting a larger truck (e.g., specific type).`;
        }
    }

    const stmt = db.prepare(`
        INSERT INTO booking_requests (
            shipment_id, truck_id, warehouse_id, dealer_id, notes, start_date, end_date, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(shipment_id, truck_id, warehouse_id, dealer_id, systemNotes, start_date, end_date, status);
    return result.lastInsertRowid;
};

/**
 * Get all booking requests for a warehouse
 */
export const getBookingsByWarehouse = (warehouseId) => {
    const stmt = db.prepare(`
        SELECT 
            br.*,
            s.shipment_name, s.weight_kg, s.volume_m3, s.destination_city || ', ' || s.destination_state as destination, s.delivery_deadline, s.status as shipment_status,
            t.truck_name, t.truck_type, t.max_weight_kg, t.max_volume_m3,
            u.name as dealer_name, u.company as dealer_company, u.email as dealer_email
        FROM booking_requests br
        JOIN shipments s ON br.shipment_id = s.id
        JOIN trucks t ON br.truck_id = t.id
        JOIN users u ON br.dealer_id = u.id
        WHERE br.warehouse_id = ?
        ORDER BY br.requested_at DESC
    `);
    return stmt.all(warehouseId);
};

/**
 * Get all booking requests for a dealer (optionally filter by status)
 */
export const getBookingsByDealer = (dealerId, status = null) => {
    let query = `
        SELECT 
            br.*,
            s.shipment_name, s.weight_kg, s.volume_m3, s.destination_city || ', ' || s.destination_state as destination, s.delivery_deadline, s.priority, s.status as shipment_status,
            t.truck_name, t.truck_type, t.max_weight_kg, t.max_volume_m3,
            u.name as warehouse_name, u.company as warehouse_company, u.email as warehouse_email
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

/**
 * Get a single booking request by ID
 */
export const getBookingById = (id) => {
    const stmt = db.prepare(`
        SELECT 
            br.*,
            s.shipment_name, s.weight_kg, s.volume_m3, s.destination_city || ', ' || s.destination_state as destination, s.warehouse_id,
            t.truck_name, t.dealer_id
        FROM booking_requests br
        JOIN shipments s ON br.shipment_id = s.id
        JOIN trucks t ON br.truck_id = t.id
        WHERE br.id = ?
    `);
    return stmt.get(id);
};

/**
 * Approve a booking request
 */
export const approveBooking = (bookingId, dealerId) => {
    const stmt = db.prepare(`
        UPDATE booking_requests 
        SET status = 'approved', responded_at = CURRENT_TIMESTAMP
        WHERE id = ? AND dealer_id = ? AND status = 'requested'
    `);

    const result = stmt.run(bookingId, dealerId);
    return result.changes > 0;
};

/**
 * Reject a booking request
 */
export const rejectBooking = (bookingId, dealerId) => {
    const stmt = db.prepare(`
        UPDATE booking_requests 
        SET status = 'rejected', responded_at = CURRENT_TIMESTAMP
        WHERE id = ? AND dealer_id = ? AND status = 'requested'
    `);

    const result = stmt.run(bookingId, dealerId);
    return result.changes > 0;
};

/**
 * Get count of pending booking requests for a dealer
 */
export const getPendingBookingsCount = (dealerId) => {
    const stmt = db.prepare(`
        SELECT COUNT(*) as count 
        FROM booking_requests 
        WHERE dealer_id = ? AND status = 'requested'
    `);
    const result = stmt.get(dealerId);
    return result.count;
};

/**
 * Get count of booking requests for a warehouse
 */
export const getWarehouseBookingsCount = (warehouseId) => {
    const stmt = db.prepare(`
        SELECT COUNT(*) as count 
        FROM booking_requests 
        WHERE warehouse_id = ?
    `);
    const result = stmt.get(warehouseId);
    return result.count;
};

/**
 * Check if a booking request already exists for a shipment-truck combination
 */
export const checkExistingBooking = (shipmentId, truckId) => {
    const stmt = db.prepare(`
        SELECT id, status 
        FROM booking_requests 
        WHERE shipment_id = ? AND truck_id = ? AND status = 'requested'
    `);
    return stmt.get(shipmentId, truckId);
};

/**
 * Check if the truck has any approved overlapping bookings
 */
export const checkBookingOverlap = (truckId, startDate, endDate) => {
    const stmt = db.prepare(`
        SELECT b.id, b.status, b.start_date, b.end_date, s.status as shipment_status
        FROM booking_requests b
        LEFT JOIN shipments s ON b.shipment_id = s.id
        WHERE b.truck_id = ? 
        AND b.status = 'approved'
        AND (b.archived IS NULL OR b.archived = 0)
        AND (s.status IS NULL OR s.status NOT IN ('delivered', 'cancelled'))
        AND (
            (b.start_date BETWEEN ? AND ?) OR 
            (b.end_date BETWEEN ? AND ?) OR
            (b.start_date <= ? AND b.end_date >= ?)
        )
    `);
    return stmt.get(truckId, startDate, endDate, startDate, endDate, startDate, endDate);
};

/**
 * Archive a booking request
 */
export const archiveBooking = (bookingId, userId) => {
    const stmt = db.prepare(`
        UPDATE booking_requests 
        SET archived = 1 
        WHERE id = ? AND (warehouse_id = ? OR dealer_id = ?)
    `);
    const result = stmt.run(bookingId, userId, userId);
    return result.changes > 0;
};

/**
 * Unarchive a booking request
 */
export const unarchiveBooking = (bookingId, userId) => {
    const stmt = db.prepare(`
        UPDATE booking_requests 
        SET archived = 0 
        WHERE id = ? AND (warehouse_id = ? OR dealer_id = ?)
    `);
    const result = stmt.run(bookingId, userId, userId);
    return result.changes > 0;
};

/**
 * Get archived/completed bookings for a warehouse
 * Shows approved and rejected bookings
 */
export const getArchivedBookingsByWarehouse = (warehouseId) => {
    const stmt = db.prepare(`
        SELECT 
            br.*,
            s.shipment_name, s.weight_kg, s.volume_m3, s.destination_city || ', ' || s.destination_state as destination, s.delivery_deadline, s.status as shipment_status,
            t.truck_name, t.truck_type, t.max_weight_kg, t.max_volume_m3,
            u.name as dealer_name, u.company as dealer_company, u.email as dealer_email
        FROM booking_requests br
        JOIN shipments s ON br.shipment_id = s.id
        JOIN trucks t ON br.truck_id = t.id
        JOIN users u ON br.dealer_id = u.id
        WHERE br.warehouse_id = ? AND br.status IN ('approved', 'rejected')
        ORDER BY br.responded_at DESC, br.requested_at DESC
    `);
    return stmt.all(warehouseId);
};

/**
 * Get archived/completed bookings for a dealer
 * Shows approved and rejected bookings
 */
export const getArchivedBookingsByDealer = (dealerId) => {
    const stmt = db.prepare(`
        SELECT 
            br.*,
            s.shipment_name, s.weight_kg, s.volume_m3, s.destination_city || ', ' || s.destination_state as destination, s.delivery_deadline, s.priority, s.status as shipment_status,
            t.truck_name, t.truck_type, t.max_weight_kg, t.max_volume_m3,
            u.name as warehouse_name, u.company as warehouse_company, u.email as warehouse_email
        FROM booking_requests br
        JOIN shipments s ON br.shipment_id = s.id
        JOIN trucks t ON br.truck_id = t.id
        JOIN users u ON br.warehouse_id = u.id
        WHERE br.dealer_id = ? AND br.status IN ('approved', 'rejected')
        ORDER BY br.responded_at DESC, br.requested_at DESC
    `);
    return stmt.all(dealerId);
};

/**
 * Bulk approve booking requests
 */
export const bulkApproveBookings = async (bookingIds, dealerId) => {
    const results = [];

    for (const bookingId of bookingIds) {
        try {
            const success = approveBooking(bookingId, dealerId);
            results.push({ bookingId, success, error: null });
        } catch (error) {
            results.push({ bookingId, success: false, error: error.message });
        }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return { successCount, failCount, results };
};

/**
 * Bulk reject booking requests
 */
export const bulkRejectBookings = async (bookingIds, dealerId) => {
    const results = [];

    for (const bookingId of bookingIds) {
        try {
            const success = rejectBooking(bookingId, dealerId);
            results.push({ bookingId, success, error: null });
        } catch (error) {
            results.push({ bookingId, success: false, error: error.message });
        }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return { successCount, failCount, results };
};



/**
 * Get booking by shipment ID
 */
export const getBookingByShipmentId = (shipmentId) => {
    const stmt = db.prepare(`
        SELECT * FROM booking_requests 
        WHERE shipment_id = ? AND status = 'approved'
        ORDER BY requested_at DESC
        LIMIT 1
    `);
    return stmt.get(shipmentId);
};

/**
 * Override an on_hold booking (Dealer only)
 */
export const overrideBooking = (bookingId, dealerId, justification) => {
    // First, append the override note
    const booking = db.prepare('SELECT notes FROM booking_requests WHERE id = ?').get(bookingId);
    if (!booking) return false;

    const timestamp = new Date().toISOString();
    const newNotes = (booking.notes || '') + `\n\n[OVERRIDE] Approved by Dealer on ${timestamp}.\nJustification: ${justification}`;

    // Update status and notes
    const stmt = db.prepare(`
        UPDATE booking_requests 
        SET status = 'approved', notes = ?, responded_at = CURRENT_TIMESTAMP
        WHERE id = ? AND dealer_id = ? AND status = 'on_hold'
    `);

    const result = stmt.run(newNotes, bookingId, dealerId);
    return result.changes > 0;
};

/**
 * Get safety metrics related to overload protection
 */
export const getSafetyMetrics = () => {
    // 1. Overload risks detected (all bookings that were ever ON HOLD or REJECTED with overload warning)
    const totalRisks = db.prepare(`
        SELECT COUNT(*) as count 
        FROM booking_requests 
        WHERE notes LIKE '%[SYSTEM] Overload Protection%'
    `).get().count;

    // 2. Unsafe bookings prevented (current status is ON HOLD or REJECTED and has overload warning)
    const prevented = db.prepare(`
        SELECT COUNT(*) as count 
        FROM booking_requests 
        WHERE status IN ('on_hold', 'rejected') 
        AND notes LIKE '%[SYSTEM] Overload Protection%'
    `).get().count;

    // 3. Overrides (Approved with override note)
    const overrides = db.prepare(`
        SELECT COUNT(*) as count 
        FROM booking_requests 
        WHERE status = 'approved' 
        AND notes LIKE '%[OVERRIDE]%'
    `).get().count;

    return {
        totalRisks,
        prevented,
        overrides
    };
};
