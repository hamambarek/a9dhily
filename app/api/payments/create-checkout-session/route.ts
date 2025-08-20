import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
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
    const { amount, productId, sellerId, productName } = body

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

    // Check if buyer is not the seller
    if (session.user.id === sellerId) {
      return NextResponse.json(
        { error: 'Cannot buy your own product' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName || 'Product Purchase',
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/payment/cancel`,
      metadata: {
        productId,
        buyerId: session.user.id,
        sellerId,
        productName: productName || 'Product Purchase',
      },
    })

    // Create transaction record
    const transaction = await db.transaction.create({
      data: {
        productId,
        buyerId: session.user.id,
        sellerId,
        amount,
        platformFee: 0, // No platform fee for testing
        status: 'PENDING',
        paymentIntentId: checkoutSession.payment_intent as string,
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      transactionId: transaction.id,
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
