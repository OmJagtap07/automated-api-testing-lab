const express = require('express');
const router = express.Router();

const { getSongsCursor, createSong, deleteSong } = require('../controllers/songController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// GET /api/songs          → First page (no cursor)
// GET /api/songs?cursor=X → Subsequent pages (cursor from previous response)
// GET /api/songs?limit=20 → Control page size (default: 10, max: 100)
router.get('/songs', getSongsCursor);

// Add RBAC protected endpoints
router.post('/songs', authenticate, authorize('artist', 'admin'), createSong);
router.delete('/songs/:id', authenticate, authorize('admin'), deleteSong);

module.exports = router;
