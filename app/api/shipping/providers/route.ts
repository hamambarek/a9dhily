import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const createProviderSchema = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(20),
  supportedCountries: z.array(z.string()),
  baseRate: z.number().min(0),
  ratePerKg: z.number().min(0),
  estimatedDays: z.number().min(1).max(30),
  trackingUrl: z.string().url().optional()
})

// Seed default shipping providers
const DEFAULT_PROVIDERS = [
  {
    name: 'DHL Express',
    code: 'DHL_EXP',
    supportedCountries: ['US', 'UK', 'DE', 'FR', 'CA', 'AU', 'JP', 'CN', 'IN', 'BR'],
    baseRate: 25.00,
    ratePerKg: 12.00,
    estimatedDays: 2,
    trackingUrl: 'https://www.dhl.com/track?trackingNumber={trackingNumber}'
  },
  {
    name: 'FedEx International',
    code: 'FEDEX_INTL',
    supportedCountries: ['US', 'UK', 'DE', 'FR', 'CA', 'AU', 'JP', 'CN', 'IN', 'BR'],
    baseRate: 22.00,
    ratePerKg: 10.00,
    estimatedDays: 3,
    trackingUrl: 'https://www.fedex.com/fedextrack/?trackingNumber={trackingNumber}'
  },
  {
    name: 'UPS Worldwide',
    code: 'UPS_WW',
    supportedCountries: ['US', 'UK', 'DE', 'FR', 'CA', 'AU', 'JP', 'CN', 'IN', 'BR'],
    baseRate: 20.00,
    ratePerKg: 9.50,
    estimatedDays: 4,
    trackingUrl: 'https://www.ups.com/track?trackingNumber={trackingNumber}'
  },
  {
    name: 'Local Post Standard',
    code: 'LOCAL_POST',
    supportedCountries: ['US', 'UK', 'DE', 'FR', 'CA', 'AU', 'JP', 'CN', 'IN', 'BR'],
    baseRate: 8.00,
    ratePerKg: 4.50,
    estimatedDays: 7,
    trackingUrl: null
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const active = searchParams.get('active') !== 'false'

    const where: any = {}
    if (active) {
      where.isActive = true
    }
    if (country) {
      where.supportedCountries = { has: country }
    }

    const providers = await db.shippingProvider.findMany({
      where,
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      providers
    })
  } catch (error) {
    console.error('Error fetching shipping providers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    
    // Handle seeding default providers
    if (body.action === 'seed') {
      const existingProviders = await db.shippingProvider.count()
      
      if (existingProviders === 0) {
        const createdProviders = await Promise.all(
          DEFAULT_PROVIDERS.map(provider =>
            db.shippingProvider.create({
              data: provider
            })
          )
        )
        
        return NextResponse.json({
          success: true,
          message: 'Default shipping providers seeded successfully',
          providers: createdProviders
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Shipping providers already exist'
        }, { status: 400 })
      }
    }

    // Create new provider
    const validatedData = createProviderSchema.parse(body)

    // Check if provider code already exists
    const existingProvider = await db.shippingProvider.findUnique({
      where: { code: validatedData.code }
    })

    if (existingProvider) {
      return NextResponse.json({ 
        error: 'Provider code already exists' 
      }, { status: 400 })
    }

    const provider = await db.shippingProvider.create({
      data: validatedData
    })

    return NextResponse.json({
      success: true,
      provider
    })
  } catch (error) {
    console.error('Error creating shipping provider:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid provider data', 
        details: error.errors 
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
