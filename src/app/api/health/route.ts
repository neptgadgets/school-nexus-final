import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase-client'

export async function GET() {
  try {
    const startTime = Date.now()
    
    // Check database connection
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
      .from('schools')
      .select('id')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw new Error(`Database connection failed: ${error.message}`)
    }
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: 'connected',
        responseTime: `${responseTime}ms`
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0'
    }, { status: 503 })
  }
}

// Also handle HEAD requests for load balancer health checks
export async function HEAD() {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase
      .from('schools')
      .select('id')
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      return new Response(null, { status: 503 })
    }
    
    return new Response(null, { status: 200 })
  } catch (error) {
    return new Response(null, { status: 503 })
  }
}
