import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Check database connectivity
    await db.$queryRaw`SELECT 1`
    
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'connected',
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version,
      },
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    
    const healthCheck = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: 'disconnected',
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    }

    return NextResponse.json(healthCheck, { status: 503 })
  }
}
