import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createReviewSchema = z.object({
  productId: z.string(),
  transactionId: z.string(),
  reviewedId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1).max(1000).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    // Check if user has already reviewed this transaction
    const existingReview = await db.review.findUnique({
      where: { transactionId: validatedData.transactionId }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this transaction' }, { status: 400 })
    }

    // Verify the transaction belongs to the user and is completed
    const transaction = await db.transaction.findUnique({
      where: { id: validatedData.transactionId },
      include: { product: true }
    })

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if (transaction.buyerId !== session.user.id) {
      return NextResponse.json({ error: 'You can only review transactions you purchased' }, { status: 403 })
    }

    if (transaction.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'You can only review completed transactions' }, { status: 400 })
    }

    // Create the review
    const review = await db.review.create({
      data: {
        productId: validatedData.productId,
        transactionId: validatedData.transactionId,
        reviewerId: session.user.id,
        reviewedId: validatedData.reviewedId,
        rating: validatedData.rating,
        comment: validatedData.comment,
        isVerified: true, // Verified purchase review
      },
      include: {
        reviewer: {
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

    // Update seller's average rating and total reviews
    await updateSellerRating(validatedData.reviewedId)

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Error creating review:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const sellerId = searchParams.get('sellerId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const where: any = { isPublic: true }
    
    if (productId) {
      where.productId = productId
    }
    
    if (sellerId) {
      where.reviewedId = sellerId
    }

    const [reviews, total] = await Promise.all([
      db.review.findMany({
        where,
        include: {
          reviewer: {
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
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      db.review.count({ where })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function updateSellerRating(sellerId: string) {
  try {
    const reviews = await db.review.findMany({
      where: { reviewedId: sellerId, isPublic: true },
      select: { rating: true }
    })

    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : null

    await db.user.update({
      where: { id: sellerId },
      data: {
        averageRating: averageRating,
        totalReviews: totalReviews
      }
    })
  } catch (error) {
    console.error('Error updating seller rating:', error)
  }
}
