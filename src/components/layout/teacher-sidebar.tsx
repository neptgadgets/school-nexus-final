'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  CheckSquare,
  MessageSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/teacher',
    icon: LayoutDashboard,
  },
  {
    title: 'My Classes',
    href: '/teacher/classes',
    icon: BookOpen,
  },
  {
    title: 'Students',
    href: '/teacher/students',
    icon: Users,
  },
  {
    title: 'Attendance',
    href: '/teacher/attendance',
    icon: CheckSquare,
  },
  {
    title: 'Assignments',
    href: '/teacher/assignments',
    icon: FileText,
  },
  {
    title: 'Grades',
    href: '/teacher/grades',
    icon: BarChart3,
  },
  {
    title: 'Schedule',
    href: '/teacher/schedule',
    icon: Calendar,
  },
  {
    title: 'Messages',
    href: '/teacher/messages',
    icon: MessageSquare,
  },
  {
    title: 'Resources',
    href: '/teacher/resources',
    icon: BookOpen,
  },
  {
    title: 'Profile',
    href: '/teacher/profile',
    icon: User,
  },
  {
    title: 'Settings',
    href: '/teacher/settings',
    icon: Settings,
  },
]

export function TeacherSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // For demo, just redirect to login
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-white"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-green-600 to-emerald-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SchoolNexus</h1>
                <p className="text-green-200 text-sm">Teacher Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 pb-4 overflow-y-auto custom-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                        isActive
                          ? "bg-white bg-opacity-20 text-white"
                          : "text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="px-4 pb-4">
            <div className="border-t border-green-300 border-opacity-20 pt-4">
              <div className="flex items-center px-4 py-2 mb-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Teacher Demo</p>
                  <p className="text-green-200 text-xs">Mathematics Department</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-green-100 rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors duration-200 disabled:opacity-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
