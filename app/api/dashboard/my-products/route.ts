import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') // all, active, sold, inactive
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = { sellerId: session.user.id }
    
    if (status === 'active') {
      where.isActive = true
      where.isSold = false
    } else if (status === 'sold') {
      where.isSold = true
    } else if (status === 'inactive') {
      where.isActive = false
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          _count: {
            select: {
              transactions: true,
              reviews: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      db.product.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching user products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
