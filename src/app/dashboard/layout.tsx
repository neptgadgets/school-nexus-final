import { createSupabaseServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // Check if user is school admin
  const { data: admin } = await supabase
    .from('administrators')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .single()
  
  if (!admin || admin.role !== 'school_admin' || !admin.is_active) {
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
