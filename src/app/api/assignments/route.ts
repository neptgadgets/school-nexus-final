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
    const classId = searchParams.get('class_id')
    const subjectId = searchParams.get('subject_id')
    const type = searchParams.get('type')

    let queryText = `
      SELECT 
        a.*,
        c.name as class_name,
        c.level as class_level,
        s.name as subject_name,
        COUNT(g.id) as submissions_count,
        AVG(g.score) as average_score
      FROM assignments a
      LEFT JOIN classes c ON a.class_id = c.id
      LEFT JOIN subjects s ON a.subject_id = s.id
      LEFT JOIN grades g ON g.assignment_id = a.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (classId) {
      queryText += ` AND a.class_id = $${paramIndex}`
      params.push(classId)
      paramIndex++
    }

    if (subjectId) {
      queryText += ` AND a.subject_id = $${paramIndex}`
      params.push(subjectId)
      paramIndex++
    }

    if (type) {
      queryText += ` AND a.type = $${paramIndex}`
      params.push(type)
      paramIndex++
    }

    queryText += `
      GROUP BY a.id, c.name, c.level, s.name
      ORDER BY a.due_date DESC
    `

    const result = await query(queryText, params)

    return NextResponse.json({
      assignments: result.rows
    })

  } catch (error) {
    console.error('Assignments API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
