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
    const classId = searchParams.get('class_id')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')

    let queryText = `
      SELECT 
        a.*,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.student_id,
        c.name as class_name,
        c.level as class_level
      FROM attendance a
      LEFT JOIN students s ON a.student_id = s.id
      LEFT JOIN classes c ON a.class_id = c.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (studentId) {
      queryText += ` AND a.student_id = $${paramIndex}`
      params.push(studentId)
      paramIndex++
    }

    if (classId) {
      queryText += ` AND a.class_id = $${paramIndex}`
      params.push(classId)
      paramIndex++
    }

    if (dateFrom) {
      queryText += ` AND a.date >= $${paramIndex}`
      params.push(dateFrom)
      paramIndex++
    }

    if (dateTo) {
      queryText += ` AND a.date <= $${paramIndex}`
      params.push(dateTo)
      paramIndex++
    }

    queryText += ` ORDER BY a.date DESC, s.last_name, s.first_name`

    const result = await query(queryText, params)

    // Get attendance summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
        ROUND(
          (COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)), 2
        ) as attendance_rate
      FROM attendance a
      WHERE 1=1
      ${studentId ? ` AND a.student_id = ${studentId}` : ''}
      ${classId ? ` AND a.class_id = ${classId}` : ''}
      ${dateFrom ? ` AND a.date >= '${dateFrom}'` : ''}
      ${dateTo ? ` AND a.date <= '${dateTo}'` : ''}
    `

    const summaryResult = await query(summaryQuery)

    return NextResponse.json({
      attendance: result.rows,
      summary: summaryResult.rows[0]
    })

  } catch (error) {
    console.error('Attendance API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
