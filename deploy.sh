#!/bin/bash
set -e

PROJECT_DIR="/var/www/omar-admin-dashboard"
echo "🚀 Starting Frontend Deployment Process..."

# Move to directory
cd "$PROJECT_DIR" || exit 1

echo "📦 Pulling latest code from GitHub..."
git fetch origin main
git reset --hard origin/main

echo "🏗 Building and starting Docker container..."
docker compose down --remove-orphans
docker compose up -d --build

echo "🧹 Pruning old Docker images..."
docker image prune -f

echo "✅ Frontend deployment is complete and running!"
docker compose ps frontend
