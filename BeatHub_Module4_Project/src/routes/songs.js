const express = require('express');
const router = express.Router();

const { getSongsCursor } = require('../controllers/songController');

// GET /api/songs          → First page (no cursor)
// GET /api/songs?cursor=X → Subsequent pages (cursor from previous response)
// GET /api/songs?limit=20 → Control page size (default: 10, max: 100)
router.get('/songs', getSongsCursor);

module.exports = router;
