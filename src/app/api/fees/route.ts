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
    const status = searchParams.get('status')
    const termId = searchParams.get('term_id')

    let queryText = `
      SELECT 
        f.*,
        s.first_name as student_first_name,
        s.last_name as student_last_name,
        s.student_id,
        c.name as class_name,
        t.name as term_name
      FROM fees f
      LEFT JOIN students s ON f.student_id = s.id
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN academic_terms t ON f.term_id = t.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (studentId) {
      queryText += ` AND f.student_id = $${paramIndex}`
      params.push(studentId)
      paramIndex++
    }

    if (status) {
      queryText += ` AND f.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (termId) {
      queryText += ` AND f.term_id = $${paramIndex}`
      params.push(termId)
      paramIndex++
    }

    queryText += ` ORDER BY f.due_date DESC`

    const result = await query(queryText, params)

    // Get fees summary
    const summaryQuery = `
      SELECT 
        COUNT(*) as total_fees,
        COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'overdue' THEN 1 END) as overdue_count,
        SUM(amount) as total_amount,
        SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_amount,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount
      FROM fees f
      WHERE 1=1
      ${studentId ? ` AND f.student_id = ${studentId}` : ''}
      ${status ? ` AND f.status = '${status}'` : ''}
      ${termId ? ` AND f.term_id = ${termId}` : ''}
    `

    const summaryResult = await query(summaryQuery)

    return NextResponse.json({
      fees: result.rows,
      summary: summaryResult.rows[0]
    })

  } catch (error) {
    console.error('Fees API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
