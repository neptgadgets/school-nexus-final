# 🏫 SchoolNexus - Production Ready Multi-School Management System

![SchoolNexus Banner](https://via.placeholder.com/1200x300/8b5cf6/ffffff?text=SchoolNexus+-+Complete+School+Management+System)

## 🌟 Overview

SchoolNexus is a comprehensive, production-ready multi-school management system built with modern web technologies. It provides complete administrative tools for educational institutions with role-based access control, real-time data synchronization, and advanced analytics.

## ✨ Key Features

### 🏫 **School Administration**
- **Student Management**: Complete student profiles, enrollment, and academic tracking
- **Teacher Management**: Staff profiles, qualifications, and subject assignments  
- **Class Management**: Class organization, capacity planning, and enrollment monitoring
- **Subject Management**: Academic subjects with credit systems and teacher assignments
- **Exam Management**: Comprehensive examination scheduling and result tracking
- **Fee Management**: Payment processing, fee tracking, and financial reporting
- **Academic Terms**: Session management and academic calendar planning

### 👑 **Super Administration**
- **Multi-School Management**: Centralized control over multiple institutions
- **Administrator Management**: User roles, permissions, and access control
- **Subscription Management**: Billing, renewals, and subscription tracking
- **System Analytics**: Comprehensive reporting and data visualization
- **System Configuration**: Global settings and security management

### 🔐 **Security & Authentication**
- **Role-Based Access Control (RBAC)**: Secure access based on user roles
- **Row Level Security (RLS)**: Database-level data isolation
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Automatic session refresh and security
- **Middleware Protection**: Route-level access control

### 📊 **Analytics & Reporting**
- **Interactive Dashboards**: Real-time data visualization
- **Advanced Charts**: Pie charts, bar charts, and trend analysis
- **Export Capabilities**: CSV and PDF export functionality
- **Performance Metrics**: Student, teacher, and institutional analytics
- **Financial Reporting**: Revenue tracking and subscription analytics

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Radix UI**: Accessible component library
- **Recharts**: Data visualization library
- **Lucide Icons**: Beautiful icon system

### **Backend & Database**
- **Supabase**: PostgreSQL database with real-time capabilities
- **Row Level Security**: Database-level security policies
- **Real-time Subscriptions**: Live data updates
- **Authentication**: Built-in auth with JWT
- **Storage**: File upload and management

### **Deployment & Performance**
- **Vercel**: Optimized Next.js hosting
- **Edge Functions**: Global performance optimization
- **CDN**: Static asset delivery
- **PWA Ready**: Progressive Web App capabilities
- **Mobile Responsive**: Mobile-first design

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/schoolnexus.git
cd schoolnexus

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🗄️ Database Setup

### Quick Setup with Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and API keys

2. **Run Database Schema**
   - Copy content from `supabase-schema.sql`
   - Run in Supabase SQL Editor
   - This creates all tables, policies, and sample data

3. **Configure Environment**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Create Admin Users**
   ```sql
   -- Run in Supabase SQL Editor after creating users in Auth
   INSERT INTO administrators (user_id, role, first_name, last_name, email, is_active)
   VALUES 
     ('user-id-1', 'super_admin', 'System', 'Admin', 'admin@school.com', true),
     ('user-id-2', 'school_admin', 'School', 'Admin', 'school@school.com', true);
   ```

📖 **Detailed Setup**: See [DATABASE_SETUP_GUIDE.md](./DATABASE_SETUP_GUIDE.md)

## 🏗️ Project Structure

```
schoolnexus/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 auth/               # Authentication pages
│   │   ├── 📁 dashboard/          # School admin pages
│   │   ├── 📁 super-admin/        # Super admin pages
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Homepage
│   ├── 📁 components/             # Reusable components
│   │   ├── 📁 layout/             # Layout components
│   │   └── 📁 ui/                 # UI components
│   ├── 📁 lib/                    # Utilities and configurations
│   │   ├── supabase.ts            # Supabase client
│   │   └── utils.ts               # Helper functions
│   └── 📁 types/                  # TypeScript definitions
├── 📄 middleware.ts               # Authentication middleware
├── 📄 supabase-schema.sql         # Database schema
├── 📄 DATABASE_SETUP_GUIDE.md     # Database setup guide
├── 📄 DEPLOYMENT_GUIDE.md         # Production deployment guide
└── 📄 package.json               # Dependencies
```

## 🔐 Authentication & Authorization

### User Roles
- **Super Admin**: System-wide access, multi-school management
- **School Admin**: Single school management, full school features

### Access Control
- **Middleware**: Route-level protection
- **RLS Policies**: Database-level security
- **Role Checks**: Component-level access control

### Login Credentials (Development)
```
Super Admin: admin@school.com / your_password
School Admin: school@school.com / your_password
```

## 📱 Features Overview

### **School Admin Dashboard** (`/dashboard`)
1. **📊 Analytics Dashboard**: Real-time school metrics and charts
2. **👨‍🎓 Student Management**: Complete student lifecycle management
3. **👩‍🏫 Teacher Management**: Staff profiles and subject assignments
4. **📚 Class Management**: Class organization and enrollment tracking
5. **📖 Subject Management**: Academic subjects with credit systems
6. **📅 Term Management**: Academic calendar and session planning
7. **📝 Exam Management**: Examination scheduling and results
8. **💰 Fee Management**: Payment tracking and financial management
9. **⚙️ Settings**: School configuration and preferences

### **Super Admin Dashboard** (`/super-admin`)
1. **📊 System Dashboard**: Multi-school analytics and overview
2. **🏫 School Management**: Institution registration and management
3. **👥 Administrator Management**: User roles and permissions
4. **💳 Subscription Management**: Billing and subscription tracking
5. **📊 System Reports**: Comprehensive analytics and reporting
6. **⚙️ System Settings**: Global configuration and security

## 🚀 Production Deployment

### Vercel Deployment (Recommended)
```bash
# Connect to Vercel
npx vercel

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
NEXTAUTH_SECRET=strong_production_secret
NEXTAUTH_URL=https://yourdomain.com
```

### Other Deployment Options
- **Netlify**: Static site deployment
- **Railway**: Simple deployment with database
- **Self-hosted**: VPS or cloud deployment

📖 **Detailed Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🔧 Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript checking
```

### Environment Variables
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=your_app_url

# Optional
NODE_ENV=development
```

## 📊 Database Schema

### Core Tables
- **schools**: Institution information
- **administrators**: User roles and permissions
- **students**: Student profiles and enrollment
- **teachers**: Staff information and qualifications
- **classes**: Class organization and capacity
- **subjects**: Academic subjects and credits
- **academic_terms**: Session and calendar management
- **exams**: Examination scheduling and tracking
- **fee_types**: Fee categories and structures
- **fee_records**: Student fee assignments
- **fee_payments**: Payment tracking

### Relationships
- Multi-tenant architecture with school isolation
- Foreign key constraints for data integrity
- Junction tables for many-to-many relationships

## 🔒 Security

### Database Security
- **Row Level Security (RLS)**: Data isolation by school
- **JWT Authentication**: Secure token-based auth
- **SQL Injection Protection**: Parameterized queries
- **Input Validation**: Server-side validation

### Application Security
- **CSRF Protection**: Built-in Next.js protection
- **XSS Prevention**: Content sanitization
- **Secure Headers**: Security headers middleware
- **Environment Variables**: Secure configuration

## 📈 Performance

### Optimization Features
- **Static Generation**: Pre-rendered pages
- **Image Optimization**: Next.js image optimization
- **Code Splitting**: Automatic bundle splitting
- **Caching**: Intelligent caching strategies
- **CDN**: Global content delivery

### Database Performance
- **Indexes**: Optimized database queries
- **Connection Pooling**: Efficient connections
- **Query Optimization**: Optimized Supabase queries

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Setup
```bash
git clone https://github.com/yourusername/schoolnexus.git
cd schoolnexus
npm install
cp .env.example .env.local
# Configure your environment variables
npm run dev
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Database Setup Guide](./DATABASE_SETUP_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [API Documentation](./API_DOCS.md)

### Getting Help
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/schoolnexus/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/schoolnexus/discussions)
- 📧 **Email**: support@schoolnexus.com

### Community
- 🌟 **Star** the project if you find it useful
- 🍴 **Fork** to contribute
- 📢 **Share** with others who might benefit

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Supabase Team** - Excellent backend-as-a-service
- **Tailwind CSS** - Beautiful utility-first CSS
- **Radix UI** - Accessible component primitives
- **Vercel** - Deployment and hosting platform

## 📊 Project Stats

- **17 Complete Pages** - Fully functional interfaces
- **12+ Database Tables** - Comprehensive data model
- **Role-Based Security** - Multi-level access control
- **Mobile Responsive** - Works on all devices
- **PWA Ready** - Progressive web app capabilities
- **Production Ready** - Scalable and secure

---

<div align="center">

**Built with ❤️ for educational institutions worldwide**

[🌐 Live Demo](https://schoolnexus.vercel.app) | [📖 Documentation](./docs) | [🐛 Report Bug](https://github.com/yourusername/schoolnexus/issues) | [✨ Request Feature](https://github.com/yourusername/schoolnexus/issues)

</div>
