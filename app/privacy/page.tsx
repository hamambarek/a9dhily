import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy - A9dhily',
  description: 'Learn how A9dhily collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-blue-100">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                A9dhily ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                By using A9dhily, you agree to the collection and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Name and email address (from Google OAuth)</li>
                  <li>Profile information (phone, address, bio)</li>
                  <li>Payment information (processed securely by Stripe)</li>
                  <li>Communication preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Usage Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Browsing history and search queries</li>
                  <li>Product views and interactions</li>
                  <li>Transaction history</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  User-Generated Content
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Product listings and descriptions</li>
                  <li>Reviews and ratings</li>
                  <li>Messages between users</li>
                  <li>Profile photos and images</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Provide and maintain our marketplace services</li>
                <li>Process transactions and payments</li>
                <li>Facilitate communication between buyers and sellers</li>
                <li>Send important updates and notifications</li>
                <li>Improve our platform and user experience</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>With your consent</li>
                <li>To process payments (Stripe)</li>
                <li>To provide customer support</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Monitoring for suspicious activity</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Access and review your data</li>
                <li>Update or correct your information</li>
                <li>Delete your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
                <li>Lodge a complaint with authorities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Cookies and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Remember your preferences and settings</li>
                <li>Analyze website usage and performance</li>
                <li>Provide personalized content</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                You can control cookie settings through your browser preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We use third-party services that may collect information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li><strong>Google OAuth:</strong> For authentication and account creation</li>
                <li><strong>Stripe:</strong> For payment processing and security</li>
                <li><strong>Analytics:</strong> To understand platform usage</li>
                <li><strong>Hosting:</strong> To provide reliable service</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                These services have their own privacy policies, which we encourage you to review.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                You can request deletion of your account and data at any time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                A9dhily is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">International Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                A9dhily operates globally. Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of A9dhily after any changes constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Email:</strong> privacy@a9dhily.com</p>
                <p><strong>Support:</strong> support@a9dhily.com</p>
                <p><strong>Address:</strong> [Your Business Address]</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
