const mongoose = require('mongoose');

// We need an async function to use await
const connectDB = async () => {
    // Use a try...catch block to handle connection errors
    try {
        // 1. Get the connection string from environment variables
        const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

        // 2. Call mongoose.connect() and await the result
        const conn = await mongoose.connect(mongoURI);

        // 3. If the connection is successful, log a confirmation message
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        // 4. If an error occurs, log the error and exit the process
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

// Export the function so it can be used by our main server file
module.exports = connectDB;