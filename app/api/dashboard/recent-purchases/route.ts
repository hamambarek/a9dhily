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

    const userId = session.user.id

    const purchases = await db.transaction.findMany({
      where: { buyerId: userId },
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        product: {
          select: {
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Transform the data to match the interface
    const transformedPurchases = purchases.map(purchase => ({
      id: purchase.id,
      productTitle: purchase.product.title,
      amount: purchase.amount,
      currency: 'USD', // Default currency for now
      status: purchase.status,
      createdAt: purchase.createdAt.toISOString()
    }))

    return NextResponse.json({ success: true, purchases: transformedPurchases })
  } catch (error) {
    console.error('Error fetching recent purchases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
