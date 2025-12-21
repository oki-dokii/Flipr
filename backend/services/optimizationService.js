
import db from '../database.js';
import { getAvailableTrucks } from '../models/Truck.js';
import { getPendingShipments } from '../models/Shipment.js';

// Standard truck fallback if no specific trucks available for simulation
const STANDARD_TRUCK = {
    id: 'virtual-1',
    truck_name: 'Standard Heavy Duty',
    max_weight_kg: 25000,
    max_volume_m3: 80,
    base_cost: 5000,
    cost_per_km: 40
};

/**
 * Consolidate pending shipments for a warehouse
 * Groups compatible shipments to maximize truck utilization
 */
export const consolidateShipments = async (warehouseId) => {
    // 1. Get all pending shipments for this warehouse
    const stmt = db.prepare(`
        SELECT * FROM shipments 
        WHERE warehouse_id = ? AND status = 'pending'
        ORDER BY created_at ASC
    `);
    const shipments = stmt.all(warehouseId);

    if (shipments.length === 0) {
        return { groups: [], summary: { totalSaved: 0, trucksNeeded: 0 } };
    }

    // 2. Fetch available trucks (real capacity)
    let availableTrucks = getAvailableTrucks({});
    if (availableTrucks.length === 0) {
        availableTrucks = [STANDARD_TRUCK]; // Use virtual truck for simulation
    }

    // 3. Group by destination (City + State)
    const destinationGroups = {};
    shipments.forEach(s => {
        const key = `${s.destination_city.toLowerCase()}-${s.destination_state.toLowerCase()}`;
        if (!destinationGroups[key]) destinationGroups[key] = [];
        destinationGroups[key].push(s);
    });

    // 4. Bin Packing (Greedy) for each destination
    console.log(`[Consolidate] Consolidating ${shipments.length} shipments. Available Trucks: ${availableTrucks.length}`);
    if (availableTrucks.length > 0) {
        console.log(`[Consolidate] Truck 1: ${availableTrucks[0].truck_name}, Capacity: ${availableTrucks[0].max_weight_kg}kg / ${availableTrucks[0].max_volume_m3}m3`);
    }

    const consolidationResults = [];
    let grandTotalSaved = 0;

    // Default safety margin 95%
    const SAFETY_MARGIN = 0.95;

    for (const [key, groupShipments] of Object.entries(destinationGroups)) {
        // Sort by larger constraints first (Descent Fit)
        groupShipments.sort((a, b) => b.weight_kg - a.weight_kg);

        const trucksUsed = []; // Array of { truck, shipments: [], currentWeight: 0, currentVolume: 0 }

        for (const shipment of groupShipments) {
            let placed = false;

            // Try to fit in existing open truck for this route
            for (const load of trucksUsed) {
                const truck = load.truck;
                const newWeight = load.currentWeight + shipment.weight_kg;
                const newVolume = load.currentVolume + shipment.volume_m3;

                if (newWeight <= truck.max_weight_kg * SAFETY_MARGIN &&
                    newVolume <= truck.max_volume_m3 * SAFETY_MARGIN) {

                    load.shipments.push(shipment);
                    load.currentWeight = newWeight;
                    load.currentVolume = newVolume;
                    placed = true;
                    break;
                }
            }

            // If not placed, perform "Rent New Truck" action
            if (!placed) {
                // Find best matching available truck (simple: first that fits or standard)
                // In a real advanced algo, we'd pick the *smallest* truck that fits this item + future items
                // Here we pick the largest available to maximize successful consolidation
                const truck = availableTrucks[0];

                trucksUsed.push({
                    truck: truck,
                    shipments: [shipment],
                    currentWeight: shipment.weight_kg,
                    currentVolume: shipment.volume_m3
                });
            }
        }

        // Calculate stats for this destination
        trucksUsed.forEach(load => {
            const utilization = Math.max(
                load.currentWeight / load.truck.max_weight_kg,
                load.currentVolume / load.truck.max_volume_m3
            );

            // Estimated individual costs (Rough proxy)
            const individualCost = load.shipments.length * 2000; // Mock base cost per separate shipment
            // Consolidated cost
            const consolidatedCost = load.truck.base_cost * 1.0; // One truck base fee

            consolidationResults.push({
                destination: key,
                truckName: load.truck.truck_name,
                shipmentCount: load.shipments.length,
                shipmentIds: load.shipments.map(s => s.id),
                totalWeight: load.currentWeight,
                utilization: (utilization * 100).toFixed(1),
                estimatedSavings: Math.max(0, individualCost - consolidatedCost)
            });

            grandTotalSaved += Math.max(0, individualCost - consolidatedCost);
        });
    }

    return {
        groups: consolidationResults,
        summary: {
            totalSaved: grandTotalSaved,
            trucksNeeded: consolidationResults.length,
            pendingCount: shipments.length
        }
    };
};

/**
 * Run What-If Simulation
 */
