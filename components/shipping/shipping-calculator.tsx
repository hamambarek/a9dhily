'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  Truck, 
  Package, 
  Clock, 
  Shield, 
  MapPin, 
  Calculator,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react'

const shippingSchema = z.object({
  toCountry: z.string().min(1, 'Destination country is required'),
  toCity: z.string().min(1, 'Destination city is required'),
  weight: z.number().min(0.1, 'Weight must be at least 0.1 kg').max(1000, 'Weight cannot exceed 1000 kg'),
  length: z.number().min(1, 'Length must be at least 1 cm').max(200, 'Length cannot exceed 200 cm').optional(),
  width: z.number().min(1, 'Width must be at least 1 cm').max(200, 'Width cannot exceed 200 cm').optional(),
  height: z.number().min(1, 'Height must be at least 1 cm').max(200, 'Height cannot exceed 200 cm').optional(),
  shippingClass: z.enum(['standard', 'express', 'overnight', 'fragile', 'bulk']),
  insuranceValue: z.number().min(0).optional()
})

type ShippingFormData = z.infer<typeof shippingSchema>

interface ShippingOption {
  id: string
  name: string
  code: string
  cost: number
  insuranceCost: number
  totalCost: number
  estimatedDays: number
  estimatedDelivery: string
  trackingIncluded: boolean
  features: {
    express: boolean
    tracking: boolean
    insurance: boolean
    international: boolean
  }
}

interface ShippingCalculatorProps {
  productId: string
  productTitle: string
  productPrice: number
  fromCountry: string
  fromCity: string
  defaultWeight?: number
  defaultDimensions?: { length: number; width: number; height: number }
  onShippingSelect?: (option: ShippingOption) => void
}

export function ShippingCalculator({
  productId,
  productTitle,
  productPrice,
  fromCountry,
  fromCity,
  defaultWeight = 1,
  defaultDimensions,
  onShippingSelect
}: ShippingCalculatorProps) {
  const [loading, setLoading] = useState(false)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      weight: defaultWeight,
      length: defaultDimensions?.length,
      width: defaultDimensions?.width,
      height: defaultDimensions?.height,
      shippingClass: 'standard'
    }
  })

  const watchedValues = watch()

  const calculateShipping = async (data: ShippingFormData) => {
    try {
      setLoading(true)
      setShippingOptions([])
      setSelectedOption(null)

      const requestData = {
        productId,
        fromCountry,
        fromCity,
        toCountry: data.toCountry,
        toCity: data.toCity,
        weight: data.weight,
        dimensions: data.length && data.width && data.height ? {
          length: data.length,
          width: data.width,
          height: data.height
        } : undefined,
        shippingClass: data.shippingClass,
        insuranceValue: data.insuranceValue
      }

      const response = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      const result = await response.json()

      if (result.success) {
        setShippingOptions(result.options)
        
        // Auto-select recommended option
        if (result.summary?.recommended) {
          setSelectedOption(result.summary.recommended.id)
        }
        
        toast({
          title: 'Shipping Calculated',
          description: `Found ${result.options.length} shipping options`
        })
      } else {
        throw new Error(result.error || 'Failed to calculate shipping')
      }
    } catch (error) {
      console.error('Shipping calculation error:', error)
      toast({
        title: 'Calculation Error',
        description: 'Failed to calculate shipping rates. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId)
    const option = shippingOptions.find(opt => opt.id === optionId)
    if (option && onShippingSelect) {
      onShippingSelect(option)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Shipping Calculator
        </CardTitle>
        <CardDescription>
          Calculate shipping costs for {productTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit(calculateShipping)} className="space-y-4">
          {/* Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="toCountry">Destination Country</Label>
              <Select onValueChange={(value) => setValue('toCountry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                  <SelectItem value="JP">Japan</SelectItem>
                  <SelectItem value="CN">China</SelectItem>
                  <SelectItem value="IN">India</SelectItem>
                  <SelectItem value="BR">Brazil</SelectItem>
                </SelectContent>
              </Select>
              {errors.toCountry && (
                <p className="text-sm text-red-600">{errors.toCountry.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="toCity">Destination City</Label>
              <Input
                id="toCity"
                placeholder="Enter city name..."
                {...register('toCity')}
              />
              {errors.toCity && (
                <p className="text-sm text-red-600">{errors.toCity.message}</p>
              )}
            </div>
          </div>

          {/* Package Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Package Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="1.0"
                  {...register('weight', { valueAsNumber: true })}
                />
                {errors.weight && (
                  <p className="text-sm text-red-600">{errors.weight.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingClass">Shipping Class</Label>
                <Select onValueChange={(value) => setValue('shippingClass', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="fragile">Fragile</SelectItem>
                    <SelectItem value="bulk">Bulk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="30"
                  {...register('length', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="20"
                  {...register('width', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="10"
                  {...register('height', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Insurance */}
            <div className="space-y-2">
              <Label htmlFor="insuranceValue">Insurance Value (optional)</Label>
              <Input
                id="insuranceValue"
                type="number"
                step="0.01"
                placeholder={`${productPrice}`}
                {...register('insuranceValue', { valueAsNumber: true })}
              />
              <p className="text-xs text-gray-500">
                Insure your package up to its full value
              </p>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Shipping
              </>
            )}
          </Button>
        </form>

        {/* Shipping Options */}
        {shippingOptions.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <h4 className="font-medium text-gray-900 dark:text-white">
              Available Shipping Options
            </h4>
            
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedOption === option.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {option.name}
                          </h5>
                          {option.features.express && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                              <Zap className="h-3 w-3 mr-1" />
                              Express
                            </Badge>
                          )}
                          {option.id === 'free_shipping' && (
                            <Badge className="bg-green-600 text-white">
                              Free
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {option.estimatedDays} days
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Delivery by {formatDate(option.estimatedDelivery)}
                          </div>
                          {option.trackingIncluded && (
                            <div className="flex items-center">
                              <Package className="h-4 w-4 mr-1" />
                              Tracking included
                            </div>
                          )}
                          {option.features.insurance && (
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-1" />
                              Insured
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(option.totalCost)}
                        </div>
                        {option.insuranceCost > 0 && (
                          <div className="text-xs text-gray-500">
                            +{formatCurrency(option.insuranceCost)} insurance
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {selectedOption === option.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Selected shipping option
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
