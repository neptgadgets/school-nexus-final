import { createClient } from '@supabase/supabase-js'

// Environment variables with fallbacks for demo
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-anon-key'

// Check if we have real Supabase credentials
const hasRealSupabase = supabaseUrl !== 'https://demo.supabase.co' && 
                       supabaseAnonKey !== 'demo-anon-key' &&
                       supabaseUrl.includes('supabase.co')

// Client-side Supabase client
export const createSupabaseClient = () => {
  if (!hasRealSupabase) {
    // Return a mock client for demo purposes
    return {
      auth: {
        signInWithPassword: async () => ({ data: null, error: { message: 'Demo mode - use demo credentials' } }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null })
          })
        })
      })
    } as any
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  })
}

// Utility to check if running in demo mode
export const isDemoMode = () => !hasRealSupabase

// Export the configuration status
export const supabaseConfig = {
  hasRealSupabase,
  supabaseUrl,
  isDemoMode: !hasRealSupabase
}
