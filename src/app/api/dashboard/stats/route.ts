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

    // Get basic counts
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM students WHERE 1=1 ${schoolId ? `AND school_id = ${schoolId}` : ''}) as total_students,
        (SELECT COUNT(*) FROM teachers WHERE 1=1 ${schoolId ? `AND school_id = ${schoolId}` : ''}) as total_teachers,
        (SELECT COUNT(*) FROM classes WHERE 1=1 ${schoolId ? `AND school_id = ${schoolId}` : ''}) as total_classes,
        (SELECT COUNT(*) FROM schools WHERE 1=1 ${schoolId ? `AND id = ${schoolId}` : ''}) as total_schools
    `

    const statsResult = await query(statsQuery)

    // Get attendance rate for today
    const attendanceQuery = `
      SELECT 
        COUNT(*) as total_attendance,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
        ROUND(
          (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)), 2
        ) as attendance_rate
      FROM attendance a
      ${schoolId ? `LEFT JOIN students s ON a.student_id = s.id WHERE s.school_id = ${schoolId} AND` : 'WHERE'} 
      a.date = CURRENT_DATE
    `

    const attendanceResult = await query(attendanceQuery)

    // Get recent grades average
    const gradesQuery = `
      SELECT 
        AVG(g.score) as average_grade,
        COUNT(*) as total_grades
      FROM grades g
      LEFT JOIN assignments a ON g.assignment_id = a.id
      LEFT JOIN classes c ON a.class_id = c.id
      WHERE g.created_at >= CURRENT_DATE - INTERVAL '30 days'
      ${schoolId ? `AND c.school_id = ${schoolId}` : ''}
    `

    const gradesResult = await query(gradesQuery)

    return NextResponse.json({
      stats: {
        ...statsResult.rows[0],
        ...attendanceResult.rows[0],
        average_grade: parseFloat(gradesResult.rows[0]?.average_grade) || 0,
        total_grades: parseInt(gradesResult.rows[0]?.total_grades) || 0
      }
    })

  } catch (error) {
    console.error('Dashboard stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
