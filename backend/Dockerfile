# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
# Install only production dependencies
RUN npm ci --only=production
COPY . .
# Remove test directory and dev tools to keep image clean and secure
RUN rm -rf tests

ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "server.js"]
