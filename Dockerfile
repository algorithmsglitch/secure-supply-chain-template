# Multi-stage build for security and efficiency

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with frozen lockfile for reproducibility
RUN npm ci --frozen-lockfile

# Copy source code
COPY src ./src

# Application stage
FROM node:18-alpine

# Set labels for SBOM and provenance tracking
LABEL org.opencontainers.image.source="https://github.com/algorithmsglitch/secure-supply-chain-template"
LABEL org.opencontainers.image.description="Secure demo application with supply chain attestation"
LABEL org.opencontainers.image.title="Secure App Demo"

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S app -u 1001

# Copy only necessary files from builder
COPY --from=builder --chown=app:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=app:nodejs /app/package*.json ./
COPY --from=builder --chown=app:nodejs /app/src ./src

# Switch to non-root user
USER app

# Expose port (non-privileged)
EXPOSE 3000

# Start application
CMD ["npm", "start"]