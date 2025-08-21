'use client'

import { useState, useEffect, useCallback } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SearchFilters } from '@/components/search/search-filters'
import { SearchResults } from '@/components/search/search-results'
import { useToast } from '@/hooks/use-toast'
import { Search, Filter, X } from 'lucide-react'

interface SearchFilters {
  query?: string
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  currency?: string
  location?: string
  country?: string
  city?: string
  brand?: string
  year?: number
  tags?: string[]
  sortBy?: string
  sellerRating?: number
  verifiedSeller?: boolean
  inStock?: boolean
}

interface SearchResponse {
  success: boolean
  products: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  suggestions: string[]
  filters: {
    categories: string[]
    conditions: string[]
    countries: string[]
    currencies: string[]
    brands: string[]
  }
  searchParams: SearchFilters
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  // Parse URL search params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('query') || ''
    const category = urlParams.get('category') || ''
    const condition = urlParams.get('condition') || ''
    const minPrice = urlParams.get('minPrice') ? parseFloat(urlParams.get('minPrice')!) : undefined
    const maxPrice = urlParams.get('maxPrice') ? parseFloat(urlParams.get('maxPrice')!) : undefined
    const location = urlParams.get('location') || ''
    const brand = urlParams.get('brand') || ''
    const year = urlParams.get('year') ? parseInt(urlParams.get('year')!) : undefined
    const sortBy = urlParams.get('sortBy') || 'relevance'
    const sellerRating = urlParams.get('sellerRating') ? parseFloat(urlParams.get('sellerRating')!) : undefined
    const verifiedSeller = urlParams.get('verifiedSeller') === 'true'

    setSearchQuery(query)
    setFilters({
      query,
      category,
      condition,
      minPrice,
      maxPrice,
      location,
      brand,
      year,
      sortBy,
      sellerRating,
      verifiedSeller,
    })

    // Perform initial search
    if (query || category || condition || minPrice || maxPrice || location || brand || year || sellerRating || verifiedSeller) {
      performSearch({
        query,
        category,
        condition,
        minPrice,
        maxPrice,
        location,
        brand,
        year,
        sortBy,
        sellerRating,
        verifiedSeller,
      })
    }
  }, [])

  const performSearch = useCallback(async (searchFilters: SearchFilters) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            params.append(key, value.join(','))
          } else {
            params.append(key, value.toString())
          }
        }
      })

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data)
      } else {
        throw new Error(data.error || 'Search failed')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast({
        title: 'Search Error',
        description: 'Failed to perform search. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const newFilters = { ...filters, query: searchQuery }
    setFilters(newFilters)
    updateURL(newFilters)
    performSearch(newFilters)
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    updateURL(updatedFilters)
    performSearch(updatedFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = { query: searchQuery }
    setFilters(clearedFilters)
    updateURL(clearedFilters)
    performSearch(clearedFilters)
  }

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page }
    setFilters(newFilters)
    updateURL(newFilters)
    performSearch(newFilters)
  }

  const updateURL = (searchFilters: SearchFilters) => {
    const params = new URLSearchParams()
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params.append(key, value.join(','))
        } else {
          params.append(key, value.toString())
        }
      }
    })

    const newURL = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newURL)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Search Products
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for products, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <SearchFilters
              filters={searchResults?.filters || {
                categories: [],
                conditions: [],
                countries: [],
                currencies: [],
                brands: []
              }}
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Searching...</p>
                </div>
              </div>
            ) : searchResults ? (
              <SearchResults
                products={searchResults.products}
                pagination={searchResults.pagination}
                onPageChange={handlePageChange}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Start Your Search
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter keywords or use filters to find products
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
