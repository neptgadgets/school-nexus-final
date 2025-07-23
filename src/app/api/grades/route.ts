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
    const studentId = searchParams.get('student_id')
    const assignmentId = searchParams.get('assignment_id')
    const classId = searchParams.get('class_id')

    let queryText = `
      SELECT 
        g.*,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.student_id,
        a.title as assignment_title,
        a.max_score as assignment_max_score,
        a.type as assignment_type,
        c.name as class_name
      FROM grades g
      LEFT JOIN students s ON g.student_id = s.id
      LEFT JOIN assignments a ON g.assignment_id = a.id
      LEFT JOIN classes c ON a.class_id = c.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (studentId) {
      queryText += ` AND g.student_id = $${paramIndex}`
      params.push(studentId)
      paramIndex++
    }

    if (assignmentId) {
      queryText += ` AND g.assignment_id = $${paramIndex}`
      params.push(assignmentId)
      paramIndex++
    }

    if (classId) {
      queryText += ` AND a.class_id = $${paramIndex}`
      params.push(classId)
      paramIndex++
    }

    queryText += ` ORDER BY g.created_at DESC`

    const result = await query(queryText, params)

    // Get grade statistics
    const statsQuery = `
      SELECT 
        AVG(g.score) as average_score,
        MIN(g.score) as min_score,
        MAX(g.score) as max_score,
        COUNT(*) as total_grades,
        COUNT(CASE WHEN g.score >= 90 THEN 1 END) as a_grades,
        COUNT(CASE WHEN g.score >= 80 AND g.score < 90 THEN 1 END) as b_grades,
        COUNT(CASE WHEN g.score >= 70 AND g.score < 80 THEN 1 END) as c_grades,
        COUNT(CASE WHEN g.score >= 60 AND g.score < 70 THEN 1 END) as d_grades,
        COUNT(CASE WHEN g.score < 60 THEN 1 END) as f_grades
      FROM grades g
      LEFT JOIN assignments a ON g.assignment_id = a.id
      WHERE 1=1
      ${studentId ? ` AND g.student_id = ${studentId}` : ''}
      ${assignmentId ? ` AND g.assignment_id = ${assignmentId}` : ''}
      ${classId ? ` AND a.class_id = ${classId}` : ''}
    `

    const statsResult = await query(statsQuery)

    return NextResponse.json({
      grades: result.rows,
      statistics: statsResult.rows[0]
    })

  } catch (error) {
    console.error('Grades API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
