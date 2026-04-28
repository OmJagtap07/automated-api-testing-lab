// src/controllers/analytics.controller.js
const Enrollment = require('../models/enrollment.model'); // Ensure this path matches your project structure

const getTopStudents = async (req, res, next) => {
    try {
        const topStudents = await Enrollment.aggregate([
            // Stage 1: (Optional) Match only active enrollments if you have a status field
            // If you don't have a status field yet, you can comment this out.
            {
                $match: {
                    status: "active"
                }
            },
            // Stage 2: Group by studentId and count them
            {
                $group: {
                    _id: "$studentId",
                    enrollmentCount: { $sum: 1 }
                }
            },
            // Stage 3: Sort by enrollmentCount in descending order (High to Low)
            {
                $sort: {
                    enrollmentCount: -1
                }
            },
            // Stage 4: Limit to top 5 results
            {
                $limit: 5
            },
            // Stage 5: Project to rename _id to studentId and clean up output
            {
                $project: {
                    _id: 0,
                    studentId: "$_id",     // List this FIRST
                    enrollmentCount: 1     // List this SECOND
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: topStudents
        });

    } catch (error) {
        next(error);
    }
};

module.exports = { getTopStudents };