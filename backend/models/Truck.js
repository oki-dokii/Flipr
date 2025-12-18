import db from '../database.js';

export const createTruck = (dealerId, truckData) => {
    const {
        truck_name,
        truck_type,
        max_weight_kg,
        max_volume_m3,
        length_m,
        width_m,
        height_m,
        service_regions,
        cost_per_km,
        base_cost
    } = truckData;

    const stmt = db.prepare(`
    INSERT INTO trucks (
      dealer_id, truck_name, truck_type, max_weight_kg, max_volume_m3,
      length_m, width_m, height_m, service_regions, cost_per_km, base_cost
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const result = stmt.run(
        dealerId,
        truck_name,
        truck_type,
        max_weight_kg,
        max_volume_m3,
        length_m,
        width_m,
        height_m,
        JSON.stringify(service_regions),
        cost_per_km,
        base_cost
    );

    return result.lastInsertRowid;
};

export const getTrucksByDealer = (dealerId) => {
    const stmt = db.prepare('SELECT * FROM trucks WHERE dealer_id = ? ORDER BY created_at DESC');
    const trucks = stmt.all(dealerId);

    return trucks.map(truck => ({
        ...truck,
        service_regions: JSON.parse(truck.service_regions)
    }));
};

export const getTruckById = (id) => {
    const stmt = db.prepare('SELECT * FROM trucks WHERE id = ?');
    const truck = stmt.get(id);

    if (truck) {
        truck.service_regions = JSON.parse(truck.service_regions);
    }

    return truck;
};

export const updateTruck = (id, dealerId, truckData) => {
    const {
        truck_name,
        truck_type,
        max_weight_kg,
        max_volume_m3,
        length_m,
        width_m,
        height_m,
        service_regions,
        cost_per_km,
        base_cost,
        availability_status
    } = truckData;

    const stmt = db.prepare(`
    UPDATE trucks SET
      truck_name = ?,
      truck_type = ?,
      max_weight_kg = ?,
      max_volume_m3 = ?,
      length_m = ?,
      width_m = ?,
      height_m = ?,
      service_regions = ?,
      cost_per_km = ?,
      base_cost = ?,
      availability_status = ?
    WHERE id = ? AND dealer_id = ?
  `);

    const result = stmt.run(
        truck_name,
        truck_type,
        max_weight_kg,
        max_volume_m3,
        length_m,
        width_m,
        height_m,
        JSON.stringify(service_regions),
        cost_per_km,
        base_cost,
        availability_status || 'available',
        id,
        dealerId
    );

    return result.changes > 0;
};

export const deleteTruck = (id, dealerId) => {
    const stmt = db.prepare('DELETE FROM trucks WHERE id = ? AND dealer_id = ?');
    const result = stmt.run(id, dealerId);
    return result.changes > 0;
};

export const getAvailableTrucks = (filters = {}) => {
    let query = 'SELECT t.*, u.name as dealer_name, u.company as dealer_company FROM trucks t JOIN users u ON t.dealer_id = u.id WHERE t.availability_status = ?';
    const params = ['available'];

    if (filters.min_weight) {
        query += ' AND t.max_weight_kg >= ?';
        params.push(filters.min_weight);
    }

    if (filters.min_volume) {
        query += ' AND t.max_volume_m3 >= ?';
        params.push(filters.min_volume);
    }

    if (filters.truck_type) {
        query += ' AND t.truck_type = ?';
        params.push(filters.truck_type);
    }

    query += ' ORDER BY t.created_at DESC';

    const stmt = db.prepare(query);
    const trucks = stmt.all(...params);

    return trucks.map(truck => ({
        ...truck,
        service_regions: JSON.parse(truck.service_regions)
    }));
};

export const getTruckCount = (dealerId) => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM trucks WHERE dealer_id = ?');
    const result = stmt.get(dealerId);
    return result.count;
};
