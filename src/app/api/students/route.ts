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
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('school_id')
    const classId = searchParams.get('class_id')
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'

    let queryText = `
      SELECT 
        s.*,
        c.name as class_name,
        c.level as class_level,
        sc.name as school_name,
        COUNT(a.id) as total_assignments,
        AVG(g.score) as average_grade
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN schools sc ON s.school_id = sc.id
      LEFT JOIN assignments a ON a.class_id = s.class_id
      LEFT JOIN grades g ON g.student_id = s.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (schoolId) {
      queryText += ` AND s.school_id = $${paramIndex}`
      params.push(schoolId)
      paramIndex++
    }

    if (classId) {
      queryText += ` AND s.class_id = $${paramIndex}`
      params.push(classId)
      paramIndex++
    }

    queryText += `
      GROUP BY s.id, c.name, c.level, sc.name
      ORDER BY s.last_name, s.first_name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(parseInt(limit), parseInt(offset))

    const result = await query(queryText, params)

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) FROM students s WHERE 1=1'
    const countParams: any[] = []
    let countParamIndex = 1

    if (schoolId) {
      countQuery += ` AND s.school_id = $${countParamIndex}`
      countParams.push(schoolId)
      countParamIndex++
    }

    if (classId) {
      countQuery += ` AND s.class_id = $${countParamIndex}`
      countParams.push(classId)
    }

    const countResult = await query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].count)

    return NextResponse.json({
      students: result.rows,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    })

  } catch (error) {
    console.error('Students API error:', error)
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
    if (!decoded || (decoded.role !== 'admin' && decoded.role !== 'teacher')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      parent_name,
      parent_phone,
      parent_email,
      class_id,
      school_id,
      student_id,
      admission_date
    } = body

    const result = await query(`
      INSERT INTO students (
        first_name, last_name, email, phone, date_of_birth, address,
        parent_name, parent_phone, parent_email, class_id, school_id,
        student_id, admission_date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *
    `, [
      first_name, last_name, email, phone, date_of_birth, address,
      parent_name, parent_phone, parent_email, class_id, school_id,
      student_id, admission_date
    ])

    return NextResponse.json({ student: result.rows[0] })

  } catch (error) {
    console.error('Create student error:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}
