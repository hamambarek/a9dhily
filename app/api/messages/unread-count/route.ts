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

    // Get unread message count for the current user
    const unreadCount = await db.message.count({
      where: {
        receiverId: userId,
        senderId: {
          not: userId
        },
        isRead: false
      }
    })

    return NextResponse.json({
      success: true,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching unread message count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
