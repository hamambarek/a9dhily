'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MapPin, 
  Star, 
  Eye, 
  Calendar,
  User,
  Shield,
  Truck,
  CreditCard,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  condition: string
  location: string
  country: string
  city: string
  images: string[]
  viewCount: number
  createdAt: string
  seller: {
    id: string
    name: string
    country: string
    city: string
    isVerified: boolean
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()

      if (data.success) {
        setProduct(data.product)
      } else {
        setError(data.error || 'Product not found')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyNow = () => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase this product',
        variant: 'destructive'
      })
      return
    }

    if (product) {
      // Redirect to payment page or open payment modal
      window.location.href = `/payment-test?productId=${product.id}&amount=${product.price}&sellerId=${product.seller.id}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <Eye className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Product Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'The product you are looking for does not exist.'}
            </p>
            <Link href="/products">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-lg">Product Image</div>
            </div>
            
            {/* Image Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="text-gray-400 text-sm">Image {index + 1}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {product.title}
                </h1>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant={product.condition === 'NEW' ? 'default' : 'secondary'}>
                  {product.condition}
                </Badge>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="h-4 w-4 mr-1" />
                  {product.viewCount} views
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                ${product.price}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Seller Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.seller.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {product.seller.city}, {product.seller.country}
                      </div>
                    </div>
                  </div>
                  {product.seller.isVerified && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Seller
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Purchase Actions */}
            <div className="space-y-4">
              <Button 
                onClick={handleBuyNow}
                className="w-full h-12 text-lg"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Buy Now - ${product.price}
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12">
                  <Truck className="h-4 w-4 mr-2" />
                  Shipping Info
                </Button>
                <Button variant="outline" className="h-12">
                  <Shield className="h-4 w-4 mr-2" />
                  Escrow Protection
                </Button>
              </div>
            </div>

            {/* Product Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Product Features
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  <span>Escrow Protection</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 text-blue-500 mr-2" />
                  <span>Worldwide Shipping</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>Quality Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
