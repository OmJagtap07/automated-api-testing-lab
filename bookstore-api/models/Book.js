const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters long'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
        isbn: {
            type: String,
            required: [true, 'ISBN is required'],
            unique: true,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        quantity: {
            type: Number,
            default: 0,
            min: [0, 'Quantity cannot be negative'],
        },
    },
    { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
