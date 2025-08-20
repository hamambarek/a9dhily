import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const products = await db.product.findMany({
      where: { sellerId: userId },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        viewCount: true,
        createdAt: true,
        isActive: true,
        isSold: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return NextResponse.json({ success: true, products })
  } catch (error) {
    console.error('Error fetching recent products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
