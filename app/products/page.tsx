import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  MapPin,
  Star,
  Eye
} from 'lucide-react'

export default function ProductsPage() {
  // Mock data - in real app this would come from tRPC
  const products = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with advanced camera system and titanium design',
      price: 1199,
      currency: 'USD',
      condition: 'NEW',
      location: 'New York, USA',
      country: 'United States',
      images: ['/placeholder.jpg'],
      seller: {
        name: 'TechStore',
        country: 'United States',
        city: 'New York',
        isVerified: true,
      },
      viewCount: 245,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Sony WH-1000XM5 Headphones',
      description: 'Premium noise-cancelling wireless headphones',
      price: 349,
      currency: 'USD',
      condition: 'LIKE_NEW',
      location: 'London, UK',
      country: 'United Kingdom',
      images: ['/placeholder.jpg'],
      seller: {
        name: 'AudioWorld',
        country: 'United Kingdom',
        city: 'London',
        isVerified: true,
      },
      viewCount: 189,
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'MacBook Air M2',
      description: 'Ultra-thin laptop with Apple M2 chip',
      price: 999,
      currency: 'USD',
      condition: 'EXCELLENT',
      location: 'Toronto, Canada',
      country: 'Canada',
      images: ['/placeholder.jpg'],
      seller: {
        name: 'MacStore',
        country: 'Canada',
        city: 'Toronto',
        isVerified: false,
      },
      viewCount: 156,
      createdAt: new Date(),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Browse Products
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover amazing products from sellers around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <Grid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                <div className="text-gray-400 text-sm">Product Image</div>
              </div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {product.title}
                  </CardTitle>
                  <Badge variant={product.condition === 'NEW' ? 'default' : 'secondary'}>
                    {product.condition}
                  </Badge>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location}
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {product.viewCount}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.seller.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {product.seller.city}, {product.seller.country}
                      </div>
                    </div>
                  </div>
                  {product.seller.isVerified && (
                    <Badge variant="success" className="text-xs">
                      Verified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg">
            Load More Products
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
