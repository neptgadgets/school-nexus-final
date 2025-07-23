'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getCurrentUser } from '@/lib/api'
import {
  LayoutDashboard,
  School,
  Users,
  CreditCard,
  FileBarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Crown,
  DollarSign,
  BarChart3,
  HeadphonesIcon,
  Database,
  Shield,
  Archive
} from 'lucide-react'
import { useState } from 'react'

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
    icon: CreditCard,
  },
  {
    title: 'Billing',
    href: '/super-admin/billing',
    icon: DollarSign,
  },
  {
    title: 'Reports',
    href: '/super-admin/reports',
    icon: FileBarChart,
  },
  {
    title: 'Analytics',
    href: '/super-admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Support',
    href: '/super-admin/support',
    icon: HeadphonesIcon,
  },
  {
    title: 'System Logs',
    href: '/super-admin/logs',
    icon: Database,
  },
  {
    title: 'Backup & Restore',
    href: '/super-admin/backup',
    icon: Archive,
  },
  {
    title: 'Security',
    href: '/super-admin/security',
    icon: Shield,
  },
  {
    title: 'Settings',
    href: '/super-admin/settings',
    icon: Settings,
  },
]

export function SuperAdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const supabase = getCurrentUser()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
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
          "fixed inset-y-0 left-0 z-40 w-64 sidebar-gradient transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <Crown className="w-5 h-5 text-white" />
              </div>
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
              <div className="flex items-center px-4 py-2 mb-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Super Admin</p>
                  <p className="text-purple-200 text-xs">System Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-purple-100 rounded-lg hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors duration-200 disabled:opacity-50"
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
