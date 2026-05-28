const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");

describe("Auth Routes", () => {
  let testUserEmail = `test${Date.now()}@test.com`;
  const testUserPassword = "password123";

  afterAll(async () => {
    // Close mongoose connection after tests
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: testUserEmail,
      password: testUserPassword,
      role: "listener",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: testUserPassword,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUserEmail,
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401); // Or 400 depending on implementation
  });
});

describe("RBAC — Song Routes", () => {
  it("should block listener from uploading a song", async () => {
    // 1. Register listener
    const listenerEmail = `listener${Date.now()}@test.com`;
    const password = "password123";
    
    await request(app).post("/api/auth/register").send({
      name: "Listener User",
      email: listenerEmail,
      password: password,
      role: "listener",
    });

    // 2. Login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: listenerEmail,
      password: password,
    });
    const token = loginRes.body.token;

    // 3. Try uploading a song
    const res = await request(app)
      .post("/api/songs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Song",
        artist: "Test Artist",
      });
      
    // 403 Forbidden is expected when a user has a valid token but lacks the correct role
    if (res.statusCode !== 403) {
      // console.log('Login Response:', loginRes.body);
      // console.log('Upload Response:', res.body);
    }
    expect(res.statusCode).toBe(403); 
  });
});
