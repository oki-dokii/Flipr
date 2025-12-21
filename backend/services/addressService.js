/**
 * Address and Distance Calculation Service
 * Provides utilities for location-based operations
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // Distance in km, rounded
};

const toRad = (deg) => deg * (Math.PI / 180);

/**
 * Validate if coordinates are within India
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean} True if coordinates are in India
 */
export const validateIndianCoordinates = (lat, lon) => {
    // India bounding box: ~8°N to 35°N, ~68°E to 97°E
    return lat >= 8 && lat <= 37 && lon >= 68 && lon <= 98;
};

/**
 * Simplified state detection from coordinates
 * For hackathon purposes - uses approximate state boundaries
 */
const STATE_COORDINATES = {
    "Maharashtra": { latMin: 15.6, latMax: 22.0, lonMin: 72.6, lonMax: 80.9, lat: 19.7515, lon: 75.7139 },
    "Gujarat": { latMin: 20.1, latMax: 24.7, lonMin: 68.2, lonMax: 74.5, lat: 22.2587, lon: 71.1924 },
    "Delhi": { latMin: 28.4, latMax: 28.9, lonMin: 76.8, lonMax: 77.3, lat: 28.7041, lon: 77.1025 },
    "Karnataka": { latMin: 11.5, latMax: 18.5, lonMin: 74.0, lonMax: 78.6, lat: 15.3173, lon: 75.7139 },
    "Tamil Nadu": { latMin: 8.0, latMax: 13.6, lonMin: 76.2, lonMax: 80.3, lat: 11.1271, lon: 78.6569 },
    "Uttar Pradesh": { latMin: 23.8, latMax: 30.5, lonMin: 77.0, lonMax: 84.6, lat: 26.8467, lon: 80.9462 },
    "Rajasthan": { latMin: 23.0, latMax: 30.2, lonMin: 69.5, lonMax: 78.3, lat: 27.0238, lon: 74.2179 },
    "West Bengal": { latMin: 21.5, latMax: 27.2, lonMin: 85.8, lonMax: 89.9, lat: 22.9868, lon: 87.8550 },
    "Madhya Pradesh": { latMin: 21.0, latMax: 26.9, lonMin: 74.0, lonMax: 82.9, lat: 22.9734, lon: 78.6569 },
    "Punjab": { latMin: 29.5, latMax: 32.6, lonMin: 73.9, lonMax: 76.9, lat: 31.1471, lon: 75.3412 },
    "Haryana": { latMin: 27.7, latMax: 30.9, lonMin: 74.5, lonMax: 77.6, lat: 29.0588, lon: 76.0856 },
    "Kerala": { latMin: 8.2, latMax: 12.8, lonMin: 74.8, lonMax: 77.4, lat: 10.8505, lon: 76.2711 },
    "Telangana": { latMin: 15.8, latMax: 19.9, lonMin: 77.2, lonMax: 81.3, lat: 18.1124, lon: 79.0193 },
    "Andhra Pradesh": { latMin: 12.6, latMax: 19.9, lonMin: 76.8, lonMax: 84.8, lat: 15.9129, lon: 79.7400 }
};

/**
 * Get state name from coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string|null} State name or null if not found
 */
export const getStateFromCoordinates = (lat, lon) => {
    for (const [state, range] of Object.entries(STATE_COORDINATES)) {
        if (lat >= range.latMin && lat <= range.latMax &&
            lon >= range.lonMin && lon <= range.lonMax) {
            return state;
        }
    }
    return null;
};

/**
 * Check if truck services the route based on destination state
 * @param {object} truck - Truck object with service_regions array
 * @param {number} destLat - Destination latitude
 * @param {number} destLon - Destination longitude
 * @returns {boolean} True if truck services this route
 */
