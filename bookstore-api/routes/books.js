const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// ─── POST /api/books ──────────────────────────────────────────────────────────
// Create a new book record in the inventory
router.post('/', async (req, res) => {
    try {
        const { title, author, isbn, price, quantity } = req.body;

        // ── Custom Validation ──────────────────────────────────────────────────

        // Validate title
        if (!title || title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                field: 'title',
                message: 'Title is required.',
            });
        }
        if (title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                field: 'title',
                message: 'Title must be at least 3 characters long.',
            });
        }
        if (title.trim().length > 200) {
            return res.status(400).json({
                success: false,
                field: 'title',
                message: 'Title cannot exceed 200 characters.',
            });
        }

        // Validate author
        if (!author || author.trim().length === 0) {
            return res.status(400).json({
                success: false,
                field: 'author',
                message: 'Author is required.',
            });
        }

        // Validate isbn
        if (!isbn || isbn.trim().length === 0) {
            return res.status(400).json({
                success: false,
                field: 'isbn',
                message: 'ISBN is required.',
            });
        }

        // Validate price
        if (price === undefined || price === null || price === '') {
            return res.status(400).json({
                success: false,
                field: 'price',
                message: 'Price is required.',
            });
        }
        if (typeof price !== 'number' || isNaN(price)) {
            return res.status(400).json({
                success: false,
                field: 'price',
                message: 'Price must be a valid number.',
            });
        }
        if (price < 0) {
            return res.status(400).json({
                success: false,
                field: 'price',
                message: 'Price cannot be negative.',
            });
        }

        // Validate quantity (optional, but must be non-negative if provided)
        if (quantity !== undefined && quantity !== null && quantity !== '') {
            if (typeof quantity !== 'number' || isNaN(quantity)) {
                return res.status(400).json({
                    success: false,
                    field: 'quantity',
                    message: 'Quantity must be a valid number.',
                });
            }
            if (quantity < 0) {
                return res.status(400).json({
                    success: false,
                    field: 'quantity',
                    message: 'Quantity cannot be negative.',
                });
            }
        }

        // ── Create & Save Book ─────────────────────────────────────────────────
        const book = new Book({
            title: title.trim(),
            author: author.trim(),
            isbn: isbn.trim(),
            price,
            quantity: quantity !== undefined ? quantity : 0,
        });

        const savedBook = await book.save();

        return res.status(201).json({
            success: true,
            message: 'Book created successfully.',
            data: savedBook,
        });
    } catch (error) {
        // ── Duplicate ISBN (MongoDB unique index violation) ─────────────────────
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                field: 'isbn',
                message: 'A book with this ISBN already exists.',
            });
        }

        // ── Mongoose Validation Errors ─────────────────────────────────────────
        if (error.name === 'ValidationError') {
            const first = Object.values(error.errors)[0];
            return res.status(400).json({
                success: false,
                field: first.path,
                message: first.message,
            });
        }

        // ── Unexpected Server Error ────────────────────────────────────────────
        console.error('Unexpected error in POST /api/books:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
        });
    }
});

module.exports = router;
