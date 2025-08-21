import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    // Get comprehensive platform statistics
    const [
      totalUsers,
      totalProducts,
      totalTransactions,
      activeUsers,
      pendingVerifications,
      completedTransactions,
      totalRevenue
    ] = await Promise.all([
      db.user.count(),
      db.product.count(),
      db.transaction.count(),
      db.user.count({
        where: {
          lastActive: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      }),
      db.verificationRequest.count({
        where: { status: 'PENDING' }
      }),
      db.transaction.count({
        where: { status: 'COMPLETED' }
      }),
      db.transaction.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true }
      })
    ])

    // Get recent activity (last 10 activities)
    const recentActivity = await db.transaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { name: true } },
        seller: { select: { name: true } },
        product: { select: { title: true } }
      }
    })

    // Get recent user registrations as activity if no transactions
    let recentUserActivity: any[] = []
    if (recentActivity.length === 0) {
      recentUserActivity = await db.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      })
    }

    // Get top performing products
    const topProducts = await db.product.findMany({
      take: 10,
      orderBy: { viewCount: 'desc' },
      include: {
        _count: {
          select: { transactions: true }
        },
        seller: { select: { name: true } }
      }
    })

    // Get recent products if no products with views
    let recentProducts: any[] = []
    if (topProducts.length === 0) {
      recentProducts = await db.product.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { transactions: true }
          },
          seller: { select: { name: true } }
        }
      })
    }

    // Get user growth data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const userGrowth = await db.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: { id: true }
    })

    // Get revenue data (last 30 days)
    const revenueData = await db.transaction.groupBy({
      by: ['createdAt'],
      where: {
        status: 'COMPLETED',
        createdAt: { gte: thirtyDaysAgo }
      },
      _sum: { amount: true }
    })

    // Format recent activity
    let formattedActivity: any[] = []
    if (recentActivity.length > 0) {
      formattedActivity = recentActivity.map(transaction => ({
        type: 'transaction',
        description: `${transaction.buyer.name} purchased ${transaction.product.title} from ${transaction.seller.name}`,
        timestamp: transaction.createdAt,
        amount: transaction.amount
      }))
    } else if (recentUserActivity.length > 0) {
      formattedActivity = recentUserActivity.map(user => ({
        type: 'user',
        description: `${user.name} joined the platform`,
        timestamp: user.createdAt,
        amount: null
      }))
    }

    // Format top products
    let formattedTopProducts: any[] = []
    if (topProducts.length > 0) {
      formattedTopProducts = topProducts.map(product => ({
        id: product.id,
        title: product.title,
        revenue: product._count.transactions * Number(product.price),
        sales: product._count.transactions,
        views: product.viewCount,
        seller: product.seller.name
      }))
    } else if (recentProducts.length > 0) {
      formattedTopProducts = recentProducts.map(product => ({
        id: product.id,
        title: product.title,
        revenue: 0,
        sales: 0,
        views: product.viewCount || 0,
        seller: product.seller.name
      }))
    }

    const stats = {
      totalUsers,
      totalProducts,
      totalTransactions,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeUsers,
      pendingVerifications,
      completedTransactions,
      recentActivity: formattedActivity,
      topProducts: formattedTopProducts,
      userGrowth: userGrowth.map(item => ({
        date: item.createdAt,
        count: item._count.id
      })),
      revenueData: revenueData.map(item => ({
        date: item.createdAt,
        revenue: item._sum.amount || 0
      }))
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
