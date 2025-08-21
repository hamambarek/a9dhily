import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Globe, 
  Shield, 
  Users, 
  ShoppingBag, 
  Truck, 
  Star,
  Heart,
  Zap,
  CheckCircle,
  MessageSquare
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About A9dhily - International Marketplace',
  description: 'Learn about A9dhily, the trusted international marketplace connecting buyers and sellers worldwide with secure transactions and global shipping.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About A9dhily
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connecting buyers and sellers worldwide through a secure, transparent, and user-friendly marketplace platform.
            </p>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-blue-100">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-blue-100">Products Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-blue-100">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            To create a global marketplace that empowers individuals and businesses to buy and sell with confidence, 
            providing secure transactions, transparent communication, and seamless shipping solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Secure Transactions</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Advanced payment protection and escrow services ensure your money is safe until you receive your items.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-xl">Global Reach</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Connect with buyers and sellers from around the world with our international shipping and logistics support.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle className="text-xl">Community Trust</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Verified user profiles, ratings, and reviews create a trusted community of buyers and sellers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle className="text-xl">Smart Shipping</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Automated shipping calculations, tracking, and delivery estimates for seamless logistics.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Direct Communication</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Built-in messaging system allows buyers and sellers to communicate directly and securely.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-xl">Fast & Easy</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Streamlined listing process, advanced search, and quick checkout make buying and selling effortless.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Values
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Transparency</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Clear pricing, honest descriptions, and open communication between all parties.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Security</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Advanced security measures to protect user data and financial transactions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Innovation</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Continuously improving our platform with the latest technology and user feedback.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Customer Focus</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Putting our users first with exceptional support and user experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Global Community</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Building connections across borders and cultures through commerce.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Sustainability</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Promoting responsible consumption and supporting eco-friendly practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who trust A9dhily for their buying and selling needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Browse Products
            </a>
            <a
              href="/products/create"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              <Star className="h-5 w-5 mr-2" />
              Start Selling
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
