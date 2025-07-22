'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  School,
  Users,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react'
import { useState } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/super-admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Schools',
    href: '/super-admin/schools',
    icon: School,
  },
  {
    title: 'Administrators',
    href: '/super-admin/administrators',
    icon: Users,
  },
  {
    title: 'Subscriptions',
    href: '/super-admin/subscriptions',
    icon: FileBarChart,
  },
  {
    title: 'Reports',
    href: '/super-admin/reports',
    icon: FileBarChart,
  },
  {
    title: 'Settings',
    href: '/super-admin/settings',
    icon: Settings,
  },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
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
          "fixed inset-y-0 left-0 z-40 w-64 sidebar-gradient transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6">
            <div className="flex items-center">
              <School className="w-8 h-8 text-white mr-3" />
              <div>
                <h1 className="text-xl font-bold text-white">SchoolNexus</h1>
                <p className="text-purple-200 text-sm">Super Admin</p>
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
                          : "text-purple-100 hover:bg-white hover:bg-opacity-10 hover:text-white"
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
            <div className="border-t border-purple-300 border-opacity-20 pt-4">
              <div className="flex items-center px-4 py-3 text-purple-100 mb-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium">admin</p>
                  <p className="text-xs text-purple-200">Super Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-purple-100 rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
