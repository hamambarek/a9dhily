import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createProductSchema = z.object({
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
    
    // Validate input
    const validatedData = createProductSchema.parse(body)

    // Create product
    const product = await db.product.create({
      data: {
        ...validatedData,
        sellerId: session.user.id,
        // For now, we'll store images as base64 strings
        // In production, you'd upload to S3 and store URLs
        images: validatedData.images,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            country: true,
            city: true,
            isVerified: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      product,
    })

  } catch (error) {
    console.error('Error creating product:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    // Filters
    const category = searchParams.get('category')
    const condition = searchParams.get('condition')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const location = searchParams.get('location')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {
      isActive: true,
      isSold: false,
    }

    if (category) {
      where.category = category
    }

    if (condition) {
      where.condition = condition
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { country: { contains: location, mode: 'insensitive' } },
        { location: { contains: location, mode: 'insensitive' } },
      ]
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: limit,
      }),
      db.product.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
