# 🚀 SchoolNexus Installation & Deployment Guide

Complete guide for setting up SchoolNexus in development and production environments.

## 📋 **Table of Contents**

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Local Development](#local-development)
6. [Production Deployment](#production-deployment)
7. [Docker Deployment](#docker-deployment)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## �� **Prerequisites**

### **System Requirements**

- **Node.js**: 18.17.0 or higher
- **npm**: 9.0.0 or higher (or yarn/pnpm)
- **PostgreSQL**: 14.0 or higher (for local database)
- **Git**: Latest version
- **Operating System**: Windows 10+, macOS 10.15+, or Linux

### **Required Accounts**

- **Supabase Account**: [supabase.com](https://supabase.com) (for database and authentication)
- **Vercel Account**: [vercel.com](https://vercel.com) (optional, for deployment)
- **GitHub Account**: [github.com](https://github.com) (for version control)

---

## 💻 **Development Setup**

### **Step 1: Clone the Repository**

```bash
# Clone the repository
git clone <your-repository-url>
cd schoolnexus

# Or if you're starting fresh
npx create-next-app@latest schoolnexus --typescript --tailwind --eslint --app
cd schoolnexus
```

### **Step 2: Install Dependencies**

```bash
# Install all dependencies
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

### **Step 3: Verify Installation**

```bash
# Check Node.js version
node --version
# Should output v18.17.0 or higher

# Check npm version
npm --version
# Should output 9.0.0 or higher

# List installed packages
npm list --depth=0
```

---

## 🗄️ **Database Setup**

### **Option 1: Supabase (Recommended)**

#### **1. Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: SchoolNexus
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
5. Wait for project creation (2-3 minutes)

#### **2. Get Database Credentials**

1. Go to **Settings** → **Database**
2. Copy the following information:
   - **Host**
   - **Database name**
   - **Port**
   - **User**
   - **Password**

#### **3. Get API Keys**

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL**
   - **anon public key**
   - **service_role secret key**

#### **4. Run Database Migrations**

```bash
# Navigate to your project directory
cd schoolnexus

# Run the initial schema migration
# Option 1: Using Supabase CLI (recommended)
npx supabase db push

# Option 2: Manual SQL execution
# Go to Supabase Dashboard → SQL Editor
# Copy and paste the content of database/migrations/001_initial_schema.sql
# Execute the query

# Option 3: Using psql (if you have PostgreSQL client)
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f database/migrations/001_initial_schema.sql
```

#### **5. Seed Demo Data (Optional)**

```bash
# Load demo data for testing
# Option 1: Using Supabase SQL Editor
# Copy and paste content of database/seeds/001_demo_data.sql

# Option 2: Using psql
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" -f database/seeds/001_demo_data.sql
```

### **Option 2: Local PostgreSQL**

#### **1. Install PostgreSQL**

**On macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**On Windows:**
- Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Follow the installation wizard

#### **2. Create Database**

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE schoolnexus;
CREATE USER schoolnexus_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE schoolnexus TO schoolnexus_user;
\q
```

#### **3. Run Migrations**

```bash
# Run schema migration
psql -U schoolnexus_user -d schoolnexus -f database/migrations/001_initial_schema.sql

# Run demo data (optional)
psql -U schoolnexus_user -d schoolnexus -f database/seeds/001_demo_data.sql
```

---

## ⚙️ **Environment Configuration**

### **Step 1: Create Environment Files**

```bash
# Create environment files
cp .env.example .env.local
cp .env.example .env.production
```

### **Step 2: Configure Development Environment**

Create `.env.local` file:

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME="SchoolNexus"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Database Configuration (if using local PostgreSQL)
DATABASE_URL="postgresql://schoolnexus_user:your_password@localhost:5432/schoolnexus"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Email Configuration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE="10485760" # 10MB in bytes
NEXT_PUBLIC_ALLOWED_FILE_TYPES="image/*,application/pdf,application/msword"

# Feature Flags
NEXT_PUBLIC_ENABLE_DEMO_MODE="true"
NEXT_PUBLIC_ENABLE_REGISTRATION="false"
NEXT_PUBLIC_ENABLE_MULTI_SCHOOL="true"

# Security
JWT_SECRET="your-jwt-secret-key"
ENCRYPTION_KEY="your-encryption-key"

# Analytics (optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Logging
LOG_LEVEL="debug"
```

### **Step 3: Configure Production Environment**

Create `.env.production` file:

```bash
# Application Configuration
NEXT_PUBLIC_APP_NAME="SchoolNexus"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Authentication
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-nextauth-secret"

# Email Configuration
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="noreply@your-domain.com"
SMTP_PASS="your-production-email-password"

# Security
JWT_SECRET="your-production-jwt-secret"
ENCRYPTION_KEY="your-production-encryption-key"

# Feature Flags
NEXT_PUBLIC_ENABLE_DEMO_MODE="false"
NEXT_PUBLIC_ENABLE_REGISTRATION="true"
NEXT_PUBLIC_ENABLE_MULTI_SCHOOL="true"

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Logging
LOG_LEVEL="error"
```

### **Step 4: Environment Variables Security**

```bash
# Add environment files to .gitignore
echo ".env.local" >> .gitignore
echo ".env.production" >> .gitignore
echo ".env*.local" >> .gitignore
```

---

## 🏃 **Local Development**

### **Step 1: Start Development Server**

```bash
# Start the development server
npm run dev

# Or with custom port
npm run dev -- -p 3001

# Or using yarn
yarn dev

# Or using pnpm
pnpm dev
```

### **Step 2: Verify Setup**

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the SchoolNexus landing page
3. Test login with demo credentials:
   - **Super Admin**: `superadmin@schoolnexus.com` / `demo123`
   - **School Admin**: `admin@schoolnexus.com` / `demo123`
   - **Teacher**: `teacher@schoolnexus.com` / `demo123`
   - **Student**: `student@schoolnexus.com` / `demo123`
   - **Parent**: `parent@schoolnexus.com` / `demo123`

### **Step 3: Development Commands**

```bash
# Build the application
npm run build

# Start production server locally
npm run start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run type checking
npm run type-check

# Generate database types (if using Supabase)
npm run generate-types
```

### **Step 4: Database Management**

```bash
# Reset database (caution: deletes all data)
npm run db:reset

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed

# Generate migration
npm run db:generate-migration

# Database backup
npm run db:backup
```

---

## 🌐 **Production Deployment**

### **Option 1: Vercel Deployment (Recommended)**

#### **1. Prepare for Deployment**

```bash
# Build and test locally
npm run build
npm run start

# Test production build
NODE_ENV=production npm run build
```

#### **2. Deploy to Vercel**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name: schoolnexus
# - Directory: ./
# - Override settings? No
```

#### **3. Configure Environment Variables**

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all production environment variables
5. Redeploy: `vercel --prod`

#### **4. Custom Domain (Optional)**

1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS records as shown
4. Wait for SSL certificate generation

### **Option 2: Traditional Server Deployment**

#### **1. Server Requirements**

- **CPU**: 2+ cores
- **RAM**: 4GB+ recommended
- **Storage**: 20GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Node.js**: 18.17.0+
- **PM2**: Process manager
- **Nginx**: Reverse proxy
- **SSL Certificate**: Let's Encrypt

#### **2. Server Setup**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx
```

#### **3. Deploy Application**

```bash
# Clone repository on server
git clone <your-repo-url> /var/www/schoolnexus
cd /var/www/schoolnexus

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [{
    name: 'schoolnexus',
    script: './node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/schoolnexus',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOL

# Create logs directory
mkdir -p logs

# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### **4. Configure Nginx**

```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/schoolnexus << 'EOL'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

# Enable site
sudo ln -s /etc/nginx/sites-available/schoolnexus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### **5. Setup SSL Certificate**

```bash
# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

### **Option 3: DigitalOcean App Platform**

#### **1. Prepare Application**

```bash
# Create app.yaml
cat > .do/app.yaml << 'EOL'
name: schoolnexus
services:
- name: web
  source_dir: /
  github:
    repo: your-username/schoolnexus
    branch: main
  run_command: npm start
  build_command: npm run build
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: NEXT_PUBLIC_APP_URL
    value: ${APP_URL}
EOL
```

#### **2. Deploy**

1. Go to DigitalOcean Dashboard
2. Click "Create" → "Apps"
3. Connect GitHub repository
4. Configure build settings
5. Add environment variables
6. Deploy

---

## 🐳 **Docker Deployment**

### **Step 1: Create Dockerfile**

```bash
cat > Dockerfile << 'EOL'
# Use the official Node.js 18 image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
EOL
```

### **Step 2: Create Docker Compose**

```bash
cat > docker-compose.yml << 'EOL'
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    env_file:
      - .env.production
    restart: unless-stopped
    networks:
      - schoolnexus-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - schoolnexus-network

networks:
  schoolnexus-network:
    driver: bridge
EOL
```

### **Step 3: Create Nginx Configuration**

```bash
cat > nginx.conf << 'EOL'
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
EOL
```

### **Step 4: Deploy with Docker**

```bash
# Build and start containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Update application
git pull
docker-compose up -d --build
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Database Connection Issues**

```bash
# Check database connection
npm run db:test

# Common solutions:
# - Verify environment variables
# - Check database server status
# - Verify network connectivity
# - Check firewall settings
```

#### **2. Build Errors**

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Check for TypeScript errors
npm run type-check
```

#### **3. Authentication Issues**

```bash
# Verify Supabase configuration
# Check API keys in environment variables
# Verify RLS policies in Supabase dashboard
```

#### **4. Performance Issues**

```bash
# Analyze bundle size
npm run analyze

# Check for memory leaks
npm run build && npm run start
# Monitor with htop or Activity Monitor
```

### **Debugging Commands**

```bash
# Enable debug mode
DEBUG=* npm run dev

# Check application health
curl http://localhost:3000/api/health

# Monitor logs
tail -f logs/combined.log

# Database queries
npm run db:query "SELECT * FROM schools LIMIT 1;"
```

---

## �� **Maintenance**

### **Regular Tasks**

#### **Daily**
- Monitor application logs
- Check system resources
- Verify backup completion

#### **Weekly**
- Update dependencies
- Review security alerts
- Performance monitoring

#### **Monthly**
- Database maintenance
- Security updates
- Backup verification

### **Update Procedures**

#### **1. Dependency Updates**

```bash
# Check for outdated packages
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest

# Security audit
npm audit
npm audit fix
```

#### **2. Application Updates**

```bash
# Development environment
git pull origin main
npm install
npm run build
npm run dev

# Production environment
git pull origin main
npm ci --only=production
npm run build
pm2 restart schoolnexus
```

#### **3. Database Maintenance**

```bash
# Backup database
npm run db:backup

# Run maintenance scripts
npm run db:maintenance

# Update statistics
npm run db:analyze
```

### **Backup Procedures**

#### **1. Database Backup**

```bash
# Create backup script
cat > scripts/backup.sh << 'EOL'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="schoolnexus"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
EOL

chmod +x scripts/backup.sh
```

#### **2. File Backup**

```bash
# Backup application files
tar -czf backup_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=logs \
  .
```

#### **3. Automated Backups**

```bash
# Add to crontab
crontab -e

# Add these lines:
# Daily database backup at 2 AM
0 2 * * * /path/to/scripts/backup.sh

# Weekly file backup at 3 AM on Sundays
0 3 * * 0 /path/to/scripts/file-backup.sh
```

---

## 📞 **Support**

### **Getting Help**

- **Documentation**: Check this guide first
- **Issues**: Create GitHub issue with detailed description
- **Community**: Join our Discord/Slack community
- **Email**: support@schoolnexus.com

### **Reporting Bugs**

When reporting bugs, include:
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node.js version, browser)
- Error messages and logs
- Screenshots if applicable

### **Feature Requests**

- Check existing issues first
- Provide detailed use case
- Explain business value
- Include mockups if helpful

---

**🎉 Congratulations! Your SchoolNexus application is now ready for development and production deployment.**

For additional help, refer to the [Next.js Documentation](https://nextjs.org/docs) and [Supabase Documentation](https://supabase.com/docs).
