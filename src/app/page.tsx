import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'

export default async function HomePage() {
  const supabase = createSupabaseServerClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    redirect('/auth/login')
  }
  
  // Check user role and redirect accordingly
  const { data: admin } = await supabase
    .from('administrators')
    .select('role, school_id')
    .eq('user_id', session.user.id)
    .single()
  
  if (admin?.role === 'super_admin') {
    redirect('/super-admin')
  } else if (admin?.role === 'school_admin') {
    redirect('/dashboard')
  } else {
    redirect('/auth/login')
  }
}
