import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const calculateShippingSchema = z.object({
  productId: z.string(),
  fromCountry: z.string(),
  fromCity: z.string(),
  toCountry: z.string(),
  toCity: z.string(),
  weight: z.number().min(0.1).max(1000), // Weight in kg
  dimensions: z.object({
    length: z.number().min(1).max(200), // Length in cm
    width: z.number().min(1).max(200),  // Width in cm
    height: z.number().min(1).max(200)  // Height in cm
  }).optional(),
  shippingClass: z.enum(['standard', 'express', 'overnight', 'fragile', 'bulk']).default('standard'),
  insuranceValue: z.number().min(0).optional()
})

// Mock shipping providers data
const SHIPPING_PROVIDERS = [
  {
    id: 'dhl_standard',
    name: 'DHL Standard',
    code: 'DHL_STD',
    baseRate: 15.00,
    ratePerKg: 8.50,
    estimatedDays: 5,
    maxWeight: 70,
    international: true,
    trackingIncluded: true
  },
  {
    id: 'dhl_express',
    name: 'DHL Express',
    code: 'DHL_EXP',
    baseRate: 35.00,
    ratePerKg: 12.00,
    estimatedDays: 2,
    maxWeight: 70,
    international: true,
    trackingIncluded: true
  },
  {
    id: 'fedex_standard',
    name: 'FedEx International Economy',
    code: 'FEDEX_IE',
    baseRate: 18.00,
    ratePerKg: 9.00,
    estimatedDays: 6,
    maxWeight: 68,
    international: true,
    trackingIncluded: true
  },
  {
    id: 'fedex_express',
    name: 'FedEx International Priority',
    code: 'FEDEX_IP',
    baseRate: 42.00,
    ratePerKg: 15.00,
    estimatedDays: 1,
    maxWeight: 68,
    international: true,
    trackingIncluded: true
  },
  {
    id: 'ups_standard',
    name: 'UPS Worldwide Expedited',
    code: 'UPS_WW',
    baseRate: 20.00,
    ratePerKg: 10.00,
    estimatedDays: 4,
    maxWeight: 70,
    international: true,
    trackingIncluded: true
  },
  {
    id: 'local_post',
    name: 'Local Post Service',
    code: 'LOCAL_POST',
    baseRate: 8.00,
    ratePerKg: 5.00,
    estimatedDays: 10,
    maxWeight: 30,
    international: false,
    trackingIncluded: false
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = calculateShippingSchema.parse(body)

    // Get product details
    const product = await db.product.findUnique({
      where: { id: validatedData.productId },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        weight: true,
        dimensions: true,
        shippingClass: true,
        freeShipping: true,
        shippingCost: true,
        seller: {
          select: {
            id: true,
            name: true,
            country: true,
            city: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const isInternational = validatedData.fromCountry !== validatedData.toCountry
    const isDomestic = validatedData.fromCountry === validatedData.toCountry

    // Calculate shipping options
    const shippingOptions = SHIPPING_PROVIDERS
      .filter(provider => {
        // Filter by international/domestic capability
        if (isInternational && !provider.international) return false
        if (isDomestic && provider.id === 'local_post') return true
        
        // Check weight limits
        if (validatedData.weight > provider.maxWeight) return false
        
        return true
      })
      .map(provider => {
        let cost = provider.baseRate + (validatedData.weight * provider.ratePerKg)
        
        // Apply shipping class multipliers
        const classMultipliers = {
          standard: 1.0,
          express: 1.5,
          overnight: 2.5,
          fragile: 1.3,
          bulk: 0.8
        }
        
        cost *= classMultipliers[validatedData.shippingClass]
        
        // Apply distance/international multipliers
        if (isInternational) {
          cost *= 1.2 // International shipping markup
        }
        
        // Apply dimensional weight pricing if applicable
        if (validatedData.dimensions) {
          const { length, width, height } = validatedData.dimensions
          const volumetricWeight = (length * width * height) / 5000 // Standard divisor
          const chargeableWeight = Math.max(validatedData.weight, volumetricWeight)
          
          if (chargeableWeight > validatedData.weight) {
            const additionalCost = (chargeableWeight - validatedData.weight) * provider.ratePerKg * 0.5
            cost += additionalCost
          }
        }
        
        // Insurance cost calculation
        let insuranceCost = 0
        if (validatedData.insuranceValue) {
          insuranceCost = Math.max(2.00, validatedData.insuranceValue * 0.01) // 1% of value, minimum $2
        }
        
        // Calculate delivery estimate
        const estimatedDelivery = new Date()
        estimatedDelivery.setDate(estimatedDelivery.getDate() + provider.estimatedDays)
        
        return {
          id: provider.id,
          name: provider.name,
          code: provider.code,
          cost: Math.round(cost * 100) / 100, // Round to 2 decimal places
          insuranceCost,
          totalCost: Math.round((cost + insuranceCost) * 100) / 100,
          estimatedDays: provider.estimatedDays,
          estimatedDelivery: estimatedDelivery.toISOString(),
          trackingIncluded: provider.trackingIncluded,
          features: {
            express: provider.estimatedDays <= 2,
            tracking: provider.trackingIncluded,
            insurance: validatedData.insuranceValue ? true : false,
            international: provider.international
          }
        }
      })
      .sort((a, b) => a.totalCost - b.totalCost) // Sort by cost

    // Check for free shipping
    const freeShippingAvailable = product.freeShipping && 
      (product.shippingCost === null || Number(product.shippingCost) === 0)

    if (freeShippingAvailable && shippingOptions.length > 0) {
      // Add free shipping option (usually slowest standard option)
      const standardOption = shippingOptions.find(opt => opt.name.toLowerCase().includes('standard'))
      if (standardOption) {
        shippingOptions.unshift({
          ...standardOption,
          id: 'free_shipping',
          name: 'Free Shipping',
          code: 'FREE',
          cost: 0,
          insuranceCost: 0,
          totalCost: 0,
          estimatedDays: standardOption.estimatedDays + 2, // Slower than paid standard
          estimatedDelivery: new Date(Date.now() + (standardOption.estimatedDays + 2) * 24 * 60 * 60 * 1000).toISOString(),
          trackingIncluded: false,
          features: {
            express: false,
            tracking: false,
            insurance: false,
            international: standardOption.features.international
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        weight: validatedData.weight,
        dimensions: validatedData.dimensions
      },
      shipping: {
        from: {
          country: validatedData.fromCountry,
          city: validatedData.fromCity
        },
        to: {
          country: validatedData.toCountry,
          city: validatedData.toCity
        },
        isInternational,
        shippingClass: validatedData.shippingClass,
        insuranceValue: validatedData.insuranceValue
      },
      options: shippingOptions,
      summary: {
        cheapest: shippingOptions[0],
        fastest: shippingOptions.reduce((fastest, current) => 
          current.estimatedDays < fastest.estimatedDays ? current : fastest
        ),
        recommended: shippingOptions.find(opt => 
          opt.trackingIncluded && opt.estimatedDays <= 5 && opt.cost <= shippingOptions[0].cost * 1.5
        ) || shippingOptions[0]
      }
    })
  } catch (error) {
    console.error('Shipping calculation error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid shipping calculation data', 
        details: error.errors 
      }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
