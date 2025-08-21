import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  MessageSquare, 
  Shield,
  User,
  Settings,
  Search,
  Star,
  FileText,
  Mail,
  Phone,
  Clock
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help & Support - A9dhily',
  description: 'Get help with buying, selling, payments, shipping, and more on A9dhily marketplace.',
}

export default function HelpPage() {
  const faqCategories = [
    {
      title: 'Getting Started',
      icon: <User className="h-6 w-6" />,
      questions: [
        {
          question: 'How do I create an account?',
          answer: 'Click "Get Started" in the top navigation, then choose "Continue with Google" to sign up using your Google account. This is the fastest and most secure way to join A9dhily.'
        },
        {
          question: 'How do I verify my account?',
          answer: 'After signing up, you can verify your account by providing additional information in your profile settings. Verified accounts have a blue checkmark and are more trusted by other users.'
        },
        {
          question: 'What information do I need to provide?',
          answer: 'You can start with just your name and email. For verification, you may be asked to provide a phone number, address, and government-issued ID for enhanced security.'
        }
      ]
    },
    {
      title: 'Buying',
      icon: <ShoppingBag className="h-6 w-6" />,
      questions: [
        {
          question: 'How do I search for products?',
          answer: 'Use the search bar at the top of the page or visit the Search page for advanced filtering options. You can filter by category, price range, condition, location, and more.'
        },
        {
          question: 'How do I contact a seller?',
          answer: 'Click the "Message Seller" button on any product page to start a conversation. You can ask questions about the item, negotiate price, or discuss shipping details.'
        },
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment system. All payments are protected by our escrow service.'
        }
      ]
    },
    {
      title: 'Selling',
      icon: <Star className="h-6 w-6" />,
      questions: [
        {
          question: 'How do I list a product?',
          answer: 'Click "Sell" in the navigation or visit /products/create. Fill out the product form with photos, description, price, and shipping details. Your listing will be live immediately.'
        },
        {
          question: 'What fees are involved?',
          answer: 'A9dhily charges a small platform fee on successful sales. The exact percentage varies by category and is clearly displayed before you list. There are no upfront fees.'
        },
        {
          question: 'How do I ship my items?',
          answer: 'Once a sale is completed, you\'ll receive shipping details. Use our integrated shipping calculator to get the best rates and print labels directly from the platform.'
        }
      ]
    },
    {
      title: 'Payments & Security',
      icon: <Shield className="h-6 w-6" />,
      questions: [
        {
          question: 'How does the escrow system work?',
          answer: 'When a buyer makes a purchase, the payment is held securely in escrow. The seller ships the item, and once the buyer confirms receipt, the payment is released to the seller.'
        },
        {
          question: 'What if there\'s a dispute?',
          answer: 'If there\'s an issue with your transaction, contact our support team immediately. We have a dispute resolution process to ensure fair outcomes for both buyers and sellers.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard encryption and Stripe\'s secure payment processing. We never store your full payment details on our servers.'
        }
      ]
    },
    {
      title: 'Shipping & Tracking',
      icon: <Truck className="h-6 w-6" />,
      questions: [
        {
          question: 'How is shipping calculated?',
          answer: 'Shipping costs are calculated based on item weight, dimensions, origin, destination, and shipping method. Our calculator provides real-time rates from multiple carriers.'
        },
        {
          question: 'How do I track my package?',
          answer: 'Visit the "Track Package" page in the navigation and enter your tracking number. You can also track directly from your order history in the dashboard.'
        },
        {
          question: 'What if my package is lost or damaged?',
          answer: 'Contact our support team immediately. We work with shipping carriers to resolve issues and ensure you receive a refund or replacement if needed.'
        }
      ]
    },
    {
      title: 'Account & Settings',
      icon: <Settings className="h-6 w-6" />,
      questions: [
        {
          question: 'How do I update my profile?',
          answer: 'Go to your Profile page from the navigation menu. You can update your personal information, add a profile picture, and manage your account settings.'
        },
        {
          question: 'How do I change my notification preferences?',
          answer: 'In your Profile settings, you can customize which notifications you receive via email and in-app alerts for messages, sales, and platform updates.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'Contact our support team to request account deletion. We\'ll help you close any open transactions and remove your data according to our privacy policy.'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Help & Support
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Find answers to common questions, learn how to use A9dhily, and get the support you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#faq"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                Browse FAQ
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 bg-white text-base font-medium rounded-md text-blue-600 hover:bg-gray-100 transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Buying Guide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Learn how to find and purchase items safely
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Selling Guide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tips for creating successful listings
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Safety Tips</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                How to stay safe while buying and selling
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping Help</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Shipping guidelines and tracking information
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      {category.icon}
                    </div>
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {category.questions.map((item, itemIndex) => (
                      <div key={itemIndex} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {item.question}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact" className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Still Need Help?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get detailed help with complex issues
              </p>
              <a
                href="mailto:support@a9dhily.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                support@a9dhily.com
              </a>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Chat with our support team in real-time
              </p>
              <span className="text-green-600 dark:text-green-400 font-medium">
                Available 24/7
              </span>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Documentation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Detailed guides and tutorials
              </p>
              <a
                href="/docs"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                View Documentation
              </a>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Response Times
            </h3>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Email: Within 24 hours
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Live Chat: Instant
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  Urgent Issues: Within 2 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
