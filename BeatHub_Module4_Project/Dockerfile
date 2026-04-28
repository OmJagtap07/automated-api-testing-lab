# ─── Stage 1: Builder ─────────────────────────────────────────────────────────
# Use a lightweight Node.js base image for building. Pinned to 18-alpine.
FROM node:18-alpine AS builder

# Set working directory inside the builder container
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install ONLY production dependencies
RUN npm install --only=production

# Copy the rest of the application source code
COPY src ./src

# ─── Stage 2: Runner ──────────────────────────────────────────────────────────
# Start a fresh, clean lightweight image for the final runtime container
FROM node:18-alpine AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create a non-root system group and user for security (principle of least privilege)
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Switch to the non-root user
USER appuser

# Set the working directory for the non-root user
WORKDIR /home/appuser/app

# Copy only the necessary files from the builder stage into this final image.
COPY --from=builder --chown=appuser:appgroup /app/package*.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/src ./src

# Expose port (default 5000)
EXPOSE 5000

# Command to start the application when the container runs
CMD ["npm", "start"]