// Mock Emission Factors (kg CO2 per km)
const TRUCK_OPTIONS = [
    { id: 'v1', truck_name: 'Standard Diesel 10T', max_weight_kg: 10000, max_volume_m3: 40, base_cost: 2000, cost_per_km: 20, co2_factor: 0.9 },
    { id: 'v2', truck_name: 'Eco Hybrid 25T', max_weight_kg: 25000, max_volume_m3: 80, base_cost: 5000, cost_per_km: 25, co2_factor: 0.5 },
    { id: 'v3', truck_name: 'Electric Heavy 40T', max_weight_kg: 40000, max_volume_m3: 120, base_cost: 20000, cost_per_km: 5, co2_factor: 0.05 }
];
// Trade-off Analysis (500km trip):
// v1: $12,000 | 450 kg CO2 (Cheapest, Dirtiest)
// v2: $17,500 | 250 kg CO2 (Balanced)
// v3: $22,500 | 25 kg CO2  (Most Expensive, Cleanest)

// Mock Emission Factors (kg CO2 per km)
const EMISSION_FACTORS = {
    LTL: 0.0002, // per kg-km (High to make consolidation attractive)
    FTL: 0.9     // per truck-km avg
};

/**
 * Run What-If Simulation with Weights
 */
export const runSimulation = async (shipmentIds, options = {}) => {
    // 1. Fetch specific shipments
    if (!shipmentIds || shipmentIds.length === 0) return null;

    const placeholders = shipmentIds.map(() => '?').join(',');
    const stmt = db.prepare(`SELECT * FROM shipments WHERE id IN (${placeholders})`);
    const shipments = stmt.all(...shipmentIds);

    const safetyLimit = options.ignoreSafety ? 1.0 : 0.95;
    const weights = options.weights || { utilization: 0.4, cost: 0.3, co2: 0.3 };

    // Calculate Totals
    const totalWeight = shipments.reduce((sum, s) => sum + s.weight_kg, 0);
    const totalVolume = shipments.reduce((sum, s) => sum + s.volume_m3, 0);

    // Baseline (LTL)
    // Cost: Base + Weight dependent
    const baselineCost = shipments.reduce((sum, s) => sum + (1500 + s.weight_kg * 6), 0);

    // CO2: Weight * Distance * Factor (Assume 500km avg)
    const AVG_DIST = 500;
    const baselineCO2 = shipments.reduce((sum, s) => sum + (s.weight_kg * AVG_DIST * EMISSION_FACTORS.LTL), 0);

    // Optimize: Find Best Truck based on Weights
    let bestSolution = null;
    let bestScore = -Infinity;

    for (const truck of TRUCK_OPTIONS) {
        // Bin Packing for this truck type
        let trucksNeeded = 1;
        let currentWeight = 0;
        let currentVolume = 0;

        for (const s of shipments) {
            if (currentWeight + s.weight_kg > truck.max_weight_kg * safetyLimit ||
                currentVolume + s.volume_m3 > truck.max_volume_m3 * safetyLimit) {
                trucksNeeded++;
                currentWeight = s.weight_kg;
                currentVolume = s.volume_m3;
            } else {
                currentWeight += s.weight_kg;
                currentVolume += s.volume_m3;
            }
        }

        // Metrics for this solution
        const solutionCost = trucksNeeded * (truck.base_cost + (AVG_DIST * truck.cost_per_km));
        const solutionCO2 = trucksNeeded * (AVG_DIST * truck.co2_factor);

        // Calculate Utilization of the *last* truck (others are full-ish) or avg
        const avgTruckWeight = totalWeight / trucksNeeded;
        const utilPct = avgTruckWeight / truck.max_weight_kg;

        // Normalize Metrics for Scoring (0-1)
        // Lower Cost is better, Lower CO2 is better, Higher Util is better
        const normCost = Math.max(0, 1 - (solutionCost / (baselineCost * 1.5))); // Cap at 1.5x baseline
        const normCO2 = Math.max(0, 1 - (solutionCO2 / (baselineCO2 * 1.5)));
        const normUtil = Math.min(1, utilPct);

        const score = (normUtil * weights.utilization) +
            (normCost * weights.cost) +
            (normCO2 * weights.co2);

        if (score > bestScore) {
            bestScore = score;
            bestSolution = {
                truck,
                trucksNeeded,
                cost: solutionCost,
                co2: solutionCO2,
                utilization: utilPct
            };
        }
    }

    const savings = baselineCost - bestSolution.cost;
    const improvement = ((baselineCost - bestSolution.cost) / baselineCost * 100).toFixed(1);
    const co2Savings = Math.max(0, baselineCO2 - bestSolution.co2);

    // Explainable Decision
    let reason = "Balanced choice.";
    if (weights.cost > 0.5) reason = `Selected ${bestSolution.truck.truck_name} for lowest cost efficiency.`;
    else if (weights.co2 > 0.5) reason = `Selected ${bestSolution.truck.truck_name} to minimize environmental impact.`;
    else if (weights.utilization > 0.5) reason = `Selected ${bestSolution.truck.truck_name} to maximize load capacity.`;
    else reason = `Optimized for a balance of Cost, CO2, and Capacity using ${bestSolution.truck.truck_name}.`;

    return {
        baseline: {
            method: 'Individual LTL Shipping',
            cost: Math.round(baselineCost),
            co2: Math.round(baselineCO2),
            trips: shipments.length
        },
        consolidated: {
            method: 'Optimized FTL Consolidation',
            cost: Math.round(bestSolution.cost),
            co2: Math.round(bestSolution.co2),
            trips: bestSolution.trucksNeeded,
            truckType: bestSolution.truck.truck_name,
            utilization: (bestSolution.utilization * 100).toFixed(1)
        },
        savings: Math.round(savings),
        co2Savings: Math.round(co2Savings),
        improvement: improvement,
        explanation: reason
    };
};
