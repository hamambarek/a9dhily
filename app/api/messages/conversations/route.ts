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

    // Get all conversations for the user using Prisma ORM
    const userMessages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            images: true
          }
        },
        transaction: {
          select: {
            id: true
          }
        },
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            isVerified: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            isVerified: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group messages by conversation
    const conversationMap = new Map()
    
    for (const message of userMessages) {
      const conversationId = message.conversationId
      
      if (!conversationMap.has(conversationId)) {
        const otherUser = message.senderId === userId ? message.receiver : message.sender
        
        conversationMap.set(conversationId, {
          conversationId,
          productId: message.productId,
          transactionId: message.transactionId,
          productTitle: message.product?.title || null,
          productImages: message.product?.images || [],
          otherUserId: otherUser.id,
          otherUserName: otherUser.name,
          otherUserImage: otherUser.image,
          otherUserVerified: otherUser.isVerified,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: 0 // Will be calculated below
        })
      }
    }

    // Calculate unread counts for each conversation
    const conversations = Array.from(conversationMap.values())
    
    for (const conversation of conversations) {
      const unreadCount = await db.message.count({
        where: {
          conversationId: conversation.conversationId,
          receiverId: userId,
          isRead: false
        }
      })
      conversation.unreadCount = unreadCount
    }

    // Sort by last message time
    conversations.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime())

    return NextResponse.json({ success: true, conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
