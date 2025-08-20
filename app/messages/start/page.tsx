'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Send, 
  User, 
  Package,
  ArrowLeft,
  Check
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface UserInfo {
  id: string
  name: string
  image?: string
  isVerified: boolean
  country?: string
  city?: string
}

interface ProductInfo {
  id: string
  title: string
  images: string[]
  price: number
  currency: string
}

function StartConversationContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [receiverInfo, setReceiverInfo] = useState<UserInfo | null>(null)
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  const receiverId = searchParams.get('receiverId')
  const productId = searchParams.get('productId')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/messages/start')
      return
    }

    if (session?.user && receiverId) {
      fetchReceiverInfo()
      if (productId) {
        fetchProductInfo()
      }
    }
  }, [session, status, router, receiverId, productId])

  const fetchReceiverInfo = async () => {
    try {
      const response = await fetch(`/api/users/${receiverId}`)
      const data = await response.json()

      if (data.success) {
        setReceiverInfo(data.user)
      } else {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive'
        })
        router.push('/messages')
      }
    } catch (error) {
      console.error('Error fetching receiver info:', error)
      toast({
        title: 'Error',
        description: 'Failed to load user information',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchProductInfo = async () => {
    if (!productId) return

    try {
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()

      if (data.success) {
        setProductInfo({
          id: data.product.id,
          title: data.product.title,
          images: data.product.images,
          price: data.product.price,
          currency: data.product.currency
        })
      }
    } catch (error) {
      console.error('Error fetching product info:', error)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !receiverInfo) return

    try {
      setSending(true)
      const response = await fetch('/api/messages/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: receiverInfo.id,
          content: message.trim(),
          productId: productId || undefined,
          messageType: 'TEXT'
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Message Sent!',
          description: 'Your message has been sent successfully.',
        })
        router.push(`/messages/${data.conversationId}`)
      } else {
        throw new Error(data.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      })
    } finally {
      setSending(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
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
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/messages">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Send Message
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start a conversation with the seller
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : receiverInfo ? (
          <div className="space-y-6">
            {/* Receiver Info */}
            <Card>
              <CardHeader>
                <CardTitle>Recipient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={receiverInfo.image} alt={receiverInfo.name} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {receiverInfo.name}
                      </h3>
                      {receiverInfo.isVerified && (
                        <Badge variant="outline" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    {receiverInfo.city && receiverInfo.country && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {receiverInfo.city}, {receiverInfo.country}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Info */}
            {productInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>About Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      {productInfo.images && productInfo.images.length > 0 ? (
                        <img
                          src={productInfo.images[0]}
                          alt={productInfo.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {productInfo.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {productInfo.currency === 'USD' ? '$' : productInfo.currency === 'EUR' ? '€' : productInfo.currency === 'GBP' ? '£' : productInfo.currency}{productInfo.price}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Message Form */}
            <Card>
              <CardHeader>
                <CardTitle>Your Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px]"
                  disabled={sending}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={sendMessage} 
                    disabled={!message.trim() || sending}
                    className="w-full sm:w-auto"
                  >
                    {sending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                User Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The user you're trying to message could not be found.
              </p>
              <Link href="/messages">
                <Button>
                  Back to Messages
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default function StartConversationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <StartConversationContent />
    </Suspense>
  )
}
