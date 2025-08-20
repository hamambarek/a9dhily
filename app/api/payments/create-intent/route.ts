import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createPaymentIntent } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { amount, productId, sellerId } = body

    // Validate required fields
    if (!amount || !productId || !sellerId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, productId, sellerId' },
        { status: 400 }
      )
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // For testing purposes, we'll skip product validation since we're using mock data
    // In production, you would validate the product exists and seller matches
    
    // Check if buyer is not the seller (for testing)
    if (session.user.id === sellerId) {
      return NextResponse.json(
        { error: 'Cannot buy your own product' },
        { status: 400 }
      )
    }

    // Create payment intent
    const result = await createPaymentIntent(amount, {
      productId,
      buyerId: session.user.id,
      sellerId,
      productName: 'Test Product', // Mock product name for testing
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Create transaction record
    const transaction = await db.transaction.create({
      data: {
        productId,
        buyerId: session.user.id,
        sellerId,
        amount,
        status: 'PENDING',
        paymentIntentId: result.paymentIntentId!,
      },
    })

    return NextResponse.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
      transactionId: transaction.id,
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
