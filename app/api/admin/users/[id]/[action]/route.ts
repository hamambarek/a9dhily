import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const { id: userId, action } = params

    // Validate action
    if (!['verify', 'suspend', 'activate'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent admin from modifying themselves
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 })
    }

    let updateData: any = {}

    switch (action) {
      case 'verify':
        updateData.isVerified = true
        break
      case 'suspend':
        updateData.isActive = false
        break
      case 'activate':
        updateData.isActive = true
        break
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        _count: {
          select: {
            products: true,
            sellerTransactions: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User ${action}ed successfully`
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
