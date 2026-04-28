// Step 1: Load environment variables FIRST (must be line 1 of app code)
require('dotenv').config();

const express = require('express');

const app = express();

// Step 2: Read PORT from environment variable (set in .env file)
const PORT = process.env.PORT || 5000;

// Step 3: Basic route to confirm server is alive
app.get('/', (req, res) => {
    res.send('BeatHub API is running!');
});

// Step 4: Start the server on the port defined in .env
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});