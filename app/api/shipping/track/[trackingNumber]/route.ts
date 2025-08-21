import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Mock tracking events generator
function generateMockTrackingEvents(trackingNumber: string, status: string) {
  const events = []
  const now = new Date()
  
  // Base events that always exist
  events.push({
    status: 'Label Created',
    location: 'Origin Facility',
    description: 'Shipping label created and ready for pickup',
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  })
  
  events.push({
    status: 'Picked Up',
    location: 'Origin Facility',
    description: 'Package picked up by carrier',
    timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
  })
  
  events.push({
    status: 'In Transit',
    location: 'Sorting Facility',
    description: 'Package in transit to destination',
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  })
  
  // Add more events based on current status
  if (status === 'IN_TRANSIT') {
    events.push({
      status: 'In Transit',
      location: 'Regional Hub',
      description: 'Package arrived at regional distribution center',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    })
  } else if (status === 'OUT_FOR_DELIVERY') {
    events.push({
      status: 'In Transit',
      location: 'Regional Hub',
      description: 'Package arrived at regional distribution center',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    })
    
    events.push({
      status: 'Out for Delivery',
      location: 'Local Delivery Facility',
      description: 'Package is out for delivery',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000) // 4 hours ago
    })
  } else if (status === 'DELIVERED') {
    events.push({
      status: 'In Transit',
      location: 'Regional Hub',
      description: 'Package arrived at regional distribution center',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    })
    
    events.push({
      status: 'Out for Delivery',
      location: 'Local Delivery Facility',
      description: 'Package is out for delivery',
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    })
    
    events.push({
      status: 'Delivered',
      location: 'Destination Address',
      description: 'Package delivered successfully',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000) // 12 hours ago
    })
  }
  
  return events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingNumber: string } }
) {
  try {
    const trackingNumber = params.trackingNumber

    if (!trackingNumber) {
      return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 })
    }

    // Find shipment by tracking number
    const shipment = await db.shipment.findUnique({
      where: { trackingNumber },
      include: {
        provider: true,
        transaction: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true
              }
            },
            buyer: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            seller: {
              select: {
                id: true,
                name: true,
                city: true,
                country: true
              }
            }
          }
        },
        trackingEvents: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Tracking number not found' }, { status: 404 })
    }

    // If no tracking events exist, generate mock events based on status
    let trackingEvents = shipment.trackingEvents
    if (trackingEvents.length === 0) {
      const mockEvents = generateMockTrackingEvents(trackingNumber, shipment.status)
      trackingEvents = mockEvents.map(event => ({
        id: `mock-${Date.now()}-${Math.random()}`,
        shipmentId: shipment.id,
        status: event.status,
        location: event.location,
        description: event.description,
        timestamp: event.timestamp,
        createdAt: event.timestamp
      }))
    }

    // Calculate progress percentage
    const statusProgress = {
      PENDING: 0,
      LABEL_CREATED: 10,
      PICKED_UP: 25,
      IN_TRANSIT: 50,
      OUT_FOR_DELIVERY: 80,
      DELIVERED: 100,
      RETURNED: 0,
      CANCELLED: 0,
      EXCEPTION: 0
    }

    const progress = statusProgress[shipment.status] || 0

    // Determine estimated delivery if not set
    let estimatedDelivery = shipment.estimatedDelivery
    if (!estimatedDelivery && shipment.shippedAt) {
      const shippedDate = new Date(shipment.shippedAt)
      estimatedDelivery = new Date(shippedDate.getTime() + (shipment.provider.estimatedDays * 24 * 60 * 60 * 1000))
    }

    const trackingInfo = {
      trackingNumber: shipment.trackingNumber,
      status: shipment.status,
      progress,
      estimatedDelivery,
      actualDelivery: shipment.actualDelivery,
      shippedAt: shipment.shippedAt,
      deliveredAt: shipment.deliveredAt,
      provider: {
        name: shipment.provider.name,
        code: shipment.provider.code,
        trackingUrl: shipment.provider.trackingUrl?.replace('{trackingNumber}', trackingNumber)
      },
      shipment: {
        id: shipment.id,
        weight: shipment.weight,
        dimensions: shipment.dimensions,
        shippingCost: shipment.shippingCost,
        insuranceAmount: shipment.insuranceAmount,
        fromAddress: shipment.fromAddress,
        toAddress: shipment.toAddress,
        notes: shipment.notes
      },
      product: {
        id: shipment.transaction.product.id,
        title: shipment.transaction.product.title,
        image: shipment.transaction.product.images[0] || null
      },
      transaction: {
        id: shipment.transaction.id,
        amount: shipment.transaction.amount,
        currency: shipment.transaction.currency
      },
      events: trackingEvents.map(event => ({
        status: event.status,
        location: event.location,
        description: event.description,
        timestamp: event.timestamp
      })),
      summary: {
        isDelivered: shipment.status === 'DELIVERED',
        isInTransit: ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(shipment.status),
        hasException: shipment.status === 'EXCEPTION',
        isCancelled: ['CANCELLED', 'RETURNED'].includes(shipment.status),
        daysInTransit: shipment.shippedAt ? 
          Math.floor((new Date().getTime() - new Date(shipment.shippedAt).getTime()) / (24 * 60 * 60 * 1000)) : 0
      }
    }

    return NextResponse.json({
      success: true,
      tracking: trackingInfo
    })
  } catch (error) {
    console.error('Tracking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
