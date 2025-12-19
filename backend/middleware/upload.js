import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/trucks/'));
    },
    filename: (req, file, cb) => {
        // Generate unique filename: truck-{timestamp}-{random}.{ext}
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `truck-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

// Create multer instance
export const uploadTruckImage = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

export default uploadTruckImage;
