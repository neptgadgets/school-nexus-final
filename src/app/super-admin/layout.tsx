import { redirect } from 'next/navigation'
import { SuperAdminSidebar } from '@/components/layout/super-admin-sidebar'
import { getCurrentUser } from '@/lib/api'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication is handled by middleware
  // Role-based access control is handled by the API routes

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
