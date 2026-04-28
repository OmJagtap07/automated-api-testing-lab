// routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// Route 1: GET /api/analytics/top-artists — Admin only
router.get(
    '/top-artists',
    authenticate,
    authorize('admin'),
    analyticsController.getTopStudents
);

// Route 2: GET /api/analytics/most-active-users — Admin only
router.get(
    '/most-active-users',
    authenticate,
    authorize('admin'),
    analyticsController.getTopStudents
);

module.exports = router;
