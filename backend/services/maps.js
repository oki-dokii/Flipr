import { Client } from '@googlemaps/google-maps-services-js';
import { getCityCoordinates, calculateDistance as calculateHaversineDistance } from './addressService.js';

export { calculateHaversineDistance };

const client = new Client({});

// Use environment variable for API key
const API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

/**
 * Calculate distance and duration between two locations
 * @param {string} origin - Origin address or coordinates "lat,lng"
 * @param {string} destination - Destination address or coordinates "lat,lng"
 * @returns {Promise<{distance: number, duration: number}>} Distance in km, duration in minutes
 */
export const calculateDistance = async (origin, destination) => {
    // Helper to get coords from string "lat,lng" or city name
    const resolveCoords = (input) => {
        if (!input) return null;

        // Try parsing "lat,lng"
        if (input.includes(',')) {
            const parts = input.split(',').map(p => p.trim());
            const lat = parseFloat(parts[0]);
            const lng = parseFloat(parts[1]);
            // If parts are numbers (and not just "City, State"), use them
            if (!isNaN(lat) && !isNaN(lng) && input.match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)) {
                return { lat, lng };
            }
        }

        // Try city lookup
        // Extract city if format is "City, State"
        const cityName = input.split(',')[0].trim();
        const cityCoords = getCityCoordinates(cityName);
        if (cityCoords) {
            return { lat: cityCoords.lat, lng: cityCoords.lon || cityCoords.lng };
        }

        return null;
    };

    try {
        if (!API_KEY) {
            console.warn('[Maps] No API key, attempting local fallback...');

            console.log(`[Maps] Calculating distance for Origin: "${origin}" -> Destination: "${destination}"`);

            const originCoords = resolveCoords(origin);
            const destCoords = resolveCoords(destination);

            if (!originCoords) console.warn(`[Maps] Failed to resolve origin: "${origin}"`);
            if (!destCoords) console.warn(`[Maps] Failed to resolve destination: "${destination}"`);

            if (originCoords && destCoords) {
                const km = calculateHaversineDistance(
                    originCoords.lat, originCoords.lng,
                    destCoords.lat, destCoords.lng
                );
                console.log(`[Maps] Local calc: ${origin} -> ${destination} = ${km}km`);

                // Estimate duration: 60km/h avg speed
                const durationMins = Math.round((km / 60) * 60);

                return {
                    distance: km,
                    duration: durationMins,
                    distanceText: `${km} km`,
                    durationText: `${Math.round(durationMins / 60)} hours`
                };
            }

            console.warn('[Maps] Could not resolve coordinates locally, using static fallback.');
            return { distance: 500, duration: 600 };
        }

        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations: [destination],
                key: API_KEY,
                mode: 'driving',
            },
        });

        const element = response.data.rows[0]?.elements[0];

        if (element?.status === 'OK') {
            return {
                distance: element.distance.value / 1000, // Convert meters to km
                duration: element.duration.value / 60,   // Convert seconds to minutes
                distanceText: element.distance.text,
                durationText: element.duration.text,
            };
        } else {
            console.error('[Maps] Distance calculation failed:', element?.status);
            return { distance: 500, duration: 600 }; // Fallback
        }
    } catch (error) {
        console.error('[Maps] Error calculating distance:', error.message);
        return { distance: 500, duration: 600 }; // Fallback on error
    }
};

/**
 * Get detailed route information between two locations
 * @param {string} origin - Origin address or coordinates
 * @param {string} destination - Destination address or coordinates
 * @returns {Promise<Object>} Route details including polyline, distance, duration
 */
export const getRoute = async (origin, destination) => {
    try {
        if (!API_KEY) {
            console.warn('[Maps] No API key configured, cannot get route');
            return null;
        }

        const response = await client.directions({
            params: {
                origin,
                destination,
                key: API_KEY,
                mode: 'driving',
            },
        });

        if (response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                polyline: route.overview_polyline.points,
                distance: route.legs[0].distance.value / 1000, // km
                duration: route.legs[0].duration.value / 60,   // minutes
                distanceText: route.legs[0].distance.text,
                durationText: route.legs[0].duration.text,
                startAddress: route.legs[0].start_address,
                endAddress: route.legs[0].end_address,
                steps: route.legs[0].steps.map(step => ({
                    instruction: step.html_instructions,
                    distance: step.distance.text,
                    duration: step.duration.text,
                })),
            };
        }

        return null;
    } catch (error) {
        console.error('[Maps] Error getting route:', error.message);
        return null;
    }
};

/**
 * Geocode an address to get coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lng: number}>} Coordinates
 */
export const geocodeAddress = async (address) => {
    try {
        if (!API_KEY) {
            console.warn('[Maps] No API key configured, cannot geocode');
            return null;
        }

        const response = await client.geocode({
            params: {
                address,
                key: API_KEY,
            },
        });

        if (response.data.results && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng,
                formattedAddress: response.data.results[0].formatted_address,
            };
        }

        return null;
    } catch (error) {
        console.error('[Maps] Error geocoding address:', error.message);
        return null;
    }
};


