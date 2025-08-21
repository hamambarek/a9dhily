'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  DollarSign, 
  Star,
  Shield,
  Package,
  Calendar,
  Tag
} from 'lucide-react'

interface SearchFiltersProps {
  filters: {
    categories: string[]
    conditions: string[]
    countries: string[]
    currencies: string[]
    brands: string[]
  }
  onFiltersChange: (filters: any) => void
  currentFilters: any
  onClearFilters: () => void
}

export function SearchFilters({ 
  filters, 
  onFiltersChange, 
  currentFilters, 
  onClearFilters 
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState(currentFilters)

  useEffect(() => {
    setLocalFilters(currentFilters)
  }, [currentFilters])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceRangeChange = (values: number[]) => {
    const newFilters = { 
      ...localFilters, 
      minPrice: values[0], 
      maxPrice: values[1] 
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilter = (key: string) => {
    const newFilters = { ...localFilters }
    delete newFilters[key]
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const activeFiltersCount = Object.keys(currentFilters).filter(key => 
    currentFilters[key] !== undefined && 
    currentFilters[key] !== '' && 
    currentFilters[key] !== null &&
    !(Array.isArray(currentFilters[key]) && currentFilters[key].length === 0)
  ).length

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Active Filters ({activeFiltersCount})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentFilters).map(([key, value]) => {
                if (!value || value === '' || (Array.isArray(value) && value.length === 0)) return null
                
                let displayValue = String(value)
                if (key === 'condition') {
                  displayValue = String(value).replace('_', ' ').toLowerCase()
                } else if (key === 'sortBy') {
                  displayValue = String(value).replace('_', ' ').toLowerCase()
                } else if (key === 'minPrice' || key === 'maxPrice') {
                  displayValue = `${key === 'minPrice' ? 'Min' : 'Max'} $${value}`
                }

                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {displayValue}
                    <button
                      onClick={() => handleClearFilter(key)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sort By */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Sort By</Label>
            <Select
              value={localFilters.sortBy || 'relevance'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              Price Range
            </Label>
            <div className="space-y-4">
              <Slider
                value={[localFilters.minPrice || 0, localFilters.maxPrice || 1000]}
                onValueChange={handlePriceRangeChange}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          {filters.categories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category</Label>
              <Select
                value={localFilters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {filters.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Condition */}
          {filters.conditions.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Package className="h-4 w-4 mr-1" />
                Condition
              </Label>
              <Select
                value={localFilters.condition || ''}
                onValueChange={(value) => handleFilterChange('condition', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select condition..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Conditions</SelectItem>
                  {filters.conditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>
                      {condition.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              Location
            </Label>
            <Input
              placeholder="Enter city or country..."
              value={localFilters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          {/* Brand */}
          {filters.brands.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Brand</Label>
              <Select
                value={localFilters.brand || ''}
                onValueChange={(value) => handleFilterChange('brand', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Brands</SelectItem>
                  {filters.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Year */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Year
            </Label>
            <Input
              type="number"
              placeholder="Enter year..."
              value={localFilters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          {/* Seller Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-1" />
              Minimum Seller Rating
            </Label>
            <Select
              value={localFilters.sellerRating?.toString() || ''}
              onValueChange={(value) => handleFilterChange('sellerRating', value ? parseFloat(value) : undefined)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select rating..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Rating</SelectItem>
                <SelectItem value="4.5">4.5+ Stars</SelectItem>
                <SelectItem value="4.0">4.0+ Stars</SelectItem>
                <SelectItem value="3.5">3.5+ Stars</SelectItem>
                <SelectItem value="3.0">3.0+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Filters */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verifiedSeller"
                checked={localFilters.verifiedSeller || false}
                onCheckedChange={(checked) => handleFilterChange('verifiedSeller', checked)}
              />
              <Label htmlFor="verifiedSeller" className="text-sm flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Verified Sellers Only
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
