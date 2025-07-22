import Link from 'next/link'
import { School, Users, GraduationCap, Settings } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <School className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">SchoolNexus</h1>
        <p className="text-xl text-gray-600 mb-8">Complete Multi-School Management System</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">School Admin</h3>
            <p className="text-gray-600 mb-4">Manage your school's students, teachers, classes, and operations</p>
            <Link 
              href="/auth/login" 
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Access Dashboard
            </Link>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Super Admin</h3>
            <p className="text-gray-600 mb-4">Manage multiple schools, administrators, and system settings</p>
            <Link 
              href="/auth/login" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              System Management
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Student Management</h4>
              <p className="text-sm text-gray-600">Complete student profiles, enrollment, and tracking</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">Academic Management</h4>
              <p className="text-sm text-gray-600">Classes, subjects, exams, and academic terms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <School className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Multi-School Support</h4>
              <p className="text-sm text-gray-600">Manage multiple schools from one platform</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>© 2024 SchoolNexus. Built with Next.js, TypeScript, and Tailwind CSS.</p>
        </div>
      </div>
    </div>
  )
}
