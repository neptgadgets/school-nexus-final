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

    // Get billing summary
    const billingQuery = `
      SELECT 
        COUNT(*) as total_schools,
        COUNT(CASE WHEN subscription_plan = 'basic' THEN 1 END) as basic_plans,
        COUNT(CASE WHEN subscription_plan = 'premium' THEN 1 END) as premium_plans,
        COUNT(CASE WHEN subscription_plan = 'enterprise' THEN 1 END) as enterprise_plans,
        SUM(CASE 
          WHEN subscription_plan = 'basic' THEN 29
          WHEN subscription_plan = 'premium' THEN 59
          WHEN subscription_plan = 'enterprise' THEN 99
          ELSE 0
        END) as monthly_revenue
      FROM schools
      WHERE status = 'active'
    `

    const billingResult = await query(billingQuery)

    // Get recent transactions (mock data for now)
    const transactions = [
      {
        id: '1',
        school_name: 'Greenwood High School',
        amount: 59.00,
        plan: 'premium',
        status: 'paid',
        date: new Date().toISOString(),
        invoice_id: 'INV-2024-001'
      },
      {
        id: '2',
        school_name: 'Creamland NPS',
        amount: 29.00,
        plan: 'basic',
        status: 'paid',
        date: new Date(Date.now() - 86400000).toISOString(),
        invoice_id: 'INV-2024-002'
      }
    ]

    return NextResponse.json({
      billing: billingResult.rows[0],
      transactions
    })

  } catch (error) {
    console.error('Super admin billing API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
