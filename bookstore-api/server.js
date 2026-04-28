// Load environment variables FIRST, before any other imports
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/books');

const PORT = process.env.PORT || 3000;

// 'DB_HOST' is injected by Docker Compose (uses Docker internal DNS: service name 'db').
// 'MONGO_URI' is the fallback for local development without Compose (e.g., Atlas or local mongo).
const MONGO_URI = process.env.DB_HOST || process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('FATAL ERROR: No database URI set. Define DB_HOST (Docker Compose) or MONGO_URI (.env).');
    process.exit(1);
}

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());

// ── Database Connection ───────────────────────────────────────────────────────
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to MongoDB at: ${MONGO_URI}`);
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/books', bookRoutes);

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
