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
    const reportType = searchParams.get('type') || 'overview'

    if (reportType === 'schools') {
      // School performance report
      const schoolsQuery = `
        SELECT 
          s.id,
          s.name,
          s.subscription_plan,
          COUNT(DISTINCT st.id) as total_students,
          COUNT(DISTINCT t.id) as total_teachers,
          COUNT(DISTINCT c.id) as total_classes,
          AVG(g.score) as average_grade,
          COUNT(DISTINCT CASE WHEN a.date = CURRENT_DATE AND a.status = 'present' THEN a.student_id END) as present_today,
          COUNT(DISTINCT CASE WHEN a.date = CURRENT_DATE THEN a.student_id END) as total_attendance_today
        FROM schools s
        LEFT JOIN students st ON s.id = st.school_id
        LEFT JOIN teachers t ON s.id = t.school_id
        LEFT JOIN classes c ON s.id = c.school_id
        LEFT JOIN grades g ON g.assignment_id IN (
          SELECT a.id FROM assignments a 
          JOIN classes cl ON a.class_id = cl.id 
          WHERE cl.school_id = s.id
        )
        LEFT JOIN attendance a ON a.student_id = st.id
        WHERE s.status = 'active'
        GROUP BY s.id, s.name, s.subscription_plan
        ORDER BY s.name
      `

      const result = await query(schoolsQuery)
      return NextResponse.json({ schools: result.rows })

    } else if (reportType === 'usage') {
      // System usage report
      const usageQuery = `
        SELECT 
          DATE_TRUNC('day', created_at) as date,
          COUNT(*) as new_users
        FROM users
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE_TRUNC('day', created_at)
        ORDER BY date DESC
      `

      const result = await query(usageQuery)
      return NextResponse.json({ usage: result.rows })

    } else {
      // Overview report
      const overviewQuery = `
        SELECT 
          (SELECT COUNT(*) FROM schools WHERE status = 'active') as active_schools,
          (SELECT COUNT(*) FROM schools WHERE status = 'inactive') as inactive_schools,
          (SELECT COUNT(*) FROM students) as total_students,
          (SELECT COUNT(*) FROM teachers) as total_teachers,
          (SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_month,
          (SELECT COUNT(*) FROM schools WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_schools_month
      `

      const result = await query(overviewQuery)
      return NextResponse.json({ overview: result.rows[0] })
    }

  } catch (error) {
    console.error('Super admin reports API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
