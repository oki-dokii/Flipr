import 'dotenv/config'; // Must be first to load env vars before other imports
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import truckRoutes from './routes/trucks.js';
import shipmentRoutes from './routes/shipments.js';
import optimizeRoutes from './routes/optimize.js';
import bookingRoutes from './routes/bookings.js';
import maintenanceRoutes from './routes/maintenance.js';
import mapsRoutes from './routes/maps.js';
import statsRoutes from './routes/stats.js';
import calculatorRoutes from './routes/calculator.js';
import reportsRoutes from './routes/reports.js';
import adminRoutes from './routes/admin.js';
import analyticsRoutes from './routes/analytics.js';
import optimizationRoutes from './routes/optimization.js';
import { logError } from './utils/logger.js';
import { dbPromise } from './database.js'; // Initialize database

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        // Allow localhost and all Replit domains
        const allowedPatterns = [
            /^http:\/\/localhost/,
            /^http:\/\/0\.0\.0\.0/,
            /\.repl\.co$/,
            /\.replit\.dev$/,
            /\.replit\.app$/
        ];
        if (allowedPatterns.some(pattern => pattern.test(origin))) {
            return callback(null, true);
        }
        return callback(null, true); // Allow all for now
    },
    credentials: true
}));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/optimize', optimizeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/optimization', optimizationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logError(err, req);
    res.status(500).json({ error: 'Something went wrong!' });
});


// Wait for database to initialize before starting server
dbPromise.then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV}`);
        console.log(`💾 Database: SQLite (sql.js) - Cross-platform compatible`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});
