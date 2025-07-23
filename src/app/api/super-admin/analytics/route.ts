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
    if (!decoded || decoded.role !== 'super_admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get overall system statistics
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM schools WHERE status = 'active') as total_schools,
        (SELECT COUNT(*) FROM students) as total_students,
        (SELECT COUNT(*) FROM teachers) as total_teachers,
        (SELECT COUNT(*) FROM administrators) as total_administrators,
        (SELECT COUNT(*) FROM classes) as total_classes
    `

    const statsResult = await query(statsQuery)

    // Get monthly growth data
    const growthQuery = `
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as new_schools
      FROM schools 
      WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
      LIMIT 12
    `

    const growthResult = await query(growthQuery)

    // Get schools by subscription plan
    const subscriptionQuery = `
      SELECT 
        subscription_plan,
        COUNT(*) as count
      FROM schools
      WHERE status = 'active'
      GROUP BY subscription_plan
    `

    const subscriptionResult = await query(subscriptionQuery)

    // Get recent activity
    const activityQuery = `
      SELECT 
        'school' as type,
        name as title,
        'New school registered' as description,
        created_at
      FROM schools
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 10
    `

    const activityResult = await query(activityQuery)

    return NextResponse.json({
      stats: statsResult.rows[0],
      growth: growthResult.rows,
      subscriptions: subscriptionResult.rows,
      recentActivity: activityResult.rows
    })

  } catch (error) {
    console.error('Super admin analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
