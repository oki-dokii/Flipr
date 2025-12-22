/**
 * Trip Service - Auto-close trips and generate summaries
 */

import db from '../database.js';

/**
 * Calculate fuel consumption based on distance and truck type
 * @param {number} distance - Distance in km
 * @param {string} truckType - Type of truck
 * @returns {number} Fuel consumed in liters
 */
export const calculateFuelConsumption = (distance, truckType) => {
    // Fuel efficiency in km/liter (varies by truck type)
    const fuelEfficiency = {
        'Mini Truck': 12,      // 12 km/L
        'Light Truck': 10,     // 10 km/L
        'Medium Truck': 8,     // 8 km/L
        'Heavy Truck': 6,      // 6 km/L
        'Trailer': 5,          // 5 km/L
        'Container': 5         // 5 km/L
    };

    const efficiency = fuelEfficiency[truckType] || 8; // Default 8 km/L
    return distance / efficiency;
};

/**
 * Calculate fuel saved through optimization
 * @param {number} utilization - Truck utilization percentage (0-1)
 * @param {number} distance - Distance in km
 * @param {string} truckType - Type of truck
 * @returns {number} Fuel saved in liters
 */
export const calculateFuelSaved = (utilization, distance, truckType) => {
    // If utilization is high (>70%), we saved fuel by not sending multiple trucks
    if (utilization < 0.7) {
        return 0; // No savings if under-utilized
    }

    // Calculate how many trips would be needed at 50% utilization
    const tripsNeeded = Math.ceil(utilization / 0.5);
    const fuelPerTrip = calculateFuelConsumption(distance, truckType);

    // Fuel for multiple trips vs single optimized trip
    const fuelMultipleTrips = tripsNeeded * fuelPerTrip;
    const fuelSingleTrip = fuelPerTrip;

    return Math.max(0, fuelMultipleTrips - fuelSingleTrip);
};

/**
 * Generate trip summary for a delivered shipment
 * @param {number} shipmentId - Shipment ID
 * @returns {Object} Trip summary
 */
export const generateTripSummary = (shipmentId) => {
    try {
        // Get shipment details
        const shipment = db.prepare('SELECT * FROM shipments WHERE id = ?').get(shipmentId);
        if (!shipment || shipment.status !== 'delivered') {
            return null;
        }

        // Get booking details
        const booking = db.prepare(`
            SELECT b.*, t.truck_type, t.max_weight_kg, t.max_volume_m3, t.base_cost, t.cost_per_km
            FROM booking_requests b
            JOIN trucks t ON b.truck_id = t.id
            WHERE b.shipment_id = ? AND b.status = 'approved'
            LIMIT 1
        `).get(shipmentId);

        if (!booking) {
            return null;
        }

        // Calculate utilization
        const weightUtil = shipment.weight_kg / booking.max_weight_kg;
        const volumeUtil = shipment.volume_m3 / booking.max_volume_m3;
        const avgUtilization = (weightUtil + volumeUtil) / 2;

        // Get distance (from shipment or estimate)
        const distance = shipment.estimated_distance_km || 500;

        // Calculate fuel
        const fuelConsumed = calculateFuelConsumption(distance, booking.truck_type);
        const fuelSaved = calculateFuelSaved(avgUtilization, distance, booking.truck_type);

        // Calculate cost
        const totalCost = booking.base_cost + (distance * booking.cost_per_km);

        // CO₂ saved (already calculated during delivery)
        const co2Saved = avgUtilization * distance * 0.5;

        const summary = {
            distance_km: distance,
            fuel_consumed_liters: Math.round(fuelConsumed * 10) / 10,
            fuel_saved_liters: Math.round(fuelSaved * 10) / 10,
            co2_saved_kg: Math.round(co2Saved * 10) / 10,
            total_cost: Math.round(totalCost),
            utilization_percent: Math.round(avgUtilization * 100),
            truck_type: booking.truck_type,
            completed_at: new Date().toISOString()
        };

        // Store summary in shipment
        db.prepare('UPDATE shipments SET trip_summary = ? WHERE id = ?')
            .run(JSON.stringify(summary), shipmentId);

        return summary;
    } catch (error) {
        console.error('Generate trip summary error:', error);
        return null;
    }
};

/**
 * Auto-close delivered trips older than specified days
 * @param {number} daysOld - Number of days after delivery to auto-close
 * @returns {Object} Results of cleanup
 */
export const autoCloseDeliveredTrips = (daysOld = 7) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);
        const cutoffISO = cutoffDate.toISOString();

        // Find delivered shipments older than cutoff
        const oldShipments = db.prepare(`
            SELECT id FROM shipments 
            WHERE status = 'delivered' 
            AND delivered_at < ? 
            AND auto_closed_at IS NULL
        `).all(cutoffISO);

        let closedCount = 0;
        let summariesGenerated = 0;

        for (const shipment of oldShipments) {
            // Generate trip summary if not already done
            const summary = generateTripSummary(shipment.id);
            if (summary) {
                summariesGenerated++;
            }

            // Mark as auto-closed
            db.prepare('UPDATE shipments SET auto_closed_at = ? WHERE id = ?')
                .run(new Date().toISOString(), shipment.id);

            // Archive related booking
            db.prepare(`
                UPDATE booking_requests 
                SET archived = 1 
                WHERE shipment_id = ? AND status = 'approved'
            `).run(shipment.id);

            closedCount++;
        }

        console.log(`[Auto-Close] Closed ${closedCount} trips, generated ${summariesGenerated} summaries`);

        return {
            closedCount,
            summariesGenerated,
            message: `Auto-closed ${closedCount} delivered trips`
        };
    } catch (error) {
        console.error('Auto-close trips error:', error);
        return {
            closedCount: 0,
            summariesGenerated: 0,
            error: error.message
        };
    }
};
