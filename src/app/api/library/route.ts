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
    const type = searchParams.get('type') // 'books' or 'transactions'
    const limit = searchParams.get('limit') || '50'

    if (type === 'transactions') {
      const transactionsQuery = `
        SELECT 
          lt.*,
          lb.title as book_title,
          lb.author,
          s.first_name as student_first_name,
          s.last_name as student_last_name,
          s.student_id
        FROM library_transactions lt
        LEFT JOIN library_books lb ON lt.book_id = lb.id
        LEFT JOIN students s ON lt.student_id = s.id
        ORDER BY lt.borrowed_date DESC
        LIMIT $1
      `
      
      const result = await query(transactionsQuery, [parseInt(limit)])
      
      return NextResponse.json({
        transactions: result.rows
      })
    } else {
      // Default to books
      const booksQuery = `
        SELECT 
          lb.*,
          COUNT(lt.id) as total_borrows,
          COUNT(CASE WHEN lt.status = 'borrowed' THEN 1 END) as current_borrows
        FROM library_books lb
        LEFT JOIN library_transactions lt ON lb.id = lt.book_id
        GROUP BY lb.id
        ORDER BY lb.title
        LIMIT $1
      `
      
      const result = await query(booksQuery, [parseInt(limit)])
      
      return NextResponse.json({
        books: result.rows
      })
    }

  } catch (error) {
    console.error('Library API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
