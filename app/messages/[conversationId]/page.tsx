'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Send, 
  User, 
  Package,
  ArrowLeft,
  Check,
  CheckCheck,
  Image as ImageIcon
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  messageType: string
  isRead: boolean
  createdAt: string
  sender: {
    id: string
    name: string
    image?: string
    isVerified: boolean
  }
  receiver: {
    id: string
    name: string
    image?: string
    isVerified: boolean
  }
  product?: {
    id: string
    title: string
    images: string[]
  }
}

interface ConversationInfo {
  conversationId: string
  productId?: string
  transactionId?: string
  productTitle?: string
  productImages?: string[]
  otherUserId: string
  otherUserName: string
  otherUserImage?: string
  otherUserVerified: boolean
}

export default function ConversationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationInfo, setConversationInfo] = useState<ConversationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversationId = params.conversationId as string

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/messages')
      return
    }

    if (session?.user && conversationId) {
      fetchMessages()
    }
  }, [session, status, router, conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/messages/${conversationId}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.messages)
        // Extract conversation info from first message
        if (data.messages.length > 0) {
          const firstMessage = data.messages[0]
          const otherUser = firstMessage.senderId === session?.user?.id 
            ? firstMessage.receiver 
            : firstMessage.sender
          
          setConversationInfo({
            conversationId,
            productId: firstMessage.product?.id,
            productTitle: firstMessage.product?.title,
            productImages: firstMessage.product?.images,
            otherUserId: otherUser.id,
            otherUserName: otherUser.name,
            otherUserImage: otherUser.image,
            otherUserVerified: otherUser.isVerified
          })
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationInfo) return

    try {
      setSending(true)
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage.trim(),
          receiverId: conversationInfo.otherUserId,
          messageType: 'TEXT'
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [...prev, data.message])
        setNewMessage('')
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading conversation...</p>
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
        <div className="mb-6">
          <Link href="/messages">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Messages
            </Button>
          </Link>
          
          {conversationInfo && (
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={conversationInfo.otherUserImage} alt={conversationInfo.otherUserName} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {conversationInfo.otherUserName}
                  </h1>
                  {conversationInfo.otherUserVerified && (
                    <Badge variant="outline" className="text-xs">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {conversationInfo.productTitle && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Package className="h-4 w-4" />
                    <span>{conversationInfo.productTitle}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : messages.length > 0 ? (
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === session?.user?.id
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        {!isOwnMessage && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.image} alt={message.sender.name} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`rounded-lg px-4 py-2 ${
                          isOwnMessage 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end space-x-1 mt-1 ${
                            isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            <span className="text-xs">
                              {new Date(message.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </span>
                            {isOwnMessage && (
                              message.isRead ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="p-12 text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start the conversation by sending a message
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Input */}
        <div className="flex space-x-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            className="flex-1"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || sending}
            size="icon"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
