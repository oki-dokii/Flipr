import db from '../database.js';

export const createShipment = (warehouseId, shipmentData) => {
    const {
        shipment_name,
        weight_kg,
        volume_m3,
        destination,
        delivery_deadline,
        priority
    } = shipmentData;

    const stmt = db.prepare(`
    INSERT INTO shipments (
      warehouse_id, shipment_name, weight_kg, volume_m3,
      destination, delivery_deadline, priority
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const result = stmt.run(
        warehouseId,
        shipment_name,
        weight_kg,
        volume_m3,
        destination,
        delivery_deadline,
        priority || 'medium'
    );

    return result.lastInsertRowid;
};

export const getShipmentsByWarehouse = (warehouseId) => {
    const stmt = db.prepare('SELECT * FROM shipments WHERE warehouse_id = ? ORDER BY created_at DESC');
    return stmt.all(warehouseId);
};

export const getShipmentById = (id) => {
    const stmt = db.prepare('SELECT * FROM shipments WHERE id = ?');
    return stmt.get(id);
};

export const updateShipment = (id, warehouseId, shipmentData) => {
    const {
        shipment_name,
        weight_kg,
        volume_m3,
        destination,
        delivery_deadline,
        priority,
        status
    } = shipmentData;

    const stmt = db.prepare(`
    UPDATE shipments SET
      shipment_name = ?,
      weight_kg = ?,
      volume_m3 = ?,
      destination = ?,
      delivery_deadline = ?,
      priority = ?,
      status = ?
    WHERE id = ? AND warehouse_id = ?
  `);

    const result = stmt.run(
        shipment_name,
        weight_kg,
        volume_m3,
        destination,
        delivery_deadline,
        priority || 'medium',
        status || 'pending',
        id,
        warehouseId
    );

    return result.changes > 0;
};

export const deleteShipment = (id, warehouseId) => {
    const stmt = db.prepare('DELETE FROM shipments WHERE id = ? AND warehouse_id = ?');
    const result = stmt.run(id, warehouseId);
    return result.changes > 0;
};

export const getPendingShipments = () => {
    const stmt = db.prepare(`
    SELECT s.*, u.name as warehouse_name, u.company as warehouse_company 
    FROM shipments s 
    JOIN users u ON s.warehouse_id = u.id 
    WHERE s.status = 'pending'
    ORDER BY s.delivery_deadline ASC
  `);
    return stmt.all();
};

export const getShipmentCount = (warehouseId) => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM shipments WHERE warehouse_id = ?');
    const result = stmt.get(warehouseId);
    return result.count;
};
