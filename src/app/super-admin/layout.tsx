import { createSupabaseServerClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { SuperAdminSidebar } from '@/components/layout/super-admin-sidebar'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createSupabaseServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // Check if user is super admin
  const { data: admin } = await supabase
    .from('administrators')
    .select('role, is_active')
    .eq('user_id', session.user.id)
    .single()
  
  if (!admin || admin.role !== 'super_admin' || !admin.is_active) {
    redirect('/auth/login')
  }

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
