'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  ShoppingCart, 
  Heart, 
  Settings, 
  User, 
  DollarSign, 
  Eye, 
  Calendar,
  Plus,
  TrendingUp,
  Shield,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalSales: number
  totalViews: number
  totalPurchases: number
  totalFavorites: number
}

interface RecentProduct {
  id: string
  title: string
  price: number
  currency: string
  viewCount: number
  createdAt: string
  isActive: boolean
}

interface RecentPurchase {
  id: string
  productTitle: string
  amount: number
  currency: string
  status: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard')
      return
    }

    if (session?.user) {
      fetchDashboardData()
    }
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, productsResponse, purchasesResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/recent-products'),
        fetch('/api/dashboard/recent-purchases')
      ])

      const statsData = await statsResponse.json()
      const productsData = await productsResponse.json()
      const purchasesData = await purchasesResponse.json()

      if (statsData.success) setStats(statsData.stats)
      if (productsData.success) setRecentProducts(productsData.products)
      if (purchasesData.success) setRecentPurchases(purchasesData.purchases)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your products, track sales, and monitor your marketplace activity
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/products/create">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Plus className="h-8 w-8 text-blue-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Create Product</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">List a new item</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/products">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-green-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">My Products</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage listings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/purchases">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <ShoppingCart className="h-8 w-8 text-purple-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">My Purchases</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Settings className="h-8 w-8 text-gray-600 mr-4" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Account preferences</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Overview */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalProducts || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${stats?.totalSales || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Eye className="h-8 w-8 text-purple-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalViews || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8 text-orange-600 mr-4" />
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Purchases</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalPurchases || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for different sections */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">My Products</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Package className="h-5 w-5 mr-2" />
                        Recent Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentProducts.length > 0 ? (
                        <div className="space-y-4">
                          {recentProducts.slice(0, 5).map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">{product.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {product.currency === 'USD' ? '$' : product.currency}{product.price} • {product.viewCount} views
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={product.isActive ? 'default' : 'secondary'}>
                                  {product.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Link href={`/products/${product.id}`}>
                                  <Button variant="outline" size="sm">View</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                          <Link href="/dashboard/products">
                            <Button variant="outline" className="w-full">View All Products</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-4">No products yet</p>
                          <Link href="/products/create">
                            <Button>Create Your First Product</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Purchases */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Recent Purchases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentPurchases.length > 0 ? (
                        <div className="space-y-4">
                          {recentPurchases.slice(0, 5).map((purchase) => (
                            <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">{purchase.productTitle}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {purchase.currency === 'USD' ? '$' : purchase.currency}{purchase.amount} • {new Date(purchase.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge variant={purchase.status === 'PAID' ? 'default' : 'secondary'}>
                                {purchase.status}
                              </Badge>
                            </div>
                          ))}
                          <Link href="/dashboard/purchases">
                            <Button variant="outline" className="w-full">View All Purchases</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-4">No purchases yet</p>
                          <Link href="/products">
                            <Button>Browse Products</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle>My Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Detailed product management will be implemented in the next step.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="purchases">
                <Card>
                  <CardHeader>
                    <CardTitle>My Purchases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Purchase history and order tracking will be implemented in the next step.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      Activity feed and notifications will be implemented in the next step.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
