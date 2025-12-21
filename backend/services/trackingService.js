/**
 * Tracking Service - Mock GPS tracking based on shipment status
 * Provides location data for shipments without real GPS hardware
 */

/**
 * Calculate mock location based on shipment status
 * @param {Object} shipment - Shipment with status
 * @param {Object} warehouse - Warehouse location
 * @param {Object} destination - Destination location
 * @returns {Object} Current location and progress
 */
export const calculateMockLocation = (shipment, warehouse, destination) => {
    const status = shipment.status;

    // Default locations
    const warehouseLat = warehouse.latitude || 19.0760; // Mumbai default
    const warehouseLng = warehouse.longitude || 72.8777;
    const destLat = destination.latitude || parseFloat(shipment.destination_latitude) || 28.6139;
    const destLng = destination.longitude || parseFloat(shipment.destination_longitude) || 77.2090;

    let currentLat, currentLng, progress, statusMessage;

    switch (status) {
        case 'pending':
        case 'assigned':
            // At warehouse
            currentLat = warehouseLat;
            currentLng = warehouseLng;
            progress = 0;
            statusMessage = 'Shipment at warehouse, preparing for dispatch';
            break;

        case 'in_transit':
            // Calculate time-based progress for realistic movement
            const now = new Date();
            const startTime = new Date(shipment.created_at);

            // Use delivery deadline if available, otherwise estimate 3 days
            const deadline = shipment.delivery_deadline
                ? new Date(shipment.delivery_deadline)
                : new Date(startTime.getTime() + 1000 * 60 * 60 * 24 * 3); // +3 days

            const totalDuration = deadline - startTime;
            const elapsed = now - startTime;

            // Calculate progress (0-100), capped at 95% until actually delivered
            progress = Math.min(95, Math.max(0, (elapsed / totalDuration) * 100));

            // Interpolate position based on progress
            currentLat = warehouseLat + (destLat - warehouseLat) * (progress / 100);
            currentLng = warehouseLng + (destLng - warehouseLng) * (progress / 100);

            statusMessage = `In transit to destination (${Math.round(progress)}% complete)`;
            break;

        case 'delivered':
            // At destination
            currentLat = destLat;
            currentLng = destLng;
            progress = 100;
            statusMessage = 'Delivered successfully';
            break;

        default:
            currentLat = warehouseLat;
            currentLng = warehouseLng;
            progress = 0;
            statusMessage = 'Status unknown';
    }

    return {
        currentLocation: {
            latitude: currentLat,
            longitude: currentLng
        },
        origin: {
            latitude: warehouseLat,
            longitude: warehouseLng,
            name: warehouse.city || 'Warehouse'
        },
        destination: {
            latitude: destLat,
            longitude: destLng,
            name: `${shipment.destination_city}, ${shipment.destination_state}`
        },
        progress,
        statusMessage,
        status
    };
};

/**
 * Calculate estimated time of arrival
 * @param {number} distance - Distance in km
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} deliveryDeadline - ISO date string of delivery deadline
 * @returns {string} ETA message
 */
export const calculateETA = (distance, progress, deliveryDeadline) => {
    if (progress >= 100) {
        return 'Delivered';
    }

    if (progress === 0) {
        return 'Not yet dispatched';
    }

    // Calculate time remaining based on delivery deadline
    if (deliveryDeadline) {
        const deadline = new Date(deliveryDeadline);
        const now = new Date();
        const msRemaining = deadline - now;

        if (msRemaining < 0) {
            return 'Overdue';
        }

        const hoursRemaining = msRemaining / (1000 * 60 * 60);
        const daysRemaining = msRemaining / (1000 * 60 * 60 * 24);

        if (hoursRemaining < 1) {
            const minutes = Math.round(hoursRemaining * 60);
            return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else if (hoursRemaining < 24) {
            const hours = Math.round(hoursRemaining);
            return `${hours} hour${hours !== 1 ? 's' : ''}`;
        } else {
            const days = Math.round(daysRemaining);
            return `${days} day${days !== 1 ? 's' : ''}`;
        }
    }

    // Fallback to speed-based calculation
    const avgSpeed = 60; // km/h
    const remainingDistance = distance * ((100 - progress) / 100);
    const hoursRemaining = remainingDistance / avgSpeed;

    if (hoursRemaining < 1) {
        const minutes = Math.round(hoursRemaining * 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (hoursRemaining < 24) {
        const hours = Math.round(hoursRemaining);
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
        const days = Math.round(hoursRemaining / 24);
        return `${days} day${days !== 1 ? 's' : ''}`;
    }
};

/**
 * Get tracking timeline events
 * @param {Object} shipment - Shipment data
 * @returns {Array} Timeline events
 */
export const getTrackingTimeline = (shipment) => {
    const timeline = [];
    const createdAt = new Date(shipment.created_at);

    // Shipment created
    timeline.push({
        status: 'created',
        message: 'Shipment created',
        timestamp: createdAt,
        completed: true
    });

    // Assigned
    if (shipment.status !== 'pending') {
        timeline.push({
            status: 'assigned',
            message: 'Truck assigned',
            timestamp: new Date(createdAt.getTime() + 1000 * 60 * 30), // +30 mins
            completed: true
        });
    }

    // In transit
    if (shipment.status === 'in_transit' || shipment.status === 'delivered') {
        timeline.push({
            status: 'in_transit',
            message: 'In transit',
            timestamp: new Date(createdAt.getTime() + 1000 * 60 * 60), // +1 hour
            completed: true
        });
    }

    // Delivered
    if (shipment.status === 'delivered') {
        timeline.push({
            status: 'delivered',
            message: 'Delivered',
            timestamp: shipment.delivered_at ? new Date(shipment.delivered_at) : new Date(),
            completed: true
        });
    } else {
        // Estimated delivery
        const estimatedDelivery = shipment.delivery_deadline
            ? new Date(shipment.delivery_deadline)
            : new Date(createdAt.getTime() + 1000 * 60 * 60 * 24 * 3); // +3 days

        timeline.push({
            status: 'estimated_delivery',
            message: 'Estimated delivery',
            timestamp: estimatedDelivery,
            completed: false
        });
    }

    return timeline;
};
