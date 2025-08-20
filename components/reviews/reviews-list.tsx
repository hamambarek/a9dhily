'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StarRating } from '@/components/ui/star-rating'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  Star, 
  MessageSquare, 
  Check, 
  Calendar,
  Send,
  Package
} from 'lucide-react'

interface Review {
  id: string
  rating: number
  comment: string
  sellerResponse?: string
  isVerified: boolean
  helpfulCount: number
  createdAt: string
  reviewer: {
    id: string
    name: string
    image?: string
    isVerified: boolean
  }
  product: {
    id: string
    title: string
    images: string[]
  }
}

interface ReviewsListProps {
  reviews: Review[]
  sellerId: string
  currentUserId?: string
  onReviewUpdate?: () => void
}

export function ReviewsList({ reviews, sellerId, currentUserId, onReviewUpdate }: ReviewsListProps) {
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseText, setResponseText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleResponseSubmit = async (reviewId: string) => {
    if (!responseText.trim()) {
      toast({
        title: 'Response Required',
        description: 'Please enter a response before submitting',
        variant: 'destructive'
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`/api/reviews/${reviewId}/response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ response: responseText.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Response Submitted',
          description: 'Your response has been added to the review',
        })
        setRespondingTo(null)
        setResponseText('')
        onReviewUpdate?.()
      } else {
        throw new Error(data.error || 'Failed to submit response')
      }
    } catch (error) {
      console.error('Error submitting response:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit response',
        variant: 'destructive'
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This seller hasn't received any reviews yet.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.reviewer.image} alt={review.reviewer.name} />
                  <AvatarFallback>
                    {review.reviewer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {review.reviewer.name}
                    </h4>
                    {review.reviewer.isVerified && (
                      <Badge variant="outline" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {review.isVerified && (
                      <Badge className="bg-green-600 text-white text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <StarRating rating={review.rating} size="sm" />
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex items-center space-x-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {review.product.title}
              </span>
            </div>

            {/* Review Comment */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.comment}
              </p>
            </div>

            {/* Seller Response */}
            {review.sellerResponse && (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <h5 className="font-medium text-blue-900 dark:text-blue-100">
                    Seller Response
                  </h5>
                </div>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {review.sellerResponse}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{review.helpfulCount} found this helpful</span>
              </div>
              
              {/* Seller Response Button */}
              {currentUserId === sellerId && !review.sellerResponse && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRespondingTo(respondingTo === review.id ? null : review.id)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Respond
                </Button>
              )}
            </div>

            {/* Response Form */}
            {respondingTo === review.id && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  Write a Response
                </h5>
                <Textarea
                  placeholder="Write your response to this review..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRespondingTo(null)
                      setResponseText('')
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleResponseSubmit(review.id)}
                    disabled={submitting || !responseText.trim()}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Response
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
