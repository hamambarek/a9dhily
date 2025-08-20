'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StarRating } from '@/components/ui/star-rating'
import { useToast } from '@/hooks/use-toast'
import { Star, Send } from 'lucide-react'

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string
  transactionId: string
  reviewedId: string
  productTitle: string
  onSubmit: (data: ReviewFormData) => void
  isLoading?: boolean
}

export function ReviewForm({ 
  productId, 
  transactionId, 
  reviewedId, 
  productTitle, 
  onSubmit, 
  isLoading = false 
}: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  })

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    setValue('rating', newRating)
  }

  const handleFormSubmit = async (data: ReviewFormData) => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a rating before submitting',
        variant: 'destructive'
      })
      return
    }

    onSubmit({ ...data, rating })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Star className="h-5 w-5 mr-2 text-yellow-500" />
          Write a Review
        </CardTitle>
        <CardDescription>
          Share your experience with {productTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Rating Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Rating *
            </label>
            <div className="flex items-center space-x-4">
              <StarRating
                rating={rating}
                interactive={true}
                onRatingChange={handleRatingChange}
                size="lg"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
              </span>
            </div>
            {errors.rating && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.rating.message}
              </p>
            )}
          </div>

          {/* Review Comment */}
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Review *
            </label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this product and seller..."
              className="min-h-[120px]"
              {...register('comment')}
            />
            {errors.comment && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.comment.message}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Minimum 10 characters, maximum 1000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading || rating === 0}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
