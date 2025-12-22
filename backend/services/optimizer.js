/**
 * Smart Truck Loading Optimization Engine
 * Multi-criteria scoring system for truck-shipment matching
 */

import { calculateDistance, calculateHaversineDistance } from './maps.js';
import db from '../database.js';

// Scoring weights
const WEIGHTS = {
    CAPACITY: 0.35,
    ROUTE: 0.25,
    COST: 0.25,
    CO2: 0.15
};

// Fallback distance if Google Maps fails (km)
const FALLBACK_DISTANCE = 500;

// Distance cache to reduce API calls
const distanceCache = new Map();

/**
 * Get distance between dealer and shipment destination
 * Uses Google Maps API with caching and fallback
 */
const getDistance = async (dealerLat, dealerLng, destLat, destLng, dealerCity, destCity, destState) => {
    // Create cache key
    const cacheKey = `${dealerLat},${dealerLng}-${destLat},${destLng}`;

    // Check cache first
    if (distanceCache.has(cacheKey)) {
        return distanceCache.get(cacheKey);
    }

    try {
        // Build origin and destination strings
        const origin = dealerLat && dealerLng
            ? `${dealerLat},${dealerLng}`
            : dealerCity || 'Mumbai, India';

        const destination = destLat && destLng
            ? `${destLat},${destLng}`
            : `${destCity}, ${destState}, India`;

        // Try Google Maps API
        const result = await calculateDistance(origin, destination);

        // Cache the result
        distanceCache.set(cacheKey, result.distance);

        return result.distance;
    } catch (error) {
        console.error('[Optimizer] Distance calculation error:', error.message);

        // Fallback to Haversine if coordinates are available
        if (dealerLat && dealerLng && destLat && destLng) {
            const distance = calculateHaversineDistance(dealerLat, dealerLng, destLat, destLng);
            distanceCache.set(cacheKey, distance);
            return distance;
        }

        // Ultimate fallback
        return FALLBACK_DISTANCE;
    }
};

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

// Map Indian states to their regions
const STATE_TO_REGION = {
    // North India
    'delhi': 'north', 'haryana': 'north', 'punjab': 'north', 'himachal pradesh': 'north',
    'uttarakhand': 'north', 'uttar pradesh': 'north', 'jammu and kashmir': 'north',
    'ladakh': 'north', 'chandigarh': 'north', 'rajasthan': 'north',
    // South India
    'karnataka': 'south', 'kerala': 'south', 'tamil nadu': 'south', 
    'andhra pradesh': 'south', 'telangana': 'south', 'puducherry': 'south',
    // West India
    'maharashtra': 'west', 'gujarat': 'west', 'goa': 'west', 
    'dadra and nagar haveli': 'west', 'daman and diu': 'west',
    // East India
    'west bengal': 'east', 'odisha': 'east', 'bihar': 'east', 'jharkhand': 'east',
    'sikkim': 'east', 'assam': 'east', 'meghalaya': 'east', 'tripura': 'east',
    'mizoram': 'east', 'manipur': 'east', 'nagaland': 'east', 'arunachal pradesh': 'east',
    // Central India
    'madhya pradesh': 'central', 'chhattisgarh': 'central'
};

/**
 * Calculate route compatibility score
 * @param {Object} shipment - Shipment details
 * @param {Object} truck - Truck details
 * @returns {number} Score 0 or 100
 */
export const calculateRouteScore = (shipment, truck) => {
    // Use new address fields (destination_state, destination_city)
    const destinationState = (shipment.destination_state || '').toLowerCase();
    const destinationCity = (shipment.destination_city || '').toLowerCase();
    const serviceRegions = truck.service_regions.map(r => r.toLowerCase());

    // Check for Pan India coverage
    if (serviceRegions.includes('pan india')) {
        return 100;
    }

    // Get the region for the destination state
    const destRegion = STATE_TO_REGION[destinationState];

    // Check if destination state/region matches any service region
    for (const region of serviceRegions) {
        const cleanRegion = region.replace(' india', '').trim();

        // Match by region (e.g., "North India" matches states in north region)
        if (destRegion && cleanRegion === destRegion) {
            return 100;
        }

        // Match by state directly (primary method)
        if (destinationState === cleanRegion) {
            return 100;
        }

        // Match by partial state name
        if (destinationState.includes(cleanRegion) || cleanRegion.includes(destinationState)) {
            return 100;
        }

        // Also check city for backwards compatibility
        if (destinationCity.includes(cleanRegion) || cleanRegion.includes(destinationCity)) {
            return 100;
        }
    }

    return 0;
};

