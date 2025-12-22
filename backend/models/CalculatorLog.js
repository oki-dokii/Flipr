import db from '../database.js';

/**
 * Create a calculator log entry
 */
export const createCalculatorLog = (logData) => {
    const { user_id, boxes_data, destination_city, destination_state, total_volume_m3, total_weight_kg, recommended_truck_id } = logData;

    const stmt = db.prepare(`
        INSERT INTO calculator_logs (
            user_id, boxes_data, destination_city, destination_state, 
            total_volume_m3, total_weight_kg, recommended_truck_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
        user_id || null,
        JSON.stringify(boxes_data),
        destination_city || null,
        destination_state || null,
        total_volume_m3,
        total_weight_kg || null,
        recommended_truck_id || null
    );

    return result.lastInsertRowid;
};

/**
 * Get calculator logs for a user
 */
export const getCalculatorLogsByUser = (userId, limit = 10) => {
    const stmt = db.prepare(`
        SELECT * FROM calculator_logs 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    `);

    const logs = stmt.all(userId, limit);

    return logs.map(log => ({
        ...log,
        boxes_data: JSON.parse(log.boxes_data)
    }));
};

/**
 * Get all calculator logs (admin)
 */
export const getAllCalculatorLogs = (limit = 50) => {
    const stmt = db.prepare(`
        SELECT cl.*, u.name as user_name, u.email as user_email
        FROM calculator_logs cl
        LEFT JOIN users u ON cl.user_id = u.id
        ORDER BY cl.created_at DESC
        LIMIT ?
    `);

    const logs = stmt.all(limit);

    return logs.map(log => ({
        ...log,
        boxes_data: JSON.parse(log.boxes_data)
    }));
};
