import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { getUserRole } from '@/lib/supabase'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication and role
  const userRole = await getUserRole()
  
  if (!userRole) {
    redirect('/auth/login')
  }

  // Redirect super admin to their dashboard
  if (userRole.role === 'super_admin') {
    redirect('/super-admin')
  }

  // Only school admins can access this dashboard
  if (userRole.role !== 'school_admin') {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
