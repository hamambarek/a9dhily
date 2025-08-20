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

    // Get user's products stats
    const [totalProducts, activeProducts, totalViews] = await Promise.all([
      db.product.count({
        where: { sellerId: userId }
      }),
      db.product.count({
        where: { sellerId: userId, isActive: true, isSold: false }
      }),
      db.product.aggregate({
        where: { sellerId: userId },
        _sum: { viewCount: true }
      })
    ])

    // Get user's sales stats (as seller)
    const salesData = await db.transaction.aggregate({
      where: { 
        sellerId: userId,
        status: 'PAID'
      },
      _sum: { amount: true }
    })

    // Get user's purchases stats (as buyer)
    const [totalPurchases, purchaseData] = await Promise.all([
      db.transaction.count({
        where: { buyerId: userId }
      }),
      db.transaction.aggregate({
        where: { 
          buyerId: userId,
          status: 'PAID'
        },
        _sum: { amount: true }
      })
    ])

    // Get total favorites (placeholder for now)
    const totalFavorites = 0

    const stats = {
      totalProducts: totalProducts,
      activeProducts: activeProducts,
      totalSales: salesData._sum.amount || 0,
      totalViews: totalViews._sum.viewCount || 0,
      totalPurchases: totalPurchases,
      totalFavorites: totalFavorites
    }

    return NextResponse.json({ success: true, stats })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
