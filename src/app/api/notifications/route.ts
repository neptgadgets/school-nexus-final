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
    const limit = searchParams.get('limit') || '50'
    const offset = searchParams.get('offset') || '0'
    const unreadOnly = searchParams.get('unread_only') === 'true'

    let queryText = `
      SELECT 
        n.*,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE 1=1
    `
    
    const params: any[] = []
    let paramIndex = 1

    if (unreadOnly) {
      queryText += ` AND n.read_at IS NULL`
    }

    queryText += `
      ORDER BY n.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `
    params.push(parseInt(limit), parseInt(offset))

    const result = await query(queryText, params)

    return NextResponse.json({
      notifications: result.rows
    })

  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
