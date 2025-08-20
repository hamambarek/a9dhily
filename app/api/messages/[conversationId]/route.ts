import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = params
    const userId = session.user.id

    // Check if user is part of this conversation
    const conversationCheck = await db.message.findFirst({
      where: {
        conversationId,
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    })

    if (!conversationCheck) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Get messages for this conversation
    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
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
      orderBy: { createdAt: 'asc' }
    })

    // Mark messages as read for the current user
    await db.message.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({ success: true, messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = params
    const userId = session.user.id
    const body = await request.json()
    const { content, receiverId, messageType = 'TEXT' } = body

    if (!content || !receiverId) {
      return NextResponse.json({ error: 'Content and receiverId are required' }, { status: 400 })
    }

    // Check if user is part of this conversation
    const conversationCheck = await db.message.findFirst({
      where: {
        conversationId,
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      }
    })

    if (!conversationCheck) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Create new message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        receiverId,
        content,
        messageType
      },
      include: {
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
      }
    })

    return NextResponse.json({ success: true, message })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
