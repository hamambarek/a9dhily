'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Search, 
  Send, 
  User, 
  Package,
  Calendar,
  Check,
  CheckCheck
} from 'lucide-react'
import Link from 'next/link'

interface Conversation {
  conversationId: string
  productId?: string
  transactionId?: string
  productTitle?: string
  productImages?: string[]
  otherUserId: string
  otherUserName: string
  otherUserImage?: string
  otherUserVerified: boolean
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/messages')
      return
    }

    if (session?.user) {
      fetchConversations()
    }
  }, [session, status, router])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages/conversations')
      const data = await response.json()

      if (data.success) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter(conversation =>
    conversation.otherUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.productTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading messages...</p>
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Communicate with buyers and sellers
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="space-y-4">
            {filteredConversations.map((conversation) => (
              <Link key={conversation.conversationId} href={`/messages/${conversation.conversationId}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conversation.otherUserImage} alt={conversation.otherUserName} />
                        <AvatarFallback>
                          <User className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {conversation.otherUserName}
                            </h3>
                            {conversation.otherUserVerified && (
                              <Badge variant="outline" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-blue-600 text-white">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(conversation.lastMessageTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Product Info */}
                        {conversation.productTitle && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {conversation.productTitle}
                            </span>
                          </div>
                        )}

                        {/* Last Message */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No messages yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start a conversation by messaging a seller about their product
              </p>
              <Link href="/products">
                <Button>
                  Browse Products
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
