import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  currency: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  brand: z.string().optional(),
  year: z.number().optional(),
  tags: z.array(z.string()).optional(),
  sortBy: z.enum(['relevance', 'price_low', 'price_high', 'newest', 'oldest', 'popularity']).default('relevance'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20),
  sellerRating: z.number().min(1).max(5).optional(),
  verifiedSeller: z.boolean().optional(),
  inStock: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate search parameters
    const params = {
      query: searchParams.get('query') || undefined,
      category: searchParams.get('category') || undefined,
      condition: searchParams.get('condition') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      currency: searchParams.get('currency') || undefined,
      location: searchParams.get('location') || undefined,
      country: searchParams.get('country') || undefined,
      city: searchParams.get('city') || undefined,
      brand: searchParams.get('brand') || undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
      tags: searchParams.get('tags') ? searchParams.get('tags')!.split(',') : undefined,
      sortBy: searchParams.get('sortBy') || 'relevance',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sellerRating: searchParams.get('sellerRating') ? parseFloat(searchParams.get('sellerRating')!) : undefined,
      verifiedSeller: searchParams.get('verifiedSeller') === 'true',
      inStock: searchParams.get('inStock') === 'true',
    }

    const validatedParams = searchSchema.parse(params)
    const offset = (validatedParams.page - 1) * validatedParams.limit

    // Build the where clause
    const where: any = {
      isActive: true,
      isSold: false,
    }

    // Text search
    if (validatedParams.query) {
      const searchQuery = validatedParams.query.toLowerCase()
      where.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { description: { contains: searchQuery, mode: 'insensitive' } },
        { brand: { contains: searchQuery, mode: 'insensitive' } },
        { model: { contains: searchQuery, mode: 'insensitive' } },
        { tags: { hasSome: [searchQuery] } },
      ]
    }

    // Category filter
    if (validatedParams.category) {
      where.category = validatedParams.category
    }

    // Condition filter
    if (validatedParams.condition) {
      where.condition = validatedParams.condition
    }

    // Price range filter
    if (validatedParams.minPrice !== undefined || validatedParams.maxPrice !== undefined) {
      where.price = {}
      if (validatedParams.minPrice !== undefined) {
        where.price.gte = validatedParams.minPrice
      }
      if (validatedParams.maxPrice !== undefined) {
        where.price.lte = validatedParams.maxPrice
      }
    }

    // Currency filter
    if (validatedParams.currency) {
      where.currency = validatedParams.currency
    }

    // Location filters
    if (validatedParams.location) {
      where.location = { contains: validatedParams.location, mode: 'insensitive' }
    }
    if (validatedParams.country) {
      where.country = { contains: validatedParams.country, mode: 'insensitive' }
    }
    if (validatedParams.city) {
      where.city = { contains: validatedParams.city, mode: 'insensitive' }
    }

    // Brand filter
    if (validatedParams.brand) {
      where.brand = { contains: validatedParams.brand, mode: 'insensitive' }
    }

    // Year filter
    if (validatedParams.year) {
      where.year = validatedParams.year
    }

    // Tags filter
    if (validatedParams.tags && validatedParams.tags.length > 0) {
      where.tags = { hasSome: validatedParams.tags }
    }

    // Seller rating filter
    if (validatedParams.sellerRating) {
      where.seller = {
        averageRating: { gte: validatedParams.sellerRating }
      }
    }

    // Verified seller filter
    if (validatedParams.verifiedSeller) {
      where.seller = {
        ...where.seller,
        isVerified: true
      }
    }

    // Build order by clause
    let orderBy: any = {}
    switch (validatedParams.sortBy) {
      case 'price_low':
        orderBy.price = 'asc'
        break
      case 'price_high':
        orderBy.price = 'desc'
        break
      case 'newest':
        orderBy.createdAt = 'desc'
        break
      case 'oldest':
        orderBy.createdAt = 'asc'
        break
      case 'popularity':
        orderBy.viewCount = 'desc'
        break
      case 'relevance':
      default:
        if (validatedParams.query) {
          // For relevance, we'll use a combination of factors
          orderBy = [
            { searchScore: 'desc' },
            { viewCount: 'desc' },
            { createdAt: 'desc' }
          ]
        } else {
          orderBy.createdAt = 'desc'
        }
        break
    }

    // Execute the search query
    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              image: true,
              isVerified: true,
              averageRating: true,
              totalReviews: true,
              city: true,
              country: true,
            }
          },
          _count: {
            select: {
              reviews: true,
              transactions: true,
            }
          }
        },
        orderBy,
        skip: offset,
        take: validatedParams.limit,
      }),
      db.product.count({ where })
    ])

    // Calculate pagination
    const totalPages = Math.ceil(total / validatedParams.limit)

    // Get search suggestions and filters
    const suggestions = await getSearchSuggestions(validatedParams.query)
    const filters = await getAvailableFilters(where)

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
        totalPages,
        hasNext: validatedParams.page < totalPages,
        hasPrev: validatedParams.page > 1,
      },
      suggestions,
      filters,
      searchParams: validatedParams,
    })
  } catch (error) {
    console.error('Search error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid search parameters', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getSearchSuggestions(query?: string) {
  if (!query || query.length < 2) return []

  try {
    const suggestions = await db.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { brand: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
        isActive: true,
        isSold: false,
      },
      select: {
        title: true,
        brand: true,
        category: true,
      },
      take: 10,
      distinct: ['title'],
    })

    return suggestions.map(s => s.title).slice(0, 5)
  } catch (error) {
    console.error('Error getting suggestions:', error)
    return []
  }
}

async function getAvailableFilters(baseWhere: any) {
  try {
    const [categories, conditions, countries, currencies, brands] = await Promise.all([
      db.product.findMany({
        where: { ...baseWhere, isActive: true, isSold: false },
        select: { category: true },
        distinct: ['category'],
      }),
      db.product.findMany({
        where: { ...baseWhere, isActive: true, isSold: false },
        select: { condition: true },
        distinct: ['condition'],
      }),
      db.product.findMany({
        where: { ...baseWhere, isActive: true, isSold: false },
        select: { country: true },
        distinct: ['country'],
      }),
      db.product.findMany({
        where: { ...baseWhere, isActive: true, isSold: false },
        select: { currency: true },
        distinct: ['currency'],
      }),
      db.product.findMany({
        where: { ...baseWhere, isActive: true, isSold: false, brand: { not: null } },
        select: { brand: true },
        distinct: ['brand'],
      }),
    ])

    return {
      categories: categories.map(c => c.category),
      conditions: conditions.map(c => c.condition),
      countries: countries.map(c => c.country),
      currencies: currencies.map(c => c.currency),
      brands: brands.map(b => b.brand).filter(Boolean),
    }
  } catch (error) {
    console.error('Error getting filters:', error)
    return {
      categories: [],
      conditions: [],
      countries: [],
      currencies: [],
      brands: [],
    }
  }
}
