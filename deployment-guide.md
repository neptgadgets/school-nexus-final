# SchoolNexus Deployment Guide

## Prerequisites

1. **Node.js 18+** installed on your system
2. **Supabase Account** - Create at [supabase.com](https://supabase.com)
3. **Vercel Account** (recommended) - Create at [vercel.com](https://vercel.com)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name and database password
3. Wait for the project to be created

### 1.2 Set up Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL script to create all tables and sample data

### 1.3 Get API Keys
1. Go to Settings > API in your Supabase dashboard
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

## Step 2: Local Development Setup

### 2.1 Clone and Install
```bash
# Clone the repository
git clone <your-repository-url>
cd schoolnexus

# Install dependencies
npm install
```

### 2.2 Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2.3 Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Step 3: Create Admin User

### 3.1 Manual Admin Creation (via Supabase Dashboard)
1. Go to Authentication > Users in Supabase dashboard
2. Click "Add User" and create a user with email/password
3. Note the User ID from the users table
4. Go to Table Editor > administrators table
5. Insert a new record:
   ```sql
   INSERT INTO administrators (user_id, role, first_name, last_name, email, is_active)
   VALUES ('user-id-from-step-3', 'super_admin', 'Super', 'Admin', 'admin@schoolnexus.com', true);
   ```

### 3.2 Alternative: SQL Script
```sql
-- First create auth user (do this in Supabase Auth)
-- Then insert administrator record
INSERT INTO administrators (user_id, role, first_name, last_name, email, is_active)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@schoolnexus.com'),
  'super_admin',
  'Super',
  'Admin', 
  'admin@schoolnexus.com',
  true
);
```

## Step 4: Production Deployment (Vercel)

### 4.1 Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### 4.2 Environment Variables
In Vercel dashboard, add these environment variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### 4.3 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Visit your live application

## Step 5: PWA Setup

### 5.1 Icons Generation
1. Create a 512x512 PNG logo for your school system
2. Use a tool like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) to generate all icon sizes
3. Place generated icons in `/public/icons/` directory

### 5.2 Test PWA Installation
1. Visit your deployed application on mobile
2. Look for "Add to Home Screen" prompt
3. Install and test offline functionality

## Step 6: Security Configuration

### 6.1 Supabase RLS Policies
The schema includes Row Level Security policies. Verify they're enabled:
1. Go to Authentication > Policies in Supabase
2. Ensure all tables have appropriate policies
3. Test with different user roles

### 6.2 Domain Configuration
1. In Supabase dashboard, go to Authentication > Settings
2. Add your production domain to "Site URL"
3. Add domain to "Additional Redirect URLs" if needed

## Step 7: Testing

### 7.1 Test User Roles
1. **Super Admin**: Should access `/super-admin` dashboard
2. **School Admin**: Should access `/dashboard` with school-specific data

### 7.2 Test Core Features
- [ ] User authentication
- [ ] Student management
- [ ] Fee collection
- [ ] Exam management
- [ ] Data export (CSV/PDF)
- [ ] Offline functionality

## Step 8: Monitoring & Maintenance

### 8.1 Set up Monitoring
1. Enable Vercel Analytics
2. Monitor Supabase usage in dashboard
3. Set up error tracking (optional: Sentry)

### 8.2 Backup Strategy
1. Supabase automatically backs up your database
2. Export important data regularly
3. Keep environment variables secure

## Troubleshooting

### Common Issues

1. **"User not authorized" error**
   - Check RLS policies are correctly set up
   - Verify user exists in administrators table

2. **Build fails on Vercel**
   - Check all environment variables are set
   - Verify TypeScript types are correct

3. **PWA not installing**
   - Check manifest.json is accessible
   - Verify HTTPS is enabled (required for PWA)

4. **Database connection issues**
   - Verify Supabase URL and keys
   - Check if project is paused (free tier)

### Support Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Production Checklist

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Admin user created
- [ ] Environment variables set
- [ ] Application deployed to Vercel
- [ ] PWA icons generated and added
- [ ] Domain configured in Supabase
- [ ] SSL certificate enabled
- [ ] Core functionality tested
- [ ] User roles tested
- [ ] Offline functionality tested
- [ ] Backup strategy in place

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use service role key only server-side**
3. **Regularly rotate API keys**
4. **Monitor Supabase logs** for suspicious activity
5. **Keep dependencies updated**
6. **Use HTTPS everywhere**
7. **Implement proper error handling**
8. **Test RLS policies thoroughly**

---

Your SchoolNexus system is now ready for production use! 🎉
