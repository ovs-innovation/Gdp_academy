# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build-time API URL (override via --build-arg in CI / docker compose)
ARG VITE_API_URL=https://api.garimadanceproductions.com/api
ENV VITE_API_URL=$VITE_API_URL

# Build the Vite application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
