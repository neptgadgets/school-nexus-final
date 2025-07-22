import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

// Server-side Supabase client for Server Components
export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Middleware Supabase client
export const createMiddlewareSupabaseClient = (request: NextRequest) => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  return { supabase, response }
}

// Auth helper functions
export async function getUser() {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  
  return user
}

export async function getSession() {
  const supabase = createServerSupabaseClient()
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error)
    return null
  }
  
  return session
}

// Get user role and school information
export async function getUserRole() {
  const supabase = createServerSupabaseClient()
  const user = await getUser()
  
  if (!user) {
    return null
  }

  // Check if user is super admin
  const { data: superAdmin } = await supabase
    .from('administrators')
    .select('role, school_id')
    .eq('user_id', user.id)
    .eq('role', 'super_admin')
    .single()

  if (superAdmin) {
    return { role: 'super_admin', schoolId: null }
  }

  // Check if user is school admin
  const { data: schoolAdmin } = await supabase
    .from('administrators')
    .select('role, school_id')
    .eq('user_id', user.id)
    .eq('role', 'school_admin')
    .single()

  if (schoolAdmin) {
    return { role: 'school_admin', schoolId: schoolAdmin.school_id }
  }

  return null
}

// Database type definitions
export type Database = {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          email: string
          logo_url: string | null
          is_active: boolean
          subscription_status: 'active' | 'expired' | 'trial'
          subscription_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          email: string
          logo_url?: string | null
          is_active?: boolean
          subscription_status?: 'active' | 'expired' | 'trial'
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          email?: string
          logo_url?: string | null
          is_active?: boolean
          subscription_status?: 'active' | 'expired' | 'trial'
          subscription_end_date?: string | null
          updated_at?: string
        }
      }
      administrators: {
        Row: {
          id: string
          user_id: string
          school_id: string | null
          role: 'super_admin' | 'school_admin'
          first_name: string
          last_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          school_id?: string | null
          role: 'super_admin' | 'school_admin'
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          school_id?: string | null
          role?: 'super_admin' | 'school_admin'
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          school_id: string
          class_id: string | null
          student_id: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other'
          address: string | null
          phone: string | null
          email: string | null
          guardian_name: string | null
          guardian_phone: string | null
          guardian_email: string | null
          enrollment_date: string
          status: 'active' | 'inactive' | 'graduated' | 'transferred'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          class_id?: string | null
          student_id: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          gender: 'male' | 'female' | 'other'
          address?: string | null
          phone?: string | null
          email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_email?: string | null
          enrollment_date: string
          status?: 'active' | 'inactive' | 'graduated' | 'transferred'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          class_id?: string | null
          student_id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other'
          address?: string | null
          phone?: string | null
          email?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          guardian_email?: string | null
          enrollment_date?: string
          status?: 'active' | 'inactive' | 'graduated' | 'transferred'
          avatar_url?: string | null
          updated_at?: string
        }
      }
      teachers: {
        Row: {
          id: string
          school_id: string
          employee_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address: string | null
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other'
          qualification: string | null
          experience_years: number | null
          joining_date: string
          salary: number | null
          avatar_url: string | null
          status: 'active' | 'inactive' | 'suspended'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          school_id: string
          employee_id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          address?: string | null
          date_of_birth?: string | null
          gender: 'male' | 'female' | 'other'
          qualification?: string | null
          experience_years?: number | null
          joining_date: string
          salary?: number | null
          avatar_url?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          employee_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          address?: string | null
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other'
          qualification?: string | null
          experience_years?: number | null
          joining_date?: string
          salary?: number | null
          avatar_url?: string | null
          status?: 'active' | 'inactive' | 'suspended'
          updated_at?: string
        }
      }
    }
  }
}
