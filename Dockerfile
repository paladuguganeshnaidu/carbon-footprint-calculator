# Stage 1: Build packages
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy lockfiles and workspace package configurations
COPY package*.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

# Install all dependencies (including devDependencies for compiling)
RUN npm ci

# Copy codebase
COPY . .

# Run compilation builds
RUN npm run build

# Remove development dependencies to shrink runner footprint
RUN npm prune --production


# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000

# Create persistent data directory for SQLite
RUN mkdir -p /usr/src/app/data && chown -R node:node /usr/src/app

# Copy configurations
COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/shared ./shared
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/client ./client

# Expose port
EXPOSE 3000

# Switch to standard non-root node user for container hardening
USER node

# Run application server
CMD ["node", "server/dist/app.js"]
