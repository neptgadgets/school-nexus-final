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
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'
    const status = searchParams.get('status')

    let queryText = `
      SELECT 
        s.*,
        COUNT(DISTINCT st.id) as total_students,
        COUNT(DISTINCT t.id) as total_teachers,
        COUNT(DISTINCT c.id) as total_classes,
        COUNT(DISTINCT a.id) as total_admins
      FROM schools s
      LEFT JOIN students st ON s.id = st.school_id
      LEFT JOIN teachers t ON s.id = t.school_id
      LEFT JOIN classes c ON s.id = c.school_id
      LEFT JOIN administrators a ON s.id = a.school_id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (status) {
      queryText += ` AND s.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    queryText += `
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(parseInt(limit), parseInt(offset))

    const result = await query(queryText, params)

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM schools WHERE 1=1'
    const countParams: any[] = []
    if (status) {
      countQuery += ' AND status = $1'
      countParams.push(status)
    }

    const countResult = await query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].count)

    return NextResponse.json({
      schools: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    })

  } catch (error) {
    console.error('Super admin schools API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      address,
      phone,
      email,
      website,
      principal_name,
      principal_email,
      principal_phone,
      subscription_plan,
      max_students,
      max_teachers
    } = body

    const result = await query(`
      INSERT INTO schools (
        name, address, phone, email, website, principal_name,
        principal_email, principal_phone, subscription_plan,
        max_students, max_teachers, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active', NOW(), NOW())
      RETURNING *
    `, [
      name, address, phone, email, website, principal_name,
      principal_email, principal_phone, subscription_plan,
      max_students, max_teachers
    ])

    return NextResponse.json({ school: result.rows[0] })

  } catch (error) {
    console.error('Create school error:', error)
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    )
  }
}
