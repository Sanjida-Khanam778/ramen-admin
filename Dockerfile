# ============================================
# Stage 1: Build the React app
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files first (Docker layer caching)
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source code and build
COPY . .
RUN npm run build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
