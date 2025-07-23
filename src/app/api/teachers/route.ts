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
    const subjectId = searchParams.get('subject_id')
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'

    let queryText = `
      SELECT 
        t.*,
        s.name as subject_name,
        sc.name as school_name,
        COUNT(DISTINCT c.id) as classes_count,
        COUNT(DISTINCT st.id) as students_count
      FROM teachers t
      LEFT JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN schools sc ON t.school_id = sc.id
      LEFT JOIN classes c ON c.teacher_id = t.id
      LEFT JOIN students st ON st.class_id = c.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (schoolId) {
      queryText += ` AND t.school_id = $${paramIndex}`
      params.push(schoolId)
      paramIndex++
    }

    if (subjectId) {
      queryText += ` AND t.subject_id = $${paramIndex}`
      params.push(subjectId)
      paramIndex++
    }

    queryText += `
      GROUP BY t.id, s.name, sc.name
      ORDER BY t.last_name, t.first_name
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(parseInt(limit), parseInt(offset))

    const result = await query(queryText, params)

    return NextResponse.json({
      teachers: result.rows
    })

  } catch (error) {
    console.error('Teachers API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
