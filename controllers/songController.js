const mongoose = require('mongoose');
const Song = require('../models/Song');
const { encodeCursor, decodeCursor } = require('../utils/cursor');

/**
 * GET /api/songs?cursor=<base64>&limit=<n>
 * Returns a paginated list of songs using cursor-based pagination.
 * The cursor is a Base64-encoded MongoDB _id used as a stable bookmark.
 */
const getSongsCursor = async (req, res) => {
    try {
        // 1. Parse and cap the limit (max 100 per request)
        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const encodedCursor = req.query.cursor;

        // 2. Decode the cursor if provided
        let cursor = null;
        if (encodedCursor) {
            cursor = decodeCursor(encodedCursor);

            // Validate that the decoded cursor is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid cursor format. Please use the nextCursor value from a previous response.',
                });
            }
        }

        // 3. Build the query: if a cursor exists, fetch only documents "before" it (_id < cursor)
        //    MongoDB sorts ObjectIds chronologically, so $lt on a descending sort gives us older records.
        const query = cursor ? { _id: { $lt: cursor } } : {};

        // 4. Fetch limit + 1 documents so we can detect whether more pages exist
        const songs = await Song.find(query)
            .sort({ _id: -1 })    // Newest first
            .limit(limit + 1)
            .lean();               // Returns plain JS objects (faster, no Mongoose overhead)

        // 5. Check if there are more pages beyond this one
        const hasMore = songs.length > limit;
        if (hasMore) {
            songs.pop(); // Remove the extra "probe" document — it was for detection only
        }

        // 6. Encode the _id of the last song in this page as the cursor for the next request
        const nextCursor =
            hasMore && songs.length > 0
                ? encodeCursor(songs[songs.length - 1]._id)
                : null;

        // 7. Send the response with data + pagination metadata
        res.status(200).json({
            success: true,
            data: songs,
            pagination: {
                nextCursor,   // Base64 cursor the client sends for the next page (null on last page)
                hasMore,      // Whether more songs exist beyond this page
                limit,        // How many songs were requested per page
                count: songs.length, // How many songs are in this response
            },
        });
    } catch (error) {
        console.error('Error in getSongsCursor:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching songs',
        });
    }
};

module.exports = { getSongsCursor };
