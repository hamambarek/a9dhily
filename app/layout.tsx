import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'A9dhily - International Peer-to-Peer Marketplace',
    template: '%s | A9dhily',
  },
  description: 'Secure, transparent, and efficient cross-border commerce platform. Buy and sell products internationally with our advanced escrow system.',
  keywords: [
    'marketplace',
    'peer-to-peer',
    'international',
    'escrow',
    'cross-border',
    'commerce',
    'buying',
    'selling',
    'secure payments',
  ],
  authors: [{ name: 'A9dhily Team' }],
  creator: 'A9dhily',
  publisher: 'A9dhily',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'A9dhily - International Peer-to-Peer Marketplace',
    description: 'Secure, transparent, and efficient cross-border commerce platform.',
    siteName: 'A9dhily',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'A9dhily - International Peer-to-Peer Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A9dhily - International Peer-to-Peer Marketplace',
    description: 'Secure, transparent, and efficient cross-border commerce platform.',
    images: ['/og-image.png'],
    creator: '@a9dhily',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://s3.amazonaws.com" />
        <link rel="preconnect" href="https://api.stripe.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//s3.amazonaws.com" />
        <link rel="dns-prefetch" href="//api.stripe.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  )
}
