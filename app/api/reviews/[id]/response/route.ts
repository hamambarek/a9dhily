import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const responseSchema = z.object({
  response: z.string().min(1).max(1000)
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviewId = params.id
    const body = await request.json()
    const validatedData = responseSchema.parse(body)

    // Get the review
    const review = await db.review.findUnique({
      where: { id: reviewId },
      include: { product: true }
    })

    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 })
    }

    // Check if the user is the seller being reviewed
    if (review.reviewedId !== session.user.id) {
      return NextResponse.json({ error: 'You can only respond to reviews about you' }, { status: 403 })
    }

    // Check if seller has already responded
    if (review.sellerResponse) {
      return NextResponse.json({ error: 'You have already responded to this review' }, { status: 400 })
    }

    // Update the review with seller response
    const updatedReview = await db.review.update({
      where: { id: reviewId },
      data: { sellerResponse: validatedData.response },
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

    return NextResponse.json({ success: true, review: updatedReview })
  } catch (error) {
    console.error('Error adding seller response:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
