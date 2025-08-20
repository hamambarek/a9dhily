'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()

  const handleGoogleSignUp = () => {
    // For OAuth, sign-up and sign-in are the same
    window.location.href = '/api/auth/signin?callbackUrl=/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Join our international marketplace community
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Create your account to start buying and selling internationally
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* OAuth Sign Up */}
            <div className="space-y-4">
              <Button
                type="button"
                className="w-full"
                onClick={handleGoogleSignUp}
              >
                <Chrome className="h-5 w-5 mr-2" />
                Continue with Google
              </Button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <Link 
                href="/auth/signin"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign in to your account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
