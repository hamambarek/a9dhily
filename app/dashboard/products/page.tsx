'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus, 
  Package, 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Search,
  Filter,
  Grid,
  List,
  TrendingUp,
  DollarSign,
  Calendar
} from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  condition: string
  images: string[]
  isActive: boolean
  isFeatured: boolean
  isSold: boolean
  viewCount: number
  createdAt: string
  _count: {
    transactions: number
    reviews: number
  }
}

export default function DashboardProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard/products')
      return
    }

    if (session?.user) {
      fetchProducts()
    }
  }, [session, status, router])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/my-products')
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
      } else {
        throw new Error(data.error || 'Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your products',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setProducts(products.filter(p => p.id !== productId))
        toast({
          title: 'Product Deleted',
          description: 'Product has been deleted successfully'
        })
      } else {
        throw new Error(data.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive'
      })
    }
  }

  const handleToggleStatus = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive })
      })

      const data = await response.json()

      if (data.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, isActive: !isActive } : p
        ))
        toast({
          title: 'Status Updated',
          description: `Product ${!isActive ? 'activated' : 'deactivated'} successfully`
        })
      } else {
        throw new Error(data.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: 'Error',
        description: 'Failed to update product status',
        variant: 'destructive'
      })
    }
  }

  const filteredProducts = products.filter(product => {
    switch (activeTab) {
      case 'active':
        return product.isActive && !product.isSold
      case 'sold':
        return product.isSold
      case 'inactive':
        return !product.isActive
      default:
        return true
    }
  })

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive && !p.isSold).length,
    sold: products.filter(p => p.isSold).length,
    inactive: products.filter(p => !p.isActive).length,
    totalViews: products.reduce((sum, p) => sum + p.viewCount, 0),
    totalSales: products.reduce((sum, p) => sum + p._count.transactions, 0)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Products
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your product listings and track their performance
              </p>
            </div>
            <Link href="/products/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSales}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Manage your product listings and their status
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                <TabsTrigger value="active">Active ({stats.active})</TabsTrigger>
                <TabsTrigger value="sold">Sold ({stats.sold})</TabsTrigger>
                <TabsTrigger value="inactive">Inactive ({stats.inactive})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {activeTab === 'all' 
                        ? "You haven't created any products yet."
                        : `No ${activeTab} products found.`
                      }
                    </p>
                    {activeTab === 'all' && (
                      <Link href="/products/create">
                        <Button>Create Your First Product</Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className={viewMode === 'list' ? 'flex' : ''}>
                        <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1 flex' : ''}`}>
                          <div className={viewMode === 'list' ? 'flex space-x-4 w-full' : 'space-y-3'}>
                            {/* Product Image */}
                            <div className={`relative ${viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'}`}>
                              <img
                                src={product.images[0] || '/placeholder-product.jpg'}
                                alt={product.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <Badge 
                                variant={product.isActive ? 'default' : 'secondary'} 
                                className="absolute top-2 left-2 text-xs"
                              >
                                {product.isSold ? 'SOLD' : product.isActive ? 'ACTIVE' : 'INACTIVE'}
                              </Badge>
                            </div>

                            {/* Product Info */}
                            <div className={`flex-1 space-y-2 ${viewMode === 'list' ? 'flex flex-col justify-between' : ''}`}>
                              <div>
                                <h3 className={`font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors ${
                                  viewMode === 'list' ? 'text-lg' : 'text-base'
                                }`}>
                                  {product.title}
                                </h3>
                                
                                <p className={`text-gray-600 dark:text-gray-400 line-clamp-2 ${
                                  viewMode === 'list' ? 'text-sm' : 'text-xs'
                                }`}>
                                  {product.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-center space-x-2 mt-2">
                                  <span className={`font-bold text-blue-600 ${
                                    viewMode === 'list' ? 'text-xl' : 'text-lg'
                                  }`}>
                                    {product.currency === 'USD' ? '$' : product.currency}{product.price}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {product.category}
                                  </Badge>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{product.viewCount} views</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="h-3 w-3" />
                                    <span>{product._count.transactions} sales</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center space-x-2 pt-2">
                                <Link href={`/products/${product.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </Link>
                                <Link href={`/products/${product.id}/edit`}>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                </Link>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleStatus(product.id, product.isActive)}
                                >
                                  {product.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