/**
 * Calculate cost efficiency score
 * @param {Object} truck - Truck details
 * @param {number} distance - Actual distance in km
 * @param {Array} allCosts - All truck costs for normalization
 * @returns {number} Score 0-100
 */
export const calculateCostScore = (truck, distance, allCosts) => {
    const cost = truck.base_cost + (distance * truck.cost_per_km);

    const minCost = Math.min(...allCosts);
    const maxCost = Math.max(...allCosts);

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
 * Main optimization function - NOW ASYNC
 * @param {Object} shipment - Shipment to optimize
 * @param {Array} trucks - Available trucks
 * @returns {Promise<Array>} Top 3 recommended trucks with scores
 */
export const optimizeTruckForShipment = async (shipment, trucks) => {
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

    // Get dealer locations for all feasible trucks
    const truckIds = feasibleTrucks.map(t => t.id);
    const dealerLocations = db.prepare(`
        SELECT t.id as truck_id, u.latitude, u.longitude, u.city
        FROM trucks t
        JOIN users u ON t.dealer_id = u.id
        WHERE t.id IN (${truckIds.join(',')})
    `).all();

    // Create a map of truck_id to dealer location
    const locationMap = new Map();
    dealerLocations.forEach(loc => {
        locationMap.set(loc.truck_id, {
            lat: loc.latitude,
            lng: loc.longitude,
            city: loc.city
        });
    });

    // Calculate distances for all trucks (in parallel)
    console.log(`[Optimizer] Optimizing ${shipments.length} shipments for ${feasibleTrucks.length} trucks`);

    // DEBUG LOG
    feasibleTrucks.forEach(t => {
        console.log(`[Optimizer] Available Truck: ${t.truck_name} (ID: ${t.id}), MaxW: ${t.max_weight_kg}, MaxV: ${t.max_volume_m3}`);
    });

    const distancePromises = feasibleTrucks.map(async truck => {
        const dealerLoc = locationMap.get(truck.id) || {};
        const distance = await getDistance(
            dealerLoc.lat,
            dealerLoc.lng,
            shipment.destination_latitude,
            shipment.destination_longitude,
            dealerLoc.city,
            shipment.destination_city,
            shipment.destination_state
        );
        return { truck, distance };
    });

    const trucksWithDistances = await Promise.all(distancePromises);

    // Calculate all costs for normalization
    const allCosts = trucksWithDistances.map(({ truck, distance }) =>
        truck.base_cost + (distance * truck.cost_per_km)
    );

    // Score each feasible truck
    const scoredTrucks = trucksWithDistances.map(({ truck, distance }) => {
        const scores = {
            capacity: calculateCapacityScore(shipment, truck),
            route: calculateRouteScore(shipment, truck),
            cost: calculateCostScore(truck, distance, allCosts),
            co2: calculateCO2Score(shipment, truck)
        };

        const totalScore = calculateWeightedScore(scores);

        // Calculate utilization percentage
        const weightUtilization = shipment.weight_kg / truck.max_weight_kg;
        const volumeUtilization = shipment.volume_m3 / truck.max_volume_m3;
        const utilization = (weightUtilization + volumeUtilization) / 2;

        // Calculate estimated cost with REAL distance
        const estimatedCost = truck.base_cost + (distance * truck.cost_per_km);

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
                distance: `${Math.round(distance)}km` // REAL distance!
            }
        };
    });

    // Sort by total score (descending) and return top 3
    return scoredTrucks
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 3);
};
