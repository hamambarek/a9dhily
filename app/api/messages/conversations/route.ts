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

    // Get all conversations for the user
    const conversations = await db.$queryRaw`
      SELECT DISTINCT 
        m.conversation_id as "conversationId",
        m.product_id as "productId",
        m.transaction_id as "transactionId",
        p.title as "productTitle",
        p.images as "productImages",
        u.id as "otherUserId",
        u.name as "otherUserName",
        u.image as "otherUserImage",
        u.is_verified as "otherUserVerified",
        (
          SELECT content 
          FROM "Message" 
          WHERE conversation_id = m.conversation_id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as "lastMessage",
        (
          SELECT created_at 
          FROM "Message" 
          WHERE conversation_id = m.conversation_id 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as "lastMessageTime",
        (
          SELECT COUNT(*) 
          FROM "Message" 
          WHERE conversation_id = m.conversation_id 
          AND receiver_id = ${userId} 
          AND is_read = false
        ) as "unreadCount"
      FROM "Message" m
      LEFT JOIN "Product" p ON m.product_id = p.id
      LEFT JOIN "User" u ON (
        CASE 
          WHEN m.sender_id = ${userId} THEN m.receiver_id = u.id
          ELSE m.sender_id = u.id
        END
      )
      WHERE m.sender_id = ${userId} OR m.receiver_id = ${userId}
      ORDER BY "lastMessageTime" DESC
    `

    return NextResponse.json({ success: true, conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
