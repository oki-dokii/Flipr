// City to State mapping for Indian cities
export const CITY_TO_STATE_MAP: Record<string, string> = {
    // Maharashtra
    'mumbai': 'Maharashtra',
    'pune': 'Maharashtra',
    'nagpur': 'Maharashtra',
    'nashik': 'Maharashtra',
    'aurangabad': 'Maharashtra',
    'solapur': 'Maharashtra',
    'thane': 'Maharashtra',
    'navi mumbai': 'Maharashtra',

    // Delhi
    'delhi': 'Delhi',
    'new delhi': 'Delhi',

    // Karnataka
    'bangalore': 'Karnataka',
    'bengaluru': 'Karnataka',
    'mysore': 'Karnataka',
    'mangalore': 'Karnataka',
    'hubli': 'Karnataka',

    // Tamil Nadu
    'chennai': 'Tamil Nadu',
    'coimbatore': 'Tamil Nadu',
    'madurai': 'Tamil Nadu',
    'salem': 'Tamil Nadu',
    'tiruchirappalli': 'Tamil Nadu',
    'trichy': 'Tamil Nadu',

    // Gujarat
    'ahmedabad': 'Gujarat',
    'surat': 'Gujarat',
    'vadodara': 'Gujarat',
    'rajkot': 'Gujarat',
    'gandhinagar': 'Gujarat',

    // Uttar Pradesh
    'lucknow': 'Uttar Pradesh',
    'kanpur': 'Uttar Pradesh',
    'agra': 'Uttar Pradesh',
    'varanasi': 'Uttar Pradesh',
    'noida': 'Uttar Pradesh',
    'ghaziabad': 'Uttar Pradesh',
    'meerut': 'Uttar Pradesh',

    // West Bengal
    'kolkata': 'West Bengal',
    'howrah': 'West Bengal',
    'durgapur': 'West Bengal',
    'asansol': 'West Bengal',

    // Rajasthan
    'jaipur': 'Rajasthan',
    'jodhpur': 'Rajasthan',
    'udaipur': 'Rajasthan',
    'kota': 'Rajasthan',
    'ajmer': 'Rajasthan',

    // Telangana
    'hyderabad': 'Telangana',
    'warangal': 'Telangana',
    'nizamabad': 'Telangana',

    // Andhra Pradesh
    'visakhapatnam': 'Andhra Pradesh',
    'vijayawada': 'Andhra Pradesh',
    'guntur': 'Andhra Pradesh',
    'tirupati': 'Andhra Pradesh',

    // Kerala
    'thiruvananthapuram': 'Kerala',
    'kochi': 'Kerala',
    'kozhikode': 'Kerala',
    'thrissur': 'Kerala',
    'kollam': 'Kerala',

    // Punjab
    'chandigarh': 'Punjab',
    'ludhiana': 'Punjab',
    'amritsar': 'Punjab',
    'jalandhar': 'Punjab',

    // Haryana
    'faridabad': 'Haryana',
    'gurgaon': 'Haryana',
    'gurugram': 'Haryana',
    'rohtak': 'Haryana',

    // Madhya Pradesh
    'indore': 'Madhya Pradesh',
    'bhopal': 'Madhya Pradesh',
    'jabalpur': 'Madhya Pradesh',
    'gwalior': 'Madhya Pradesh',

    // Bihar
    'patna': 'Bihar',
    'gaya': 'Bihar',
    'bhagalpur': 'Bihar',
    'muzaffarpur': 'Bihar',

    // Odisha
    'bhubaneswar': 'Odisha',
    'cuttack': 'Odisha',
    'rourkela': 'Odisha',

    // Assam
    'guwahati': 'Assam',
    'silchar': 'Assam',
    'dibrugarh': 'Assam',

    // Jharkhand
    'ranchi': 'Jharkhand',
    'jamshedpur': 'Jharkhand',
    'dhanbad': 'Jharkhand',

    // Uttarakhand
    'dehradun': 'Uttarakhand',
    'haridwar': 'Uttarakhand',
    'roorkee': 'Uttarakhand',

    // Himachal Pradesh
    'shimla': 'Himachal Pradesh',
    'manali': 'Himachal Pradesh',
    'dharamshala': 'Himachal Pradesh',

    // Jammu and Kashmir
    'srinagar': 'Jammu and Kashmir',
    'jammu': 'Jammu and Kashmir',

    // Goa
    'panaji': 'Goa',
    'margao': 'Goa',
    'vasco': 'Goa',

    // Chhattisgarh
    'raipur': 'Chhattisgarh',
    'bhilai': 'Chhattisgarh',
    'bilaspur': 'Chhattisgarh',

    // Puducherry
    'puducherry': 'Puducherry',
    'pondicherry': 'Puducherry',
};

/**
 * Get state from city name
 * @param city - City name (case-insensitive)
 * @returns State name or empty string if not found
 */
export const getStateFromCity = (city: string): string => {
    if (!city) return '';

    const normalizedCity = city.toLowerCase().trim();
    return CITY_TO_STATE_MAP[normalizedCity] || '';
};
