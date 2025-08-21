'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  ExternalLink,
  Calendar,
  Weight,
  DollarSign
} from 'lucide-react'

interface TrackingEvent {
  status: string
  location: string
  description: string
  timestamp: string
}

interface TrackingInfo {
  trackingNumber: string
  status: string
  progress: number
  estimatedDelivery?: string
  actualDelivery?: string
  shippedAt?: string
  deliveredAt?: string
  provider: {
    name: string
    code: string
    trackingUrl?: string
  }
  shipment: {
    id: string
    weight?: number
    dimensions?: string
    shippingCost: number
    insuranceAmount?: number
    fromAddress: string
    toAddress: string
    notes?: string
  }
  product: {
    id: string
    title: string
    image?: string
  }
  transaction: {
    id: string
    amount: number
    currency: string
  }
  events: TrackingEvent[]
  summary: {
    isDelivered: boolean
    isInTransit: boolean
    hasException: boolean
    isCancelled: boolean
    daysInTransit: number
  }
}

interface TrackingDisplayProps {
  initialTrackingNumber?: string
  onTrackingUpdate?: (info: TrackingInfo) => void
}

export function TrackingDisplay({ 
  initialTrackingNumber, 
  onTrackingUpdate 
}: TrackingDisplayProps) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || '')
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (initialTrackingNumber) {
      trackPackage(initialTrackingNumber)
    }
  }, [initialTrackingNumber])

  const trackPackage = async (trackingNum: string) => {
    if (!trackingNum.trim()) {
      toast({
        title: 'Tracking Number Required',
        description: 'Please enter a tracking number',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/shipping/track/${trackingNum}`)
      const result = await response.json()

      if (result.success) {
        setTrackingInfo(result.tracking)
        onTrackingUpdate?.(result.tracking)
        
        toast({
          title: 'Tracking Updated',
          description: `Package status: ${result.tracking.status.replace('_', ' ')}`
        })
      } else {
        setError(result.error || 'Tracking information not found')
        setTrackingInfo(null)
      }
    } catch (error) {
      console.error('Tracking error:', error)
      setError('Failed to fetch tracking information')
      setTrackingInfo(null)
    } finally {
      setLoading(false)
    }
  }

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackPackage(trackingNumber)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-600'
      case 'OUT_FOR_DELIVERY': return 'bg-blue-600'
      case 'IN_TRANSIT': return 'bg-yellow-600'
      case 'PICKED_UP': return 'bg-orange-600'
      case 'EXCEPTION': return 'bg-red-600'
      case 'CANCELLED': return 'bg-gray-600'
      default: return 'bg-gray-400'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Tracking Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Track Your Package
          </CardTitle>
          <CardDescription>
            Enter your tracking number to get real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackSubmit} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter tracking number..."
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingInfo && (
        <div className="space-y-6">
          {/* Status Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    {trackingInfo.product.title}
                  </CardTitle>
                  <CardDescription>
                    Tracking: {trackingInfo.trackingNumber}
                  </CardDescription>
                </div>
                <Badge 
                  className={`${getStatusColor(trackingInfo.status)} text-white`}
                >
                  {trackingInfo.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Delivery Progress</span>
                  <span>{trackingInfo.progress}%</span>
                </div>
                <Progress value={trackingInfo.progress} className="h-2" />
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Carrier:</span>
                    <span className="font-medium">{trackingInfo.provider.name}</span>
                  </div>
                  
                  {trackingInfo.estimatedDelivery && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Est. Delivery:</span>
                      <span className="font-medium">
                        {formatDate(trackingInfo.estimatedDelivery)}
                      </span>
                    </div>
                  )}
                  
                  {trackingInfo.summary.daysInTransit > 0 && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Days in Transit:</span>
                      <span className="font-medium">{trackingInfo.summary.daysInTransit}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {trackingInfo.shipment.weight && (
                    <div className="flex items-center space-x-2">
                      <Weight className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Weight:</span>
                      <span className="font-medium">{trackingInfo.shipment.weight} kg</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Shipping Cost:</span>
                    <span className="font-medium">
                      {formatCurrency(trackingInfo.shipment.shippingCost)}
                    </span>
                  </div>

                  {trackingInfo.provider.trackingUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(trackingInfo.provider.trackingUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track on {trackingInfo.provider.name}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Addresses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">From</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {trackingInfo.shipment.fromAddress}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">To</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {trackingInfo.shipment.toAddress}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Tracking History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trackingInfo.events.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.status}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(event.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {event.description}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          {trackingInfo.shipment.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Delivery Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {trackingInfo.shipment.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
