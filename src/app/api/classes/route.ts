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
    const teacherId = searchParams.get('teacher_id')

    let queryText = `
      SELECT 
        c.*,
        t.first_name as teacher_first_name,
        t.last_name as teacher_last_name,
        sc.name as school_name,
        COUNT(s.id) as student_count,
        COUNT(a.id) as assignment_count
      FROM classes c
      LEFT JOIN teachers t ON c.teacher_id = t.id
      LEFT JOIN schools sc ON c.school_id = sc.id
      LEFT JOIN students s ON s.class_id = c.id
      LEFT JOIN assignments a ON a.class_id = c.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (schoolId) {
      queryText += ` AND c.school_id = $${paramIndex}`
      params.push(schoolId)
      paramIndex++
    }

    if (teacherId) {
      queryText += ` AND c.teacher_id = $${paramIndex}`
      params.push(teacherId)
      paramIndex++
    }

    queryText += `
      GROUP BY c.id, t.first_name, t.last_name, sc.name
      ORDER BY c.level, c.name
    `

    const result = await query(queryText, params)

    return NextResponse.json({
      classes: result.rows
    })

  } catch (error) {
    console.error('Classes API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
