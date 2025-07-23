export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('school_id')
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'

    let queryText = `
      SELECT 
        a.*,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        s.name as school_name
      FROM administrators a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN schools s ON a.school_id = s.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (schoolId) {
      queryText += ` AND a.school_id = $${paramIndex}`
      params.push(schoolId)
      paramIndex++
    }

    queryText += `
      ORDER BY a.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(parseInt(limit), parseInt(offset))

    const result = await query(queryText, params)

    return NextResponse.json({
      administrators: result.rows
    })

  } catch (error) {
    console.error('Super admin administrators API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
