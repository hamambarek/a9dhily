import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const startConversationSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1),
  productId: z.string().optional(),
  transactionId: z.string().optional(),
  messageType: z.enum(['TEXT', 'IMAGE', 'FILE', 'SYSTEM']).default('TEXT')
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const validatedData = startConversationSchema.parse(body)

    // Check if receiver exists
    const receiver = await db.user.findUnique({
      where: { id: validatedData.receiverId },
      select: { id: true, name: true, image: true, isVerified: true }
    })

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 })
    }

    // Check if there's already a conversation between these users
    const existingConversation = await db.message.findFirst({
      where: {
        OR: [
          {
            senderId: userId,
            receiverId: validatedData.receiverId
          },
          {
            senderId: validatedData.receiverId,
            receiverId: userId
          }
        ],
        productId: validatedData.productId || null,
        transactionId: validatedData.transactionId || null
      },
      select: { conversationId: true }
    })

    let conversationId = existingConversation?.conversationId

    // If no existing conversation, create one
    if (!conversationId) {
      conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Create the message
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        receiverId: validatedData.receiverId,
        content: validatedData.content,
        messageType: validatedData.messageType,
        productId: validatedData.productId,
        transactionId: validatedData.transactionId
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
        },
        product: {
          select: {
            id: true,
            title: true,
            images: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      message,
      conversationId,
      isNewConversation: !existingConversation
    })
  } catch (error) {
    console.error('Error starting conversation:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
