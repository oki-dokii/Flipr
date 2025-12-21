import { Client } from '@googlemaps/google-maps-services-js';

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
    try {
        if (!API_KEY) {
            console.warn('[Maps] No API key configured, using fallback distance');
            // Fallback: approximate distance based on coordinates if provided
            return { distance: 500, duration: 600 }; // Default fallback
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

/**
 * Calculate distance between two coordinate points using Haversine formula
 * Fallback method when Google Maps API is not available
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
