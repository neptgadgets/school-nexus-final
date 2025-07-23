import Link from 'next/link'
import { redirect } from 'next/navigation'
import { 
  School, 
  Users, 
  GraduationCap, 
  Settings, 
  Shield, 
  BarChart3,
  BookOpen,
  Calendar,
  MessageSquare,
  DollarSign,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Globe,
  Smartphone,
  Lock,
  Zap
} from 'lucide-react'
import { getCurrentUser } from '@/lib/api'

export default function HomePage() {
  // Authentication is handled by middleware and individual pages
  // This is the public landing page

  const userTypes = [
    {
      title: 'Super Administrator',
      description: 'System-wide management and oversight',
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      features: [
        'Multi-school management',
        'System analytics & reporting',
        'Subscription & billing management',
        'User role administration',
        'Security & compliance oversight'
      ],
      demoCredentials: {
        email: 'superadmin@schoolnexus.com',
        password: 'demo123'
      }
    },
    {
      title: 'School Administrator',
      description: 'Complete school management and operations',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      features: [
        'Student & teacher management',
        'Academic planning & scheduling',
        'Attendance & performance tracking',
        'Financial management',
        'Communication & reporting'
      ],
      demoCredentials: {
        email: 'admin@schoolnexus.com',
        password: 'demo123'
      }
    },
    {
      title: 'Teacher',
      description: 'Classroom management and student tracking',
      icon: GraduationCap,
      color: 'from-green-500 to-emerald-600',
      features: [
        'Class & student management',
        'Attendance marking',
        'Grade & assignment tracking',
        'Parent communication',
        'Performance analytics'
      ],
      demoCredentials: {
        email: 'teacher@schoolnexus.com',
        password: 'demo123'
      }
    },
    {
      title: 'Student',
      description: 'Academic progress and learning portal',
      icon: BookOpen,
      color: 'from-orange-500 to-red-600',
      features: [
        'Academic progress tracking',
        'Assignment submissions',
        'Schedule & timetable view',
        'Grade & performance reports',
        'Communication with teachers'
      ],
      demoCredentials: {
        email: 'student@schoolnexus.com',
        password: 'demo123'
      }
    },
    {
      title: 'Parent/Guardian',
      description: 'Monitor children\'s academic journey',
      icon: Users,
      color: 'from-pink-500 to-rose-600',
      features: [
        'Multiple children monitoring',
        'Academic progress tracking',
        'Attendance & grade reports',
        'Teacher communication',
        'Fee payment tracking'
      ],
      demoCredentials: {
        email: 'parent@schoolnexus.com',
        password: 'demo123'
      }
    }
  ]

  const systemFeatures = [
    {
      icon: Globe,
      title: 'Multi-School Support',
      description: 'Manage multiple educational institutions from a single platform'
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Access your dashboard from any device, anywhere, anytime'
    },
    {
      icon: Lock,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with role-based access control'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Live data synchronization and instant notifications'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and data visualization tools'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Integrated messaging and announcement system'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SchoolNexus</h1>
                <p className="text-xs text-gray-600">Education Management Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/auth/login" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <School className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                SchoolNexus
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              The Complete Multi-School Management Platform
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto">
              Streamline your educational institution management with our comprehensive platform 
              designed for modern schools, teachers, students, and parents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/auth/login"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <span>Try Demo Now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl border border-gray-200 hover:bg-white hover:shadow-lg transition-all duration-200 font-semibold text-lg flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Demo Credentials Alert */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Demo Ready!</h3>
              </div>
              <p className="text-green-700 text-sm">
                Use the demo credentials below to explore different user experiences. 
                No registration required!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built for Every Educational Stakeholder
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience tailored dashboards designed specifically for your role in the educational ecosystem
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => {
              const Icon = userType.icon
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${userType.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {userType.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 text-center leading-relaxed">
                    {userType.description}
                  </p>
                  
                  <div className="space-y-3 mb-8">
                    {userType.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Demo Credentials</span>
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <code className="bg-white px-2 py-1 rounded font-mono text-xs">
                          {userType.demoCredentials.email}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Password:</span>
                        <code className="bg-white px-2 py-1 rounded font-mono text-xs">
                          {userType.demoCredentials.password}
                        </code>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/auth/login"
                    className={`block w-full text-center bg-gradient-to-r ${userType.color} text-white py-3 rounded-xl hover:shadow-lg transition-all duration-200 font-medium`}
                  >
                    Try {userType.title} Demo
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage modern educational institutions effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {systemFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                    <Icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Academic Management Features */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Complete Academic Management Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From enrollment to graduation, manage every aspect of the academic journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Student Management', description: 'Complete student lifecycle management with profiles and tracking' },
              { icon: GraduationCap, title: 'Academic Planning', description: 'Curriculum planning, scheduling, and academic term management' },
              { icon: BarChart3, title: 'Performance Analytics', description: 'Comprehensive reporting and data visualization tools' },
              { icon: MessageSquare, title: 'Communication', description: 'Integrated messaging between all educational stakeholders' },
              { icon: Calendar, title: 'Scheduling', description: 'Advanced timetable management and event scheduling' },
              { icon: DollarSign, title: 'Financial Management', description: 'Complete billing, fee collection, and financial reporting' },
              { icon: BookOpen, title: 'Library System', description: 'Digital library management with borrowing and inventory' },
              { icon: Settings, title: 'System Administration', description: 'User management, security, and system configuration' }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your School Management?
          </h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Join thousands of educational institutions already using SchoolNexus to streamline their operations and improve educational outcomes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/auth/login"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-2"
            >
              <span>Start Free Demo</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-200 font-semibold text-lg">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <School className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">SchoolNexus</h3>
                  <p className="text-gray-400 text-sm">Education Management Platform</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Empowering educational institutions with comprehensive management tools, 
                real-time analytics, and seamless communication capabilities.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Settings className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-6">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SchoolNexus. Built with Next.js, TypeScript, and Supabase.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
