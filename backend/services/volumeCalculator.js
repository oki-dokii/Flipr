/**
 * Calculate total volume from boxes
 * @param {Array} boxes - Array of box objects with dimensions and count
 * @returns {number} Total volume in cubic meters
 */
export const calculateTotalVolume = (boxes) => {
    return boxes.reduce((total, box) => {
        // Volume = length × width × height × count
        const volume = box.length * box.width * box.height * box.count;
        return total + volume;
    }, 0);
};

/**
 * Estimate weight based on volume (optional)
 * Uses average density for general cargo
 * @param {number} volume - Volume in cubic meters
 * @returns {number} Estimated weight in kg
 */
export const estimateWeightFromVolume = (volume) => {
    // Average cargo density: ~200 kg/m³
    const averageDensity = 200;
    return volume * averageDensity;
};

/**
 * Validate box data
 * @param {Array} boxes - Array of box objects
 * @returns {Object} Validation result
 */
export const validateBoxes = (boxes) => {
    if (!Array.isArray(boxes) || boxes.length === 0) {
        return { valid: false, error: 'At least one box is required' };
    }

    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];

        if (!box.length || !box.width || !box.height || !box.count) {
            return { valid: false, error: `Box ${i + 1}: All dimensions and count are required` };
        }

        if (box.length <= 0 || box.width <= 0 || box.height <= 0 || box.count <= 0) {
            return { valid: false, error: `Box ${i + 1}: All values must be positive` };
        }

        if (box.count > 10000) {
            return { valid: false, error: `Box ${i + 1}: Count seems unreasonably high` };
        }

        if (box.length > 20 || box.width > 20 || box.height > 20) {
            return { valid: false, error: `Box ${i + 1}: Dimensions seem unreasonably large (max 20m)` };
        }
    }

    return { valid: true };
};

/**
 * Calculate box summary statistics
 * @param {Array} boxes - Array of box objects
 * @returns {Object} Summary statistics
 */
export const calculateBoxSummary = (boxes) => {
    const totalBoxes = boxes.reduce((sum, box) => sum + box.count, 0);
    const totalVolume = calculateTotalVolume(boxes);
    const estimatedWeight = estimateWeightFromVolume(totalVolume);

    return {
        totalBoxes,
        totalVolume: Math.round(totalVolume * 100) / 100, // Round to 2 decimals
        estimatedWeight: Math.round(estimatedWeight),
        boxTypes: boxes.length
    };
};
