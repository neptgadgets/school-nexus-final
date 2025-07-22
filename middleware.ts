import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/super-admin', '/teacher', '/student', '/parent']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Get token from cookie
  const token = req.cookies.get('auth-token')?.value

  let user = null
  if (token) {
    try {
      user = verifyToken(token)
    } catch (error) {
      // Token is invalid, continue without user
    }
  }

  // If accessing a protected route without valid authentication, redirect to login
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', req.url)
    redirectUrl.searchParams.set('returnUrl', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated user tries to access login page, redirect to appropriate dashboard
  if (req.nextUrl.pathname === '/auth/login' && user) {
    // Redirect based on role
    switch (user.role) {
      case 'super_admin':
        return NextResponse.redirect(new URL('/super-admin', req.url))
      case 'school_admin':
        return NextResponse.redirect(new URL('/dashboard', req.url))
      case 'teacher':
        return NextResponse.redirect(new URL('/teacher', req.url))
      case 'student':
        return NextResponse.redirect(new URL('/student', req.url))
      case 'parent':
        return NextResponse.redirect(new URL('/parent', req.url))
      default:
        return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
