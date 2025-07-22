import { StudentSidebar } from '@/components/layout/student-sidebar'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For demo purposes, we'll skip authentication checks
  // In production, you would check if user is authenticated and has student role

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
