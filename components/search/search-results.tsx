'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/ui/star-rating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MapPin, 
  Eye, 
  MessageSquare, 
  Star,
  Shield,
  Package,
  ChevronLeft,
  ChevronRight,
  Grid,
  List
} from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  condition: string
  category: string
  images: string[]
  location: string
  country: string
  city: string
  brand?: string
  model?: string
  year?: number
  tags: string[]
  viewCount: number
  createdAt: string
  seller: {
    id: string
    name: string
    image?: string
    isVerified: boolean
    averageRating?: number
    totalReviews: number
    city: string
    country: string
  }
  _count: {
    reviews: number
    transactions: number
  }
}

interface SearchResultsProps {
  products: Product[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  onPageChange: (page: number) => void
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
}

export function SearchResults({ 
  products, 
  pagination, 
  onPageChange, 
  viewMode = 'grid',
  onViewModeChange 
}: SearchResultsProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {pagination.total} Products Found
          </h2>
          {onViewModeChange && (
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            isHovered={hoveredProduct === product.id}
            onHover={(hovered) => setHoveredProduct(hovered ? product.id : null)}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  isHovered: boolean
  onHover: (hovered: boolean) => void
}

function ProductCard({ product, viewMode, isHovered, onHover }: ProductCardProps) {
  const isList = viewMode === 'list'

  return (
    <Card 
      className={`transition-all duration-200 ${
        isHovered ? 'shadow-lg scale-105' : 'hover:shadow-md'
      } ${isList ? 'flex' : ''}`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <CardContent className={`p-4 ${isList ? 'flex-1 flex' : ''}`}>
        <div className={isList ? 'flex space-x-4 w-full' : 'space-y-3'}>
          {/* Product Image */}
          <div className={`relative ${isList ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}`}>
            <img
              src={product.images[0] || '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
            />
            <Badge 
              variant="secondary" 
              className="absolute top-2 left-2 text-xs"
            >
              {product.condition.replace('_', ' ')}
            </Badge>
          </div>

          {/* Product Info */}
          <div className={`flex-1 space-y-2 ${isList ? 'flex flex-col justify-between' : ''}`}>
            <div>
              <Link href={`/products/${product.id}`}>
                <h3 className={`font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors ${
                  isList ? 'text-lg' : 'text-base'
                }`}>
                  {product.title}
                </h3>
              </Link>
              
              <p className={`text-gray-600 dark:text-gray-400 line-clamp-2 ${
                isList ? 'text-sm' : 'text-xs'
              }`}>
                {product.description}
              </p>

              {/* Price */}
              <div className="flex items-center space-x-2 mt-2">
                <span className={`font-bold text-blue-600 ${
                  isList ? 'text-xl' : 'text-lg'
                }`}>
                  {product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : product.currency === 'GBP' ? '£' : product.currency}{product.price}
                </span>
                {product.brand && (
                  <Badge variant="outline" className="text-xs">
                    {product.brand}
                  </Badge>
                )}
              </div>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {product.city}, {product.country}
              </div>
            </div>

            {/* Seller Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={product.seller.image} alt={product.seller.name} />
                  <AvatarFallback className="text-xs">
                    {product.seller.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {product.seller.name}
                  </span>
                  {product.seller.isVerified && (
                    <Shield className="h-3 w-3 text-blue-600" />
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.viewCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>{product._count.reviews}</span>
                </div>
              </div>
            </div>

            {/* Seller Rating */}
            {product.seller.averageRating && (
              <div className="flex items-center space-x-2">
                <StarRating 
                  rating={product.seller.averageRating} 
                  size="sm" 
                  showValue={true}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({product.seller.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
