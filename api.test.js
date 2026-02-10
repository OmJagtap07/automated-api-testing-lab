const request = require('supertest');
// Import your backend app. Adjust the path if your main file is named 'index.js' or 'server.js'
// If you are using the Mock Server provided below, change this line to: const app = require('./server');
const app = require('./server');
const path = require('path');

describe('Automated API Testing Lab', () => {

    // --- Test 1: Health Check ---
    it('GET /health should return 200 and status "UP"', async () => {
        const res = await request(app).get('/health');
        
        // Assert status code is 200
        expect(res.statusCode).toBe(200);
        
        // Assert response body contains status: "UP"
        expect(res.body).toEqual(expect.objectContaining({
            status: "UP"
        }));
    });

    // --- Test 2: File Upload ---
    it('POST /api/user/upload should upload profilePic and return 201', async () => {
        // We need a dummy image to upload. 
        // Ensure you have a file named 'test-image.jpg' in the same folder as this test file.
        const filePath = path.join(__dirname, 'test-image.jpg');

        const res = await request(app)
            .post('/api/user/upload')
            // Requirement: Field name must be "profilePic"
            .attach('profilePic', filePath);

        // Assert status code is 201 (Created)
        expect(res.statusCode).toBe(201);
    });
});