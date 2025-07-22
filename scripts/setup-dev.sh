#!/bin/bash

# SchoolNexus Development Setup Script
# This script sets up the development environment

set -e

echo "🚀 Setting up SchoolNexus Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.17.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.17.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install version $REQUIRED_VERSION or higher."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION is compatible"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env.local
    echo "�� Please update .env.local with your configuration"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p backups

# Set permissions
chmod +x scripts/*.sh

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your Supabase credentials"
echo "2. Run database migrations: npm run db:migrate"
echo "3. Seed demo data (optional): npm run db:seed"
echo "4. Start development server: npm run dev"
echo ""
echo "🌐 Your application will be available at: http://localhost:3000"
