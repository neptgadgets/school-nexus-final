import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string
    email: string
    role: string
    schoolId?: string
  }
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<Response>) {
  return async (req: NextRequest): Promise<Response> => {
    try {
      // Get token from Authorization header or cookie
      let token = req.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        // Try to get from cookie
        token = req.cookies.get('auth-token')?.value
      }
      
      if (!token) {
        return new Response(JSON.stringify({ error: 'No token provided' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // Verify token
      const decoded = verifyToken(token)
      
      if (!decoded) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // Add user info to request
      const authReq = req as AuthenticatedRequest
      authReq.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        schoolId: decoded.schoolId
      }
      
      return await handler(authReq)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

export function requireRole(roles: string[]) {
  return function(handler: (req: AuthenticatedRequest) => Promise<Response>) {
    return withAuth(async (req: AuthenticatedRequest) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      return await handler(req)
    })
  }
}
