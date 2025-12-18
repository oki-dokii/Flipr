/**
 * Smart Truck Loading Optimization Engine
 * Multi-criteria scoring system for truck-shipment matching
 */

// Scoring weights
const WEIGHTS = {
    CAPACITY: 0.35,
    ROUTE: 0.25,
    COST: 0.25,
    CO2: 0.15
};

// Estimated distance for cost calculation (km)
// In production, this would use a real routing API
const ESTIMATED_DISTANCE = 500;

/**
 * Calculate capacity utilization score
 * @param {Object} shipment - Shipment details
 * @param {Object} truck - Truck details
 * @returns {number} Score 0-100
 */
export const calculateCapacityScore = (shipment, truck) => {
    const weightUtilization = shipment.weight_kg / truck.max_weight_kg;
    const volumeUtilization = shipment.volume_m3 / truck.max_volume_m3;
    const utilization = (weightUtilization + volumeUtilization) / 2;

    // Reject if over capacity
    if (utilization > 1.0) {
        return 0;
    }

    // Penalize under-utilization
    if (utilization < 0.5) {
        return utilization * 100 * 0.5; // Heavy penalty
    }

    // Optimal range: 70-95%
    if (utilization >= 0.7 && utilization <= 0.95) {
        return 100;
    }

    // Good range: 50-70% or 95-100%
    if (utilization >= 0.5 && utilization < 0.7) {
        return 70 + ((utilization - 0.5) / 0.2) * 30; // Scale from 70 to 100
    }

    if (utilization > 0.95 && utilization <= 1.0) {
        return 100 - ((utilization - 0.95) / 0.05) * 20; // Scale from 100 to 80
    }

    return utilization * 100;
};

/**
 * Calculate route compatibility score
 * @param {Object} shipment - Shipment details
 * @param {Object} truck - Truck details
 * @returns {number} Score 0 or 100
 */
export const calculateRouteScore = (shipment, truck) => {
    // Check if truck services the destination region
    const destination = shipment.destination.toLowerCase();
    const serviceRegions = truck.service_regions.map(r => r.toLowerCase());

    // Check for Pan India coverage
    if (serviceRegions.includes('pan india')) {
        return 100;
    }

    // Check if destination matches any service region
    for (const region of serviceRegions) {
        if (destination.includes(region.replace(' india', ''))) {
            return 100;
        }
    }

    return 0;
};

/**
 * Calculate cost efficiency score
 * @param {Object} truck - Truck details
 * @param {Array} allTrucks - All available trucks for normalization
 * @returns {number} Score 0-100
 */
export const calculateCostScore = (truck, allTrucks) => {
    const distance = ESTIMATED_DISTANCE;
    const cost = truck.base_cost + (distance * truck.cost_per_km);

    // Calculate costs for all trucks
    const costs = allTrucks.map(t => t.base_cost + (distance * t.cost_per_km));
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);

    // Normalize: lower cost = higher score
    if (maxCost === minCost) {
        return 100;
    }

    const normalizedScore = 100 - ((cost - minCost) / (maxCost - minCost)) * 100;
    return Math.max(0, normalizedScore);
};

/**
 * Calculate CO2 impact score
 * @param {Object} shipment - Shipment details
 * @param {Object} truck - Truck details
 * @returns {number} Score 0-100
 */
export const calculateCO2Score = (shipment, truck) => {
    const weightUtilization = shipment.weight_kg / truck.max_weight_kg;
    const volumeUtilization = shipment.volume_m3 / truck.max_volume_m3;
    const utilization = (weightUtilization + volumeUtilization) / 2;

    // Better utilization = lower CO2 per kg transported
    // Cap at 100 for over-utilization edge cases
    return Math.min(utilization * 100, 100);
};

/**
 * Calculate weighted total score
 * @param {Object} scores - Individual criterion scores
 * @returns {number} Weighted total score
 */
export const calculateWeightedScore = (scores) => {
    return (
        scores.capacity * WEIGHTS.CAPACITY +
        scores.route * WEIGHTS.ROUTE +
        scores.cost * WEIGHTS.COST +
        scores.co2 * WEIGHTS.CO2
    );
};

/**
 * Main optimization function
 * @param {Object} shipment - Shipment to optimize
 * @param {Array} trucks - Available trucks
 * @returns {Array} Top 3 recommended trucks with scores
 */
export const optimizeTruckForShipment = (shipment, trucks) => {
    // Filter trucks by basic feasibility
    const feasibleTrucks = trucks.filter(truck => {
        // Must be available
        if (truck.availability_status !== 'available') {
            return false;
        }

        // Must have capacity
        const weightUtilization = shipment.weight_kg / truck.max_weight_kg;
        const volumeUtilization = shipment.volume_m3 / truck.max_volume_m3;
        if (weightUtilization > 1.0 || volumeUtilization > 1.0) {
            return false;
        }

        // Must service the route
        const routeScore = calculateRouteScore(shipment, truck);
        if (routeScore === 0) {
            return false;
        }

        return true;
    });

    // If no feasible trucks, return empty array
    if (feasibleTrucks.length === 0) {
        return [];
    }

    // Score each feasible truck
    const scoredTrucks = feasibleTrucks.map(truck => {
        const scores = {
            capacity: calculateCapacityScore(shipment, truck),
            route: calculateRouteScore(shipment, truck),
            cost: calculateCostScore(truck, feasibleTrucks),
            co2: calculateCO2Score(shipment, truck)
        };

        const totalScore = calculateWeightedScore(scores);

        // Calculate utilization percentage
        const weightUtilization = shipment.weight_kg / truck.max_weight_kg;
        const volumeUtilization = shipment.volume_m3 / truck.max_volume_m3;
        const utilization = (weightUtilization + volumeUtilization) / 2;

        // Calculate estimated cost
        const estimatedCost = truck.base_cost + (ESTIMATED_DISTANCE * truck.cost_per_km);

        // Calculate CO2 savings (compared to worst case)
        const co2Savings = Math.round(utilization * 100); // Simplified metric

        return {
            truck,
            totalScore: Math.round(totalScore * 10) / 10, // Round to 1 decimal
            scores: {
                capacity: Math.round(scores.capacity),
                route: Math.round(scores.route),
                cost: Math.round(scores.cost),
                co2: Math.round(scores.co2)
            },
            details: {
                utilization: `${Math.round(utilization * 100)}%`,
                estimatedCost: `₹${estimatedCost.toLocaleString('en-IN')}`,
                co2Savings: `${co2Savings}kg`,
                distance: `${ESTIMATED_DISTANCE}km`
            }
        };
    });

    // Sort by total score (descending) and return top 3
    return scoredTrucks
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 3);
};
