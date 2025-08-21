import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = params.id

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        phone: true,
        website: true,
        country: true,
        city: true,
        isVerified: true,
        averageRating: true,
        totalReviews: true,
        lastActive: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            sellerTransactions: true,
          }
        }
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        memberSince: user.createdAt,
        totalProducts: user._count.products,
        totalSales: user._count.sellerTransactions,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Users can only update their own profile
    if (session.user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, bio, phone, website, country, city } = body

    // Validate input
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (phone !== undefined) updateData.phone = phone
    if (website !== undefined) updateData.website = website
    if (country !== undefined) updateData.country = country
    if (city !== undefined) updateData.city = city

    // Update lastActive
    updateData.lastActive = new Date()

    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        phone: true,
        website: true,
        country: true,
        city: true,
        isVerified: true,
        averageRating: true,
        totalReviews: true,
        lastActive: true,
        createdAt: true,
        _count: {
          select: {
            products: true,
            sellerTransactions: true,
          }
        }
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        memberSince: updatedUser.createdAt,
        totalProducts: updatedUser._count.products,
        totalSales: updatedUser._count.sellerTransactions,
      },
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
