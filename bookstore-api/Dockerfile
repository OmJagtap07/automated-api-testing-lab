# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
# Use a lightweight Node.js base image for building
FROM node:18-alpine AS builder

# Set working directory inside the builder container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
# If package.json hasn't changed, Docker reuses the cached 'npm install' layer
COPY package*.json ./

# Install ONLY production dependencies (excludes devDependencies like nodemon)
RUN npm install --only=production

# Copy the rest of the application source code
COPY . .

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
# Start a fresh, clean lightweight image for the final runtime container
FROM node:18-alpine AS runner

# Create a non-root system group and user for security (principle of least privilege)
# Running as root inside a container is a security risk
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Switch to the non-root user — all subsequent commands run as appuser
USER appuser

# Set the working directory for the non-root user
WORKDIR /home/appuser/app

# Copy only the necessary files from the builder stage into this final image.
# The --chown flag ensures appuser owns the files (prevents permission errors).
# We do NOT copy devDependencies or build tools — keeping the image small & secure.
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/models ./models
COPY --from=builder --chown=appuser:appgroup /app/routes ./routes
COPY --from=builder --chown=appuser:appgroup /app/server.js ./server.js

# Inform Docker that the container listens on port 3000 at runtime
EXPOSE 3000

# Command to start the application when the container runs
CMD ["node", "server.js"]
