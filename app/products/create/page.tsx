'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ProductForm } from '@/components/forms/product-form'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CreateProductPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin?callbackUrl=/products/create')
    return null
  }

  const handleCreateProduct = async (productData: any) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product')
      }

      toast({
        title: 'Product Created!',
        description: 'Your product has been successfully created and is now live.',
      })

      // Redirect to the product page
      router.push(`/products/${data.product.id}`)
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create product',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              List your product and start selling to customers worldwide
            </p>
          </div>
        </div>

        <ProductForm onSubmit={handleCreateProduct} isLoading={isLoading} />
      </main>

      <Footer />
    </div>
  )
}
