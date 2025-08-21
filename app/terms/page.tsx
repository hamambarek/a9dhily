import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service - A9dhily',
  description: 'Read the terms and conditions for using A9dhily marketplace platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Please read these terms carefully before using A9dhily marketplace.
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
              <CardTitle className="text-2xl">1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                By accessing and using A9dhily ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">2. Description of Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                A9dhily is an online marketplace that allows users to buy and sell items. The Platform provides:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Product listing and browsing capabilities</li>
                <li>Secure payment processing</li>
                <li>User communication tools</li>
                <li>Shipping and tracking services</li>
                <li>Review and rating systems</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">3. User Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Account Creation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    You must create an account to use certain features of the Platform. You are responsible for maintaining the confidentiality of your account information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Account Responsibilities
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Provide accurate and complete information</li>
                    <li>Keep your account credentials secure</li>
                    <li>Notify us immediately of any unauthorized use</li>
                    <li>You are responsible for all activities under your account</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">4. User Conduct</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                You agree not to use the Platform to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to the Platform</li>
                <li>Interfere with the proper functioning of the Platform</li>
                <li>List prohibited or illegal items</li>
                <li>Engage in price manipulation or fraud</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">5. Prohibited Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                The following items are prohibited from being listed on A9dhily:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Illegal drugs and controlled substances</li>
                <li>Weapons and ammunition</li>
                <li>Counterfeit or replica items</li>
                <li>Stolen goods</li>
                <li>Hazardous materials</li>
                <li>Adult content or pornography</li>
                <li>Items that infringe on intellectual property rights</li>
                <li>Live animals (except as permitted by law)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">6. Buying and Selling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  For Sellers
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Provide accurate and complete product descriptions</li>
                  <li>Use clear, high-quality images</li>
                  <li>Set fair and reasonable prices</li>
                  <li>Ship items promptly and securely</li>
                  <li>Respond to buyer inquiries in a timely manner</li>
                  <li>Honor all commitments and agreements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  For Buyers
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Pay for items promptly</li>
                  <li>Communicate clearly with sellers</li>
                  <li>Provide accurate shipping information</li>
                  <li>Leave honest and fair reviews</li>
                  <li>Report any issues or disputes promptly</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">7. Payment and Fees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Payment Processing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    All payments are processed securely through Stripe. We do not store your payment information on our servers.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Platform Fees
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    A9dhily charges a small percentage fee on successful sales. The exact fee structure is displayed before listing items.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Refunds and Disputes
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Refund policies are determined by individual sellers. We provide dispute resolution services to help resolve conflicts between buyers and sellers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">8. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                The Platform and its original content, features, and functionality are owned by A9dhily and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                You retain ownership of content you submit to the Platform, but grant us a license to use, display, and distribute such content in connection with the Platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">9. Privacy and Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, to understand our practices.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">10. Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                The Platform is provided "as is" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Uninterrupted or error-free service</li>
                <li>Accuracy of product descriptions or prices</li>
                <li>Quality or condition of items sold</li>
                <li>Behavior of other users</li>
                <li>Security of transactions or communications</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">11. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                A9dhily shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">12. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We may terminate or suspend your account and bar access to the Platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Upon termination, your right to use the Platform will cease immediately. If you wish to terminate your account, you may simply discontinue using the Platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">13. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                These Terms shall be interpreted and governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">14. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                What constitutes a material change will be determined at our sole discretion.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">15. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <p><strong>Email:</strong> legal@a9dhily.com</p>
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
