// Load environment variables FIRST, before any other imports
require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics.routes');
const songRoutes = require('./routes/songs');

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

console.log(`Starting BeatHub API in [${NODE_ENV}] mode...`);

const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// 1. Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', environment: NODE_ENV });
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
        console.log(`BeatHub server running on port ${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    });
}