# 🚀 SchoolNexus Deployment Guide

Quick deployment guide for SchoolNexus in various environments.

## 📋 **Quick Start**

### **Development Setup (5 minutes)**

```bash
# 1. Clone and setup
git clone <your-repo-url>
cd schoolnexus
npm run setup:dev

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Setup database
npm run db:migrate
npm run db:seed  # Optional: adds demo data

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` and login with demo credentials:
- **Super Admin**: `superadmin@schoolnexus.com` / `demo123`
- **School Admin**: `admin@schoolnexus.com` / `demo123`
- **Teacher**: `teacher@schoolnexus.com` / `demo123`
- **Student**: `student@schoolnexus.com` / `demo123`
- **Parent**: `parent@schoolnexus.com` / `demo123`

---

## 🌐 **Production Deployment Options**

### **Option 1: Vercel (Recommended - Easiest)**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard
# 4. Redeploy with production settings
vercel --prod
```

**Pros**: Zero configuration, automatic SSL, global CDN, serverless
**Cons**: Vendor lock-in, cold starts

### **Option 2: Docker (Most Flexible)**

```bash
# 1. Build and run with Docker Compose
cp .env.example .env.production
# Edit .env.production with production values

docker-compose up -d

# 2. Check health
curl http://localhost/api/health
```

**Pros**: Portable, consistent environments, easy scaling
**Cons**: Requires Docker knowledge, more setup

### **Option 3: Traditional Server (Most Control)**

```bash
# 1. Server setup (Ubuntu/CentOS)
bash scripts/setup-server.sh

# 2. Deploy application
bash scripts/deploy-production.sh

# 3. Configure domain and SSL
# Follow server-specific instructions
```

**Pros**: Full control, cost-effective, customizable
**Cons**: More maintenance, security responsibility

---

## 🗄️ **Database Setup**

### **Supabase (Recommended)**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy credentials to `.env.production`
4. Run migrations:
   ```bash
   npm run db:migrate
   npm run db:seed  # Optional
   ```

### **Self-hosted PostgreSQL**

```bash
# Install PostgreSQL
sudo apt install postgresql

# Create database
sudo -u postgres createdb schoolnexus

# Run migrations
DATABASE_URL="postgresql://user:pass@localhost/schoolnexus" npm run db:migrate
```

---

## ⚙️ **Environment Variables**

### **Required Variables**

```bash
# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Authentication
NEXTAUTH_SECRET="your-secure-random-string"
JWT_SECRET="another-secure-random-string"
```

### **Optional Variables**

```bash
# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"

# Feature flags
NEXT_PUBLIC_ENABLE_DEMO_MODE="false"
NEXT_PUBLIC_ENABLE_REGISTRATION="true"
```

---

## 🔧 **Common Commands**

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed demo data
npm run db:backup       # Backup database
npm run db:reset        # Reset database (CAUTION!)

# Deployment
npm run deploy          # Deploy to production
npm run health          # Check application health

# Docker
npm run docker:build    # Build Docker image
npm run docker:run      # Run Docker container
docker-compose up -d    # Start all services
```

---

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   ```bash
   npm run db:test  # Test connection
   # Check environment variables
   # Verify database server status
   ```

2. **Build Errors**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

3. **Health Check Failing**
   ```bash
   npm run health
   # Check logs: docker-compose logs -f
   # Verify environment variables
   ```

### **Logs and Monitoring**

```bash
# Application logs
tail -f logs/combined.log

# Docker logs
docker-compose logs -f app

# Health check
curl http://your-domain.com/api/health
```

---

## 📊 **Performance & Scaling**

### **Performance Tips**

- Enable gzip compression (included in Nginx config)
- Use CDN for static assets
- Implement Redis caching (optional Docker service)
- Optimize database queries
- Monitor with health checks

### **Scaling Options**

1. **Horizontal Scaling**: Multiple app instances behind load balancer
2. **Database Scaling**: Read replicas, connection pooling
3. **CDN**: Static asset distribution
4. **Caching**: Redis for session storage and caching

---

## 🔐 **Security Checklist**

- [ ] HTTPS enabled with valid SSL certificate
- [ ] Environment variables secured (not in version control)
- [ ] Database access restricted (firewall rules)
- [ ] Regular security updates
- [ ] Strong passwords and JWT secrets
- [ ] Rate limiting configured (included in Nginx config)
- [ ] Security headers enabled (included in Nginx config)

---

## 📞 **Support**

- **Documentation**: [Full Installation Guide](INSTALLATION_GUIDE.md)
- **Health Check**: `GET /api/health`
- **Issues**: Create GitHub issue
- **Email**: support@schoolnexus.com

---

## 🎯 **Deployment Checklist**

### **Pre-deployment**
- [ ] Code tested locally
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificate obtained
- [ ] Domain DNS configured

### **Post-deployment**
- [ ] Health check passing
- [ ] Database seeded (if needed)
- [ ] SSL certificate working
- [ ] All user types can login
- [ ] Email notifications working (if configured)
- [ ] Backups scheduled
- [ ] Monitoring configured

---

**🎉 Your SchoolNexus application is ready for production!**

For detailed instructions, see the [Complete Installation Guide](INSTALLATION_GUIDE.md).
