import Link from 'next/link'
import { redirect } from 'next/navigation'
import { School, Users, GraduationCap, Settings, Shield, BarChart3 } from 'lucide-react'
import { getSession, getUserRole } from '@/lib/supabase'

export default async function HomePage() {
  // Check if user is already authenticated
  const session = await getSession()
  
  if (session) {
    const userRole = await getUserRole()
    if (userRole) {
      // Redirect authenticated users to their appropriate dashboard
      if (userRole.role === 'super_admin') {
        redirect('/super-admin')
      } else {
        redirect('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
              <School className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-6">SchoolNexus</h1>
          <p className="text-2xl text-gray-600 mb-8">Complete Multi-School Management System</p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Streamline your educational institution management with our comprehensive platform 
            designed for modern schools and educational organizations.
          </p>
        </div>
        
        {/* Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-purple-100">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">School Administrator</h3>
            <p className="text-gray-600 mb-6 text-center">
              Manage your school's students, teachers, classes, examinations, and daily operations 
              with our comprehensive school management dashboard.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2 text-purple-500" />
                Student & Teacher Management
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="w-4 h-4 mr-2 text-purple-500" />
                Academic Planning & Tracking
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 mr-2 text-purple-500" />
                Performance Analytics
              </div>
            </div>
            <Link 
              href="/auth/login" 
              className="block w-full text-center bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors duration-200 font-medium"
            >
              Access School Dashboard
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-blue-100">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 mx-auto">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Super Administrator</h3>
            <p className="text-gray-600 mb-6 text-center">
              Manage multiple schools, system administrators, subscriptions, and access 
              comprehensive system-wide analytics and reporting tools.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <School className="w-4 h-4 mr-2 text-blue-500" />
                Multi-School Management
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Settings className="w-4 h-4 mr-2 text-blue-500" />
                System Configuration
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                Advanced Analytics
              </div>
            </div>
            <Link 
              href="/auth/login" 
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Access System Management
            </Link>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="bg-white rounded-2xl p-12 shadow-xl border border-gray-100">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Comprehensive Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Student Management</h4>
              <p className="text-gray-600">Complete student profiles, enrollment tracking, and academic progress monitoring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Academic Management</h4>
              <p className="text-gray-600">Classes, subjects, examinations, and comprehensive academic term management</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <School className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Multi-School Support</h4>
              <p className="text-gray-600">Manage multiple educational institutions from a single centralized platform</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Analytics & Reports</h4>
              <p className="text-gray-600">Comprehensive reporting tools and data analytics for informed decision making</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">
            Trusted by educational institutions worldwide
          </p>
          <p className="text-sm text-gray-400">
            © 2024 SchoolNexus. Built with Next.js, TypeScript, and Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
