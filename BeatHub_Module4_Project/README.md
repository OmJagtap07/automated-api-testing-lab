# BeatHub Module 4 Project

BeatHub is a robust backend API platform designed for seamless audio management. This repository contains the complete Module 4 final submission, demonstrating a production-ready Express.js architecture.

## Deployed Service
**Deployed URL:** `https://yourname-beathub-api.onrender.com`

## Test Credentials
- **Admin Email:** `admin@beathub.com`
- **Admin Password:** `admin123`
- **User Email:** `user@beathub.com`
- **User Password:** `user123`

## Features Implemented
- **JWT Authentication:** Secure, stateless user authentication with tokens.
- **Role-Based Access Control (RBAC):** Middleware ensuring routes are protected based on user roles (Admin vs User).
- **Pagination:** Cursor-based pagination on list routes to handle large datasets gracefully.
- **Rate Limiting:** IP-based request limiting to prevent spam and abuse.
- **Observability:** 
  - Structured JSON logging using `winston`.
  - Request tracing via custom `Correlation ID` middleware.
  - Prometheus metrics instrumentation via `prom-client` at `/metrics`.
- **Infrastructure Integrations:**
  - Secure connection to a Production MongoDB Atlas Cluster.
  - Production-ready multi-stage `Dockerfile` with a non-root user.
  - Cleaned repository devoid of sensitive credentials or hardcoded secrets.

## Local Setup Instructions (Docker)

1. **Clone the repository and configure environment variables:**
   Copy `.env.example` to a new `.env` file and fill in your actual credentials (DO NOT commit this file).
   ```bash
   cp .env.example .env
   ```

2. **Build the Docker Image:**
   ```bash
   docker build -t beathub-api .
   ```

3. **Run the Docker Container:**
   ```bash
   docker run -p 5000:5000 --env-file .env beathub-api
   ```

4. **Test the Application:**
   Navigate to `http://localhost:5000/health` or `http://localhost:5000/metrics`.
