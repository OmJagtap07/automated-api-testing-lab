// Load environment variables FIRST, before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics.routes');
const songRoutes = require('./routes/songs');
const logger = require('./utils/logger');
const correlationIdMiddleware = require('./middlewares/correlationId');
const { register, httpRequestCounter, httpRequestDurationMicroseconds } = require('./utils/metrics');
const rateLimit = require('express-rate-limit');
// ─── Critical Environment Variable Checks ────────────────────────────────────
// The application cannot run securely without these; exit immediately if missing.
if (!process.env.MONGODB_URI) {
    console.error('FATAL ERROR: MONGODB_URI is not defined. Set it in your .env file.');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined. Set it in your .env file.');
    process.exit(1);
}

// ─── Non-Critical Variables (with safe fallbacks) ────────────────────────────
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

logger.info(`Starting BeatHub API in [${NODE_ENV}] mode...`);

const app = express();

// Use the correlation ID middleware first
app.use(correlationIdMiddleware);

// Middleware to collect HTTP request metrics
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        const labels = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
        };
        httpRequestCounter.inc(labels);
        end(labels);
    });
    next();
});

// Set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests starting with /api/
app.use('/api/', limiter);

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// 1. Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', environment: NODE_ENV });
});

// Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (ex) {
        if (req.logger) req.logger.error('Error exposing metrics', { error: ex.message });
        res.status(500).end(ex);
    }
});

// 2. Upload Route (Fixed to prevent ECONNRESET)
app.post('/api/user/upload', (req, res) => {
    req.on('data', (chunk) => { });
    req.on('end', () => {
        res.status(201).send({ message: 'File uploaded successfully' });
    });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', songRoutes);

// Export the app for testing
module.exports = app;

// Only start the server if this file is run directly (not by Jest)
if (require.main === module) {
    app.listen(PORT, () => {
        logger.info(`BeatHub server running on port ${PORT}`);
        logger.info(`Environment: ${NODE_ENV}`);
    });
}
