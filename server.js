const express = require('express');
const app = express();

// 1. Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: "UP" });
});

// 2. Upload Route (Fixed to prevent ECONNRESET)
app.post('/api/user/upload', (req, res) => {
    // We must "listen" to the incoming data stream, otherwise the 
    // connection closes while the test is still sending the file.
    req.on('data', (chunk) => { 
        // We just let the data flow in and ignore it
    });

    // Once the upload is finished ('end'), WE send the response
    req.on('end', () => {
        res.status(201).send({ message: "File uploaded successfully" });
    });
});

// Export the app for testing
module.exports = app;

// Only start the server if this file is run directly (not by Jest)
if (require.main === module) {
    app.listen(3000, () => console.log('Server running on port 3000'));
}