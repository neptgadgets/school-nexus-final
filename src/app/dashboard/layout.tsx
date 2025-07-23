import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'
import { getCurrentUser } from '@/lib/api'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Authentication is handled by middleware
  // Role-based access control is handled by the API routes

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
