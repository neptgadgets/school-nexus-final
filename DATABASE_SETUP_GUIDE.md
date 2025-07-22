# 🗄️ Database Setup Guide - SchoolNexus

## 📋 Prerequisites
Before setting up the database, ensure you have:
- A Supabase account (free tier available)
- Basic understanding of SQL
- Access to the Supabase dashboard

## 🚀 Step 1: Create Supabase Project

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Sign up or log in to your account
   - Click "New Project"

2. **Project Configuration**
   - Choose your organization
   - Enter project name: `schoolnexus`
   - Enter database password (save this securely!)
   - Select your region (closest to your users)
   - Click "Create new project"

3. **Wait for Setup**
   - Project creation takes 2-3 minutes
   - You'll see a progress indicator

## 🔧 Step 2: Configure Environment Variables

1. **Get Project Credentials**
   - Go to Project Settings → API
   - Copy the following values:
     - Project URL
     - Anon (public) key

2. **Update Environment File**
   ```bash
   cp .env.example .env.local
   ```

3. **Edit .env.local**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXTAUTH_SECRET=your-random-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

## 🏗️ Step 3: Set Up Database Schema

1. **Open SQL Editor**
   - In Supabase dashboard, go to "SQL Editor"
   - Click "New query"

2. **Run Database Schema**
   - Copy the entire content from `supabase-schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

3. **Verify Tables**
   - Go to "Table Editor" in dashboard
   - You should see all tables created:
     - schools
     - administrators
     - students
     - teachers
     - classes
     - subjects
     - academic_terms
     - exams
     - exam_results
     - fee_types
     - fee_records
     - fee_payments
     - teacher_subjects

## 🔐 Step 4: Configure Authentication

1. **Enable Email Authentication**
   - Go to Authentication → Settings
   - Ensure "Enable email confirmations" is configured
   - Set up email templates (optional)

2. **Configure Redirect URLs**
   - Add your domain to redirect URLs:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)

3. **Row Level Security (RLS)**
   - RLS policies are already included in the schema
   - These ensure data isolation between schools

## 👤 Step 5: Create Initial Users

### Method 1: Using Supabase Dashboard

1. **Go to Authentication → Users**
2. **Click "Add User"**
3. **Create Super Admin:**
   - Email: `admin@yourschool.com`
   - Password: `secure_password_123`
   - Confirm email: ✓

4. **Create School Admin:**
   - Email: `school@yourschool.com`
   - Password: `secure_password_123`
   - Confirm email: ✓

### Method 2: Using SQL (Recommended)

Run this SQL in the SQL Editor:

```sql
-- Insert a school first
INSERT INTO schools (name, address, phone, email, is_active, subscription_status)
VALUES (
  'Demo High School',
  '123 Education Street, Learning City',
  '+1234567890',
  'info@demohighschool.edu',
  true,
  'active'
);

-- Get the school ID (note it down)
SELECT id FROM schools WHERE name = 'Demo High School';

-- After creating users in Auth, add them to administrators table
-- Replace 'user-id-here' with actual user IDs from auth.users
INSERT INTO administrators (user_id, school_id, role, first_name, last_name, email, is_active)
VALUES 
  ('super-admin-user-id', NULL, 'super_admin', 'System', 'Administrator', 'admin@yourschool.com', true),
  ('school-admin-user-id', 'school-id-here', 'school_admin', 'School', 'Administrator', 'school@yourschool.com', true);
```

## 🧪 Step 6: Test the Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test Authentication**
   - Go to `http://localhost:3000`
   - Click "Sign In"
   - Try logging in with created credentials

4. **Verify Role-Based Access**
   - Super admin should access `/super-admin`
   - School admin should access `/dashboard`

## 📊 Step 7: Add Sample Data (Optional)

For testing purposes, you can add sample data:

```sql
-- Add sample students
INSERT INTO students (school_id, student_id, first_name, last_name, gender, enrollment_date, status)
VALUES 
  ('your-school-id', 'STU001', 'John', 'Doe', 'male', '2024-01-15', 'active'),
  ('your-school-id', 'STU002', 'Jane', 'Smith', 'female', '2024-01-15', 'active');

-- Add sample teachers
INSERT INTO teachers (school_id, employee_id, first_name, last_name, email, phone, gender, joining_date, status)
VALUES 
  ('your-school-id', 'TEA001', 'Mary', 'Johnson', 'mary.j@school.edu', '+1234567891', 'female', '2024-01-01', 'active'),
  ('your-school-id', 'TEA002', 'David', 'Wilson', 'david.w@school.edu', '+1234567892', 'male', '2024-01-01', 'active');

-- Add sample classes
INSERT INTO classes (school_id, name, capacity, is_active)
VALUES 
  ('your-school-id', 'Grade 10A', 30, true),
  ('your-school-id', 'Grade 10B', 30, true);

-- Add sample subjects
INSERT INTO subjects (school_id, code, name, credits, is_active)
VALUES 
  ('your-school-id', 'MATH101', 'Mathematics', 3, true),
  ('your-school-id', 'ENG101', 'English Literature', 3, true),
  ('your-school-id', 'SCI101', 'General Science', 4, true);
```

## 🔒 Step 8: Security Checklist

- ✅ RLS policies enabled on all tables
- ✅ Environment variables secured
- ✅ Strong passwords for admin accounts
- ✅ Email confirmation enabled
- ✅ Proper redirect URLs configured
- ✅ Database backups enabled (Supabase handles this)

## 🚀 Step 9: Production Deployment

When deploying to production:

1. **Update Environment Variables**
   - Use production Supabase URL
   - Generate new NEXTAUTH_SECRET
   - Update NEXTAUTH_URL to production domain

2. **Configure Custom Domain**
   - Set up custom domain in Supabase (Pro plan)
   - Update CORS settings

3. **Enable Additional Security**
   - Enable captcha for auth
   - Set up email rate limiting
   - Configure webhook endpoints

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid JWT" Error**
   - Check environment variables
   - Ensure NEXT_PUBLIC_SUPABASE_URL is correct
   - Verify NEXT_PUBLIC_SUPABASE_ANON_KEY

2. **"User not found in administrators"**
   - Ensure user exists in both auth.users and administrators table
   - Check user_id mapping is correct

3. **RLS Policy Errors**
   - Verify RLS policies are enabled
   - Check user has proper role in administrators table

4. **Connection Issues**
   - Verify Supabase project is running
   - Check network connectivity
   - Ensure correct region selected

### Getting Help:

- 📖 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐛 [GitHub Issues](https://github.com/supabase/supabase/issues)

## ✅ Verification Checklist

Before going live, ensure:

- [ ] Database schema created successfully
- [ ] Environment variables configured
- [ ] Authentication working
- [ ] Super admin can access `/super-admin`
- [ ] School admin can access `/dashboard`
- [ ] RLS policies working (users see only their data)
- [ ] Sample data loads correctly
- [ ] All sidebar links functional
- [ ] Mobile responsiveness working
- [ ] Export functionality working

---

🎉 **Congratulations!** Your SchoolNexus database is now ready for production use!

For additional support or custom setup assistance, please refer to the project documentation or create an issue in the repository.
