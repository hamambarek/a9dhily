import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const result = verifyWebhookSignature(body, signature)
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    const event = result.event

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break

      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object)
        break

      case 'charge.failed':
        await handleChargeFailed(event.data.object)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    const { productId, buyerId, sellerId } = paymentIntent.metadata

    // Update transaction status
    await db.transaction.updateMany({
      where: {
        paymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    })

    // Update product status to sold
    await db.product.update({
      where: { id: productId },
      data: { isSold: true },
    })

    // Create notification for seller
    await db.notification.create({
      data: {
        userId: sellerId,
        type: 'PAYMENT_RECEIVED',
        title: 'Payment Received',
        message: `Payment received for ${paymentIntent.metadata.productName}`,
        data: {
          productId,
          buyerId,
          amount: paymentIntent.amount / 100,
        },
      },
    })

    console.log(`Payment succeeded for transaction: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    // Update transaction status
    await db.transaction.updateMany({
      where: {
        paymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
      data: {
        status: 'FAILED',
        failedAt: new Date(),
      },
    })

    // Create notification for buyer
    const transaction = await db.transaction.findFirst({
      where: { paymentIntentId: paymentIntent.id },
      include: { product: true },
    })

    if (transaction) {
      await db.notification.create({
        data: {
          userId: transaction.buyerId,
          type: 'PAYMENT_RECEIVED', // We'll reuse this type for now
          title: 'Payment Failed',
          message: `Payment failed for ${transaction.product.name}`,
          data: {
            productId: transaction.productId,
            amount: transaction.amount,
          },
        },
      })
    }

    console.log(`Payment failed for transaction: ${paymentIntent.id}`)
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

async function handleChargeSucceeded(charge: any) {
  try {
    console.log(`Charge succeeded: ${charge.id}`)
    // Additional charge-specific logic can be added here
  } catch (error) {
    console.error('Error handling charge succeeded:', error)
  }
}

async function handleChargeFailed(charge: any) {
  try {
    console.log(`Charge failed: ${charge.id}`)
    // Additional charge-specific logic can be added here
  } catch (error) {
    console.error('Error handling charge failed:', error)
  }
}
