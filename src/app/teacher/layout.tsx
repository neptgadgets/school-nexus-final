import { TeacherSidebar } from '@/components/layout/teacher-sidebar'

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For demo purposes, we'll skip authentication checks
  // In production, you would check if user is authenticated and has teacher role

  return (
    <div className="flex h-screen bg-gray-50">
      <TeacherSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
