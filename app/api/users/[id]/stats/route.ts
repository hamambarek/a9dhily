import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    // Get user stats
    const [user, productCount, salesCount, purchaseCount, reviewCount] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          averageRating: true,
          totalReviews: true,
        }
      }),
      db.product.count({
        where: { sellerId: userId, isActive: true }
      }),
      db.transaction.count({
        where: { 
          sellerId: userId,
          status: { in: ['COMPLETED', 'DELIVERED'] }
        }
      }),
      db.transaction.count({
        where: { 
          buyerId: userId,
          status: { in: ['COMPLETED', 'DELIVERED'] }
        }
      }),
      db.review.count({
        where: { reviewedId: userId, isPublic: true }
      })
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const stats = {
      totalProducts: productCount,
      totalSales: salesCount,
      totalPurchases: purchaseCount,
      totalReviews: reviewCount,
      averageRating: user.averageRating ? Number(user.averageRating) : undefined
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
