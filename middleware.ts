import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@/lib/supabase'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareSupabaseClient(request)
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup']
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname.startsWith('/api/auth') ||
                       pathname.startsWith('/_next') ||
                       pathname.startsWith('/favicon.ico') ||
                       pathname.startsWith('/manifest.json') ||
                       pathname.startsWith('/icons')

  // If no session and trying to access protected route, redirect to login
  if (!session && !isPublicRoute) {
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // If user is authenticated, check role-based access
  if (session) {
    try {
      // Get user role from administrators table
      const { data: admin } = await supabase
        .from('administrators')
        .select('role, school_id')
        .eq('user_id', session.user.id)
        .single()

      if (admin) {
        // Super admin trying to access school admin routes
        if (admin.role === 'super_admin' && pathname.startsWith('/dashboard')) {
          url.pathname = '/super-admin'
          return NextResponse.redirect(url)
        }

        // School admin trying to access super admin routes
        if (admin.role === 'school_admin' && pathname.startsWith('/super-admin')) {
          url.pathname = '/dashboard'
          return NextResponse.redirect(url)
        }

        // Redirect authenticated users from login page to appropriate dashboard
        if (pathname === '/auth/login') {
          if (admin.role === 'super_admin') {
            url.pathname = '/super-admin'
          } else {
            url.pathname = '/dashboard'
          }
          return NextResponse.redirect(url)
        }

        // Redirect from root to appropriate dashboard
        if (pathname === '/' && session) {
          if (admin.role === 'super_admin') {
            url.pathname = '/super-admin'
          } else {
            url.pathname = '/dashboard'
          }
          return NextResponse.redirect(url)
        }
      } else {
        // User exists but not in administrators table - redirect to login
        if (!isPublicRoute) {
          url.pathname = '/auth/login'
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error)
      // On error, redirect to login if accessing protected route
      if (!isPublicRoute) {
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
