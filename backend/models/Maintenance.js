import db from '../config/database.js';

/**
 * Create a new maintenance record
 */
export const createMaintenance = (truckId, dealerId, maintenanceData) => {
    const { maintenance_type, scheduled_date, notes, cost } = maintenanceData;

    // Verify truck belongs to dealer
    const truck = db.prepare('SELECT id FROM trucks WHERE id = ? AND dealer_id = ?').get(truckId, dealerId);
    if (!truck) {
        throw new Error('Truck not found or unauthorized');
    }

    const stmt = db.prepare(`
        INSERT INTO maintenance_schedule (truck_id, maintenance_type, scheduled_date, notes, cost, status)
        VALUES (?, ?, ?, ?, ?, 'scheduled')
    `);

    const result = stmt.run(truckId, maintenance_type, scheduled_date, notes || null, cost || null);
    return result.lastInsertRowid;
};

/**
 * Get all maintenance records for a specific truck
 */
export const getMaintenanceByTruck = (truckId) => {
    const stmt = db.prepare(`
        SELECT m.*, t.truck_name, t.truck_type
        FROM maintenance_schedule m
        JOIN trucks t ON m.truck_id = t.id
        WHERE m.truck_id = ?
        ORDER BY m.scheduled_date DESC
    `);
    return stmt.all(truckId);
};

/**
 * Get all maintenance records for a dealer's trucks
 */
export const getMaintenanceByDealer = (dealerId, status = null) => {
    let query = `
        SELECT m.*, t.truck_name, t.truck_type
        FROM maintenance_schedule m
        JOIN trucks t ON m.truck_id = t.id
        WHERE t.dealer_id = ?
    `;

    const params = [dealerId];

    if (status) {
        query += ' AND m.status = ?';
        params.push(status);
    }

    query += ' ORDER BY m.scheduled_date DESC';

    const stmt = db.prepare(query);
    return stmt.all(...params);
};

/**
 * Get upcoming maintenance (scheduled in the next 30 days)
 */
export const getUpcomingMaintenance = (dealerId) => {
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const future = futureDate.toISOString().split('T')[0];

    const stmt = db.prepare(`
        SELECT m.*, t.truck_name, t.truck_type
        FROM maintenance_schedule m
        JOIN trucks t ON m.truck_id = t.id
        WHERE t.dealer_id = ?
        AND m.status = 'scheduled'
        AND m.scheduled_date BETWEEN ? AND ?
        ORDER BY m.scheduled_date ASC
    `);

    return stmt.all(dealerId, today, future);
};

/**
 * Get a single maintenance record
 */
export const getMaintenanceById = (id) => {
    const stmt = db.prepare(`
        SELECT m.*, t.truck_name, t.truck_type, t.dealer_id
        FROM maintenance_schedule m
        JOIN trucks t ON m.truck_id = t.id
        WHERE m.id = ?
    `);
    return stmt.get(id);
};

/**
 * Update maintenance record
 */
export const updateMaintenance = (id, dealerId, maintenanceData) => {
    const { maintenance_type, scheduled_date, notes, cost, status } = maintenanceData;

    // Verify ownership
    const maintenance = getMaintenanceById(id);
    if (!maintenance || maintenance.dealer_id !== dealerId) {
        throw new Error('Maintenance record not found or unauthorized');
    }

    const stmt = db.prepare(`
        UPDATE maintenance_schedule
        SET maintenance_type = ?, scheduled_date = ?, notes = ?, cost = ?, status = ?
        WHERE id = ?
    `);

    const result = stmt.run(
        maintenance_type,
        scheduled_date,
        notes || null,
        cost || null,
        status || 'scheduled',
        id
    );

    return result.changes > 0;
};

/**
 * Mark maintenance as completed
 */
export const completeMaintenance = (id, dealerId, completionData) => {
    const { completion_date, notes, cost } = completionData;

    // Verify ownership
    const maintenance = getMaintenanceById(id);
    if (!maintenance || maintenance.dealer_id !== dealerId) {
        throw new Error('Maintenance record not found or unauthorized');
    }

    const stmt = db.prepare(`
        UPDATE maintenance_schedule
        SET status = 'completed', completion_date = ?, notes = ?, cost = ?
        WHERE id = ?
    `);

    const result = stmt.run(
        completion_date || new Date().toISOString().split('T')[0],
        notes || maintenance.notes,
        cost !== undefined ? cost : maintenance.cost,
        id
    );

    return result.changes > 0;
};

/**
 * Delete maintenance record
 */
export const deleteMaintenance = (id, dealerId) => {
    // Verify ownership
    const maintenance = getMaintenanceById(id);
    if (!maintenance || maintenance.dealer_id !== dealerId) {
        throw new Error('Maintenance record not found or unauthorized');
    }

    const stmt = db.prepare('DELETE FROM maintenance_schedule WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
};

/**
 * Check if truck has scheduled maintenance on a specific date
 */
export const hasScheduledMaintenance = (truckId, date) => {
    const stmt = db.prepare(`
        SELECT COUNT(*) as count
        FROM maintenance_schedule
        WHERE truck_id = ?
        AND scheduled_date = ?
        AND status IN ('scheduled', 'in_progress')
    `);

    const result = stmt.get(truckId, date);
    return result.count > 0;
};
