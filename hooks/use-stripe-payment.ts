'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { useToast } from '@/hooks/use-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentData {
  amount: number
  productId: string
  sellerId: string
}

interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

export function useStripePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const createPaymentIntent = async (paymentData: PaymentData): Promise<PaymentResult> => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent')
      }

      return {
        success: true,
        transactionId: data.transactionId,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      })

      return {
        success: false,
        error: errorMessage,
      }
    } finally {
      setIsLoading(false)
    }
  }

  const processPayment = async (
    paymentData: PaymentData,
    onSuccess?: (transactionId: string) => void,
    onError?: (error: string) => void
  ) => {
    setIsLoading(true)

    try {
      // Create checkout session
      const response = await fetch('/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          productName: 'Test Product Purchase',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (!data.url) {
        throw new Error('No checkout URL received')
      }

      // Success callback
      if (onSuccess && data.transactionId) {
        onSuccess(data.transactionId)
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed'
      
      toast({
        title: 'Payment Error',
        description: errorMessage,
        variant: 'destructive',
      })

      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    processPayment,
    createPaymentIntent,
    isLoading,
  }
}
