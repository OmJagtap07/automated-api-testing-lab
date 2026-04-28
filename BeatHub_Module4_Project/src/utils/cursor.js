/**
 * Encodes a MongoDB ObjectId to a Base64 string for use as a pagination cursor.
 * @param {*} value - The ObjectId or string to encode
 * @returns {string} Base64-encoded cursor string
 */
function encodeCursor(value) {
    return Buffer.from(value.toString()).toString('base64');
}

/**
 * Decodes a Base64 pagination cursor back to its original string value.
 * @param {string} cursor - The Base64-encoded cursor string
 * @returns {string} The decoded ObjectId string
 */
function decodeCursor(cursor) {
    return Buffer.from(cursor, 'base64').toString('utf-8');
}

module.exports = { encodeCursor, decodeCursor };
