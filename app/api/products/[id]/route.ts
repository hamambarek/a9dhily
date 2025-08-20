import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            isVerified: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Increment view count
    await db.product.update({
      where: { id: productId },
      data: { viewCount: { increment: 1 } },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.id

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists and user owns it
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { sellerId: true }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'You can only delete your own products' }, { status: 403 })
    }

    // Delete the product
    await db.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const updateProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0.01),
  currency: z.string().default('USD'),
  category: z.string(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR']),
  location: z.string(),
  country: z.string(),
  city: z.string(),
  images: z.array(z.string()),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.id

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Check if product exists and user owns it
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
      select: { sellerId: true }
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    if (existingProduct.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'You can only edit your own products' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateProductSchema.parse(body)

    // Update the product
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: validatedData,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true,
            isVerified: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
