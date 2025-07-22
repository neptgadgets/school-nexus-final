#!/bin/bash

# SchoolNexus Production Deployment Script
# This script deploys the application to production

set -e

echo "🚀 Deploying SchoolNexus to Production..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if environment file exists
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production not found. Please create it before deploying."
    exit 1
fi

# Backup current deployment (if exists)
if [ -d "/var/www/schoolnexus" ]; then
    echo "💾 Creating backup of current deployment..."
    sudo cp -r /var/www/schoolnexus /var/www/schoolnexus-backup-$(date +%Y%m%d-%H%M%S)
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Install production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application for production..."
NODE_ENV=production npm run build

# Copy files to production directory
echo "📁 Copying files to production directory..."
sudo mkdir -p /var/www/schoolnexus
sudo cp -r . /var/www/schoolnexus/
sudo chown -R www-data:www-data /var/www/schoolnexus

# Restart services
echo "🔄 Restarting services..."
sudo pm2 restart schoolnexus || sudo pm2 start /var/www/schoolnexus/ecosystem.config.js
sudo systemctl reload nginx

# Run database migrations
echo "��️ Running database migrations..."
cd /var/www/schoolnexus
npm run db:migrate

# Health check
echo "🏥 Performing health check..."
sleep 5
if curl -f http://localhost:3000/api/health; then
    echo "✅ Deployment successful!"
    echo "🌐 Application is running at: https://your-domain.com"
else
    echo "❌ Health check failed. Please check the logs."
    exit 1
fi

echo "🎉 Production deployment complete!"
