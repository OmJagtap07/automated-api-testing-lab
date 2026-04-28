// src/models/enrollment.model.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId, // Links to a Student/User
        required: true,
        ref: 'User' // Assuming you have a User model, otherwise just keep it as ObjectId
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId, // Links to a Course
        required: true,
        ref: 'Course'
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    }
});

// This creates the 'enrollments' collection in MongoDB
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

module.exports = Enrollment;