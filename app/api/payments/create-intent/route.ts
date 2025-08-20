import { NextRequest, NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'
import { createPaymentIntent } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerAuthSession({
      req: request,
      res: NextResponse.next(),
    })

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

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if seller matches
    if (product.sellerId !== sellerId) {
      return NextResponse.json(
        { error: 'Invalid seller' },
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

    // Create payment intent
    const result = await createPaymentIntent(amount, {
      productId,
      buyerId: session.user.id,
      sellerId,
      productName: product.name,
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
