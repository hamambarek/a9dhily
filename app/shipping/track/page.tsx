'use client'

import { TrackingDisplay } from '@/components/shipping/tracking-display'

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Package Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your package delivery status and get real-time updates
          </p>
        </div>

        <TrackingDisplay />
      </div>
    </div>
  )
}
