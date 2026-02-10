const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        enum: ['Pop', 'Rock', 'HipHop', 'Jazz', 'Electronic']
    },
    bio: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);