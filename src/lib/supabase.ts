import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For client-side usage
export const createSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

// For server-side usage in Server Components
export const createSupabaseServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// For API routes
export const createSupabaseRouteHandlerClient = (request: Request) => {
  return createRouteHandlerClient<Database>({ cookies })
}

// Admin client for server-side operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Regular client for public operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
