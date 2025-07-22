# 🚀 Production Deployment Guide - SchoolNexus

## 📋 Overview
This guide covers deploying SchoolNexus to production with real database connectivity, authentication, and security best practices.

## 🏗️ Deployment Options

### Option 1: Vercel (Recommended)
- ✅ Automatic deployments from GitHub
- ✅ Built-in Next.js optimization
- ✅ Global CDN
- ✅ Free tier available

### Option 2: Netlify
- ✅ Static site deployment
- ✅ Form handling
- ✅ Edge functions support

### Option 3: Railway
- ✅ Simple deployment
- ✅ Database hosting
- ✅ Custom domains

### Option 4: Self-hosted (VPS/Cloud)
- ✅ Full control
- ✅ Custom configurations
- ✅ Cost-effective for scale

## 🚀 Vercel Deployment (Step-by-Step)

### Step 1: Prepare Repository
```bash
# Ensure your code is in a Git repository
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel
1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Your app will be live at `https://your-project.vercel.app`

### Step 3: Configure Custom Domain (Optional)
1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **Update Environment Variables**
   ```
   NEXTAUTH_URL=https://yourdomain.com
   ```

## 🗄️ Production Database Setup

### Step 1: Supabase Production Project
1. **Create Production Project**
   - Separate from development
   - Choose production-appropriate region
   - Enable Point-in-Time Recovery (Pro plan)

2. **Configure Security**
   ```sql
   -- Enable additional security
   ALTER DATABASE postgres SET log_statement = 'all';
   ALTER DATABASE postgres SET log_min_duration_statement = 1000;
   ```

3. **Set Up Monitoring**
   - Enable database metrics
   - Set up alerts for high CPU/memory usage
   - Configure backup retention

### Step 2: Environment Configuration
```bash
# Production environment variables
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
NEXTAUTH_SECRET=strong-production-secret-min-32-chars
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

## 🔐 Security Hardening

### Step 1: Supabase Security
1. **Row Level Security**
   ```sql
   -- Verify all tables have RLS enabled
   SELECT schemaname, tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

2. **API Rate Limiting**
   - Configure in Supabase dashboard
   - Set appropriate limits for your usage

3. **Database Connections**
   - Use connection pooling
   - Set max connections limit

### Step 2: Application Security
1. **Content Security Policy**
   ```javascript
   // next.config.js
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/(.*)',
           headers: [
             {
               key: 'Content-Security-Policy',
               value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co;"
             },
             {
               key: 'X-Frame-Options',
               value: 'DENY'
             },
             {
               key: 'X-Content-Type-Options',
               value: 'nosniff'
             }
           ]
         }
       ]
     }
   }
   ```

2. **Environment Variables**
   - Never commit .env files
   - Use strong secrets (32+ characters)
   - Rotate keys regularly

## 📊 Performance Optimization

### Step 1: Next.js Optimizations
```javascript
// next.config.js
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  
  // PWA configuration (if using next-pwa)
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development'
  }
}
```

### Step 2: Database Optimizations
```sql
-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_administrators_user_id ON administrators(user_id);
CREATE INDEX IF NOT EXISTS idx_administrators_school_id ON administrators(school_id);

-- Enable query plan caching
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
```

## 📈 Monitoring & Analytics

### Step 1: Application Monitoring
1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Track page views, performance

2. **Error Tracking**
   ```bash
   npm install @sentry/nextjs
   ```
   
   ```javascript
   // sentry.client.config.js
   import * as Sentry from "@sentry/nextjs";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     tracesSampleRate: 1.0,
   });
   ```

### Step 2: Database Monitoring
- Enable Supabase metrics dashboard
- Set up alerts for:
  - High connection count
  - Slow queries
  - High CPU usage
  - Storage usage

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📧 Email Configuration

### Step 1: SMTP Setup
```javascript
// Configure in Supabase Auth settings
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 587,
    "user": "your-email@gmail.com",
    "pass": "app-password",
    "admin_email": "admin@yourschool.com",
    "sender_name": "SchoolNexus"
  }
}
```

### Step 2: Email Templates
- Customize welcome emails
- Password reset templates
- Notification templates

## 🔧 Maintenance & Updates

### Regular Tasks
1. **Weekly**
   - Check error logs
   - Monitor performance metrics
   - Review security alerts

2. **Monthly**
   - Update dependencies
   - Review database performance
   - Check backup integrity

3. **Quarterly**
   - Security audit
   - Performance optimization review
   - User feedback integration

### Update Process
```bash
# Update dependencies
npm update
npm audit fix

# Test updates
npm run test
npm run build

# Deploy updates
git add .
git commit -m "Update dependencies and security patches"
git push origin main
```

## 🆘 Backup & Recovery

### Database Backups
1. **Automated Backups**
   - Supabase handles daily backups
   - Configure retention period
   - Test restore procedures

2. **Manual Backups**
   ```bash
   # Export schema and data
   pg_dump -h db.supabase.co -U postgres -d postgres > backup.sql
   ```

### Application Backups
- Source code in Git
- Environment variables documented
- Deployment configurations saved

## 🔍 Troubleshooting Production Issues

### Common Issues
1. **Build Failures**
   - Check environment variables
   - Verify all dependencies installed
   - Review build logs

2. **Authentication Issues**
   - Verify Supabase URLs
   - Check redirect URLs
   - Validate JWT secrets

3. **Database Connection Issues**
   - Check connection limits
   - Verify network connectivity
   - Review RLS policies

### Debug Tools
```javascript
// Add debug logging in production
if (process.env.NODE_ENV === 'production' && process.env.DEBUG_MODE) {
  console.log('Debug info:', { user, session, error });
}
```

## ✅ Production Checklist

Before going live:

- [ ] Database schema deployed
- [ ] Environment variables configured
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Backups configured
- [ ] Security headers implemented
- [ ] Rate limiting enabled
- [ ] Email notifications working
- [ ] All features tested in production
- [ ] Mobile responsiveness verified
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Documentation updated

## 📞 Support & Maintenance

### Getting Help
- 📖 [Next.js Documentation](https://nextjs.org/docs)
- 📖 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Community Forums](https://github.com/discussions)

### Maintenance Contacts
- Database: Supabase Support
- Hosting: Vercel Support
- Application: Development Team

---

🎉 **Your SchoolNexus application is now ready for production!**

Remember to monitor your application regularly and keep dependencies updated for security and performance.