export const isRouteServiced = (truck, destLat, destLon) => {
    // If truck services "Pan India", accept all routes
    if (truck.service_regions && truck.service_regions.includes("Pan India")) {
        return true;
    }

    // Detect destination state from coordinates
    const destState = getStateFromCoordinates(destLat, destLon);

    if (!destState) {
        // If can't detect state, be lenient for hackathon
        return true;
    }

    // Check if destination state is in service regions
    return truck.service_regions && truck.service_regions.includes(destState);
};

/**
 * Get approximate coordinates for Indian cities
 * For hackathon demo purposes
 */
export const CITY_COORDINATES = {
    "Mumbai": { lat: 19.0760, lon: 72.8777, state: "Maharashtra" },
    "Delhi": { lat: 28.7041, lon: 77.1025, state: "Delhi" },
    "Bangalore": { lat: 12.9716, lon: 77.5946, state: "Karnataka" },
    "Bengaluru": { lat: 12.9716, lon: 77.5946, state: "Karnataka" },
    "Hyderabad": { lat: 17.3850, lon: 78.4867, state: "Telangana" },
    "Ahmedabad": { lat: 23.0225, lon: 72.5714, state: "Gujarat" },
    "Chennai": { lat: 13.0827, lon: 80.2707, state: "Tamil Nadu" },
    "Kolkata": { lat: 22.5726, lon: 88.3639, state: "West Bengal" },
    "Pune": { lat: 18.5204, lon: 73.8567, state: "Maharashtra" },
    "Jaipur": { lat: 26.9124, lon: 75.7873, state: "Rajasthan" },
    "Surat": { lat: 21.1702, lon: 72.8311, state: "Gujarat" },
    "Lucknow": { lat: 26.8467, lon: 80.9462, state: "Uttar Pradesh" },
    "Kanpur": { lat: 26.4499, lon: 80.3319, state: "Uttar Pradesh" },
    "Nagpur": { lat: 21.1458, lon: 79.0882, state: "Maharashtra" },
    "Indore": { lat: 22.7196, lon: 75.8577, state: "Madhya Pradesh" },
    "Thane": { lat: 19.2183, lon: 72.9781, state: "Maharashtra" },
    "Bhopal": { lat: 23.2599, lon: 77.4126, state: "Madhya Pradesh" },
    "Visakhapatnam": { lat: 17.6869, lon: 83.2185, state: "Andhra Pradesh" },
    "Pimpri-Chinchwad": { lat: 18.6298, lon: 73.7997, state: "Maharashtra" },
    "Patna": { lat: 25.5941, lon: 85.1376, state: "Bihar" },
    "Vadodara": { lat: 22.3072, lon: 73.1812, state: "Gujarat" },
    "Ghaziabad": { lat: 28.6692, lon: 77.4538, state: "Uttar Pradesh" },
    "Ludhiana": { lat: 30.9010, lon: 75.8573, state: "Punjab" },
    "Agra": { lat: 27.1767, lon: 78.0081, state: "Uttar Pradesh" },
    "Nashik": { lat: 19.9975, lon: 73.7898, state: "Maharashtra" },
    "Faridabad": { lat: 28.4089, lon: 77.3178, state: "Haryana" },
    "Meerut": { lat: 28.9845, lon: 77.7064, state: "Uttar Pradesh" },
    "Rajkot": { lat: 22.3039, lon: 70.8022, state: "Gujarat" },
    "Kalyan-Dombivali": { lat: 19.2403, lon: 73.1305, state: "Maharashtra" },
    "Vasai-Virar": { lat: 19.4612, lon: 72.7985, state: "Maharashtra" }
};

/**
 * Get coordinates for a city name
 * @param {string} cityName - Name of the city
 * @returns {object|null} Coordinates {lat, lon, state} or null
 */
export const getCityCoordinates = (cityName) => {
    if (!cityName) return null;

    // Normalize: trim, capitalize first letter of each word (Title Case)
    // This makes "mumbai" → "Mumbai", "new delhi" → "New Delhi"
    const normalized = cityName.trim()
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return CITY_COORDINATES[normalized] || null;
};

/**
 * List of Indian states for forms
 */
export const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Pan India"
];
