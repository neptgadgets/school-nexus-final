#!/bin/bash

# SchoolNexus Database Backup Script
# This script creates a backup of the database

set -e

# Configuration
BACKUP_DIR="backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="schoolnexus_backup_$DATE"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "📦 Creating database backup: $BACKUP_NAME"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    # Load environment variables
    if [ -f ".env.local" ]; then
        source .env.local
    elif [ -f ".env.production" ]; then
        source .env.production
    else
        echo "❌ Error: No environment file found with DATABASE_URL"
        exit 1
    fi
fi

# Create database backup
if [ ! -z "$DATABASE_URL" ]; then
    echo "🗄️ Backing up database..."
    pg_dump "$DATABASE_URL" > "$BACKUP_DIR/$BACKUP_NAME.sql"
    
    # Compress backup
    echo "🗜️ Compressing backup..."
    gzip "$BACKUP_DIR/$BACKUP_NAME.sql"
    
    echo "✅ Database backup created: $BACKUP_DIR/$BACKUP_NAME.sql.gz"
    
    # Remove old backups (keep last 30 days)
    echo "🧹 Cleaning up old backups..."
    find $BACKUP_DIR -name "schoolnexus_backup_*.sql.gz" -mtime +30 -delete
    
    echo "📊 Backup statistics:"
    ls -lh $BACKUP_DIR/$BACKUP_NAME.sql.gz
else
    echo "❌ Error: DATABASE_URL not found in environment variables"
    exit 1
fi

echo "🎉 Backup completed successfully!"
