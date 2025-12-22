import db from '../database.js';
import { getCityCoordinates, calculateDistance } from '../services/addressService.js';
import { findUserById } from './User.js';

export const createShipment = (warehouseId, shipmentData) => {
    const {
        shipment_name,
        weight_kg,
        volume_m3,
        destination_city,
        destination_state,
        destination_postal_code,
        destination_latitude,
        destination_longitude,
        delivery_deadline,
        priority
    } = shipmentData;

    // Auto-fetch coordinates if not provided
    let destLat = destination_latitude;
    let destLon = destination_longitude;
    let estimatedDistance = null;

    if (!destLat || !destLon) {
        const cityCoords = getCityCoordinates(destination_city);
        if (cityCoords) {
            destLat = cityCoords.lat;
            destLon = cityCoords.lon;
        }
    }

    // Calculate estimated distance if possible
    let originCity = null;
    let originState = null;

    if (warehouseId) {
        const warehouse = findUserById(warehouseId);
        if (warehouse) {
            originCity = warehouse.city;
            originState = warehouse.state;

            if (destLat && destLon && warehouse.latitude && warehouse.longitude) {
                estimatedDistance = calculateDistance(
                    warehouse.latitude,
                    warehouse.longitude,
                    destLat,
                    destLon
                );
            }
        }
    }

    const stmt = db.prepare(`
    INSERT INTO shipments (
      warehouse_id, shipment_name, weight_kg, volume_m3,
      origin_city, origin_state,
      destination_city, destination_state, destination_postal_code,
      destination_latitude, destination_longitude, estimated_distance_km,
      delivery_deadline, priority
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const result = stmt.run(
        warehouseId,
        shipment_name,
        weight_kg,
        volume_m3,
        originCity,
        originState,
        destination_city,
        destination_state,
        destination_postal_code || null,
        destLat || null,
        destLon || null,
        estimatedDistance,
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
        destination_city,
        destination_state,
        destination_postal_code,
        destination_latitude,
        destination_longitude,
        delivery_deadline,
        priority,
        status
    } = shipmentData;

    const stmt = db.prepare(`
    UPDATE shipments SET
      shipment_name = ?,
      weight_kg = ?,
      volume_m3 = ?,
      destination_city = ?,
      destination_state = ?,
      destination_postal_code = ?,
      destination_latitude = ?,
      destination_longitude = ?,
      delivery_deadline = ?,
      priority = ?,
      status = ?
    WHERE id = ? AND warehouse_id = ?
  `);

    const result = stmt.run(
        shipment_name,
        weight_kg,
        volume_m3,
        destination_city,
        destination_state,
        destination_postal_code || null,
        destination_latitude || null,  // Allow null
        destination_longitude || null,  // Allow null
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
