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
      // Create payment intent
      const intentResult = await createPaymentIntent(paymentData)
      
      if (!intentResult.success) {
        throw new Error(intentResult.error)
      }

      // Load Stripe
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Failed to load Stripe')
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Product Purchase',
              },
              unit_amount: Math.round(paymentData.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/payment/cancel`,
        client_reference_id: intentResult.transactionId,
      })

      if (error) {
        throw new Error(error.message)
      }

      // Success callback
      if (onSuccess && intentResult.transactionId) {
        onSuccess(intentResult.transactionId)
      }

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
