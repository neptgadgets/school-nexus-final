# SchoolNexus - Multi-School Management System

A comprehensive Progressive Web App (PWA) for managing multiple schools with offline capabilities, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🌟 Features

### Core Modules
- **Dashboard** - Real-time analytics and key metrics
- **Students Management** - Student registration, profiles, and tracking
- **Teachers Management** - Teacher profiles and subject assignments
- **Classes Management** - Class organization and capacity management
- **Subjects Management** - Academic subjects and curriculum
- **Academic Terms** - Term and session management
- **Exams Management** - Exam scheduling and result tracking
- **Fees Collection** - Comprehensive fee management and payment tracking
- **Multi-School Support** - Super admin can manage multiple schools
- **Settings** - System configuration and preferences

### Key Features
- 🔐 **Role-based Authentication** (Super Admin, School Admin)
- 📱 **Progressive Web App** with offline capabilities
- �� **Real-time Analytics** with interactive charts
- 💰 **Fee Management** with payment tracking
- 📄 **Export Functionality** (PDF, CSV)
- 🔍 **Advanced Search & Filtering**
- 📱 **Mobile Responsive Design**
- 🌐 **Offline Data Sync**
- 🔔 **Real-time Notifications**
- 📈 **Dashboard Analytics**

## 🛠 Technology Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Real-time)
- **UI Components:** Radix UI, Lucide Icons
- **Charts:** Recharts
- **PWA:** next-pwa, Workbox
- **State Management:** Zustand
- **Forms:** React Hook Form with Zod validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd schoolnexus
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Set up Supabase database**
- Create a new Supabase project
- Run the SQL script in `supabase-schema.sql` in your Supabase SQL editor
- This will create all necessary tables, relationships, and sample data

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 📱 PWA Installation

SchoolNexus can be installed as a Progressive Web App:

1. Visit the application in a supported browser
2. Click the "Install" button or use browser's install option
3. The app will be added to your device's home screen
4. Enjoy offline functionality and native app-like experience

## 🗄 Database Schema

The application uses a comprehensive database schema with the following main entities:

- **Schools** - Multi-tenant school information
- **Administrators** - System users with role-based access
- **Students** - Student profiles and academic information
- **Teachers** - Teacher profiles and assignments
- **Classes** - Class organization and capacity
- **Subjects** - Academic subjects and curriculum
- **Academic Terms** - Term and session management
- **Exams** - Exam scheduling and management
- **Fee Management** - Fee types, records, and payments

## 👥 User Roles

### Super Admin
- Manage multiple schools
- View system-wide analytics
- Manage administrators
- System configuration

### School Admin
- Manage single school operations
- Student and teacher management
- Academic and financial operations
- Generate reports

## 📊 Dashboard Features

### Analytics Cards
- Total Students, Teachers, Subjects
- Fee collection statistics
- Real-time metrics

### Charts & Visualizations
- Student gender distribution (Pie Chart)
- Fee collections by class (Bar Chart)
- Monthly trends and analytics

## 💰 Fee Management

- **Fee Types** - Define different fee categories
- **Fee Records** - Track individual student fees
- **Payment Processing** - Record and track payments
- **Receipt Generation** - Automatic receipt numbers
- **Payment Status** - Pending, Partial, Paid, Overdue
- **Export Options** - CSV and PDF reports

## 🔍 Advanced Features

### Search & Filtering
- Global search across students, teachers
- Advanced filtering by status, class, etc.
- Real-time search results

### Export Functionality
- Export student/teacher lists to CSV
- Generate PDF reports
- Custom date range exports

### Offline Capabilities
- Service Worker implementation
- Offline data caching
- Sync when back online
- Background updates

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🔧 Configuration

### PWA Configuration
Customize PWA settings in `next.config.js`:
- Service worker caching strategies
- Offline page handling
- Background sync

### Theme Customization
Modify the purple theme in `tailwind.config.js` and `globals.css`:
- Primary colors
- Component styling
- Custom animations

## 📱 Mobile Support

SchoolNexus is fully responsive and optimized for:
- iOS Safari
- Android Chrome
- Desktop browsers
- Tablet devices

## 🔒 Security

- Row Level Security (RLS) in Supabase
- JWT-based authentication
- Role-based access control
- Secure API endpoints
- Data encryption at rest

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🎯 Roadmap

### Phase 2 Features
- [ ] Student/Parent portal
- [ ] Teacher mobile app
- [ ] SMS notifications
- [ ] Advanced reporting
- [ ] Grade book integration
- [ ] Library management
- [ ] Transport management
- [ ] Hostel management

### Phase 3 Features
- [ ] Mobile apps (React Native)
- [ ] Advanced analytics
- [ ] Integration with external systems
- [ ] Multi-language support
- [ ] Advanced security features

---

Built with ❤️ for educational institutions worldwide.
