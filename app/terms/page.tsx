import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <Image
                  src="/images/logo.png"
                  alt="MOT Alert Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold text-gray-900">MOT Alert</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border p-8 md:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: January 15, 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              These Terms of Service ("Terms") govern your use of MOT Alert, a service provided by FAC Systems Ltd ("we," "our," or "us"). By using our service, you agree to be bound by these Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              1. Service Description
            </h2>
            <p className="text-gray-600 mb-4">
              MOT Alert is a subscription-based service that provides MOT tracking and reminder notifications for vehicles. Our service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>MOT due date tracking and reminders</li>
              <li>Email and SMS notifications</li>
              <li>Vehicle management dashboard</li>
              <li>Customer support services</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              2. Account Registration
            </h2>
            <p className="text-gray-600 mb-4">
              To use our service, you must:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Be at least 18 years old</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              3. Subscription and Payment
            </h2>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3.1 Pricing
            </h3>
            <p className="text-gray-600 mb-4">
              Our service is offered at £3 per month after a 14-day free trial period. Pricing is subject to change with 30 days' notice.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3.2 Payment Processing
            </h3>
            <p className="text-gray-600 mb-4">
              Payments are processed securely through Stripe. By subscribing, you authorize us to charge your payment method for the subscription fee.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3.3 Billing Cycle
            </h3>
            <p className="text-gray-600 mb-4">
              Subscriptions are billed monthly in advance. The first billing occurs after the 14-day free trial period ends.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
              3.4 Cancellation
            </h3>
            <p className="text-gray-600 mb-4">
              You may cancel your subscription at any time through your account settings or by contacting customer support. Cancellation takes effect at the end of the current billing period.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-gray-600 mb-4">
              You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Share your account credentials with others</li>
              <li>Use the service to send spam or unsolicited messages</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              5. Vehicle Information
            </h2>
            <p className="text-gray-600 mb-4">
              You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Providing accurate vehicle registration numbers</li>
              <li>Ensuring you have permission to track vehicles</li>
              <li>Verifying MOT information independently</li>
              <li>Complying with all applicable laws and regulations</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              6. Service Availability
            </h2>
            <p className="text-gray-600 mb-4">
              We strive to provide reliable service but cannot guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>100% uptime or availability</li>
              <li>Immediate delivery of notifications</li>
              <li>Accuracy of third-party MOT data</li>
              <li>Compatibility with all devices or browsers</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, we shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from missed MOT deadlines</li>
              <li>Issues with third-party services or data</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Our total liability shall not exceed the amount paid by you for the service in the 12 months preceding the claim.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              8. Privacy and Data Protection
            </h2>
            <p className="text-gray-600 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              9. Intellectual Property
            </h2>
            <p className="text-gray-600 mb-4">
              The MOT Alert service, including its design, functionality, and content, is owned by FAC Systems Ltd and protected by intellectual property laws. You may not copy, modify, or distribute our service without permission.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              10. Third-Party Services
            </h2>
            <p className="text-gray-600 mb-4">
              Our service integrates with third-party services including:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Stripe for payment processing</li>
              <li>Resend for email delivery</li>
              <li>Vonage for SMS delivery</li>
              <li>Supabase for database and authentication</li>
            </ul>
            <p className="text-gray-600 mb-4">
              These services have their own terms and privacy policies, and we are not responsible for their practices.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              11. Termination
            </h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your account if you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Violate these Terms</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Fail to pay subscription fees</li>
              <li>Abuse or misuse the service</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              12. Changes to Terms
            </h2>
            <p className="text-gray-600 mb-4">
              We may update these Terms from time to time. We will notify you of material changes by email or through our service. Continued use of the service after changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              13. Governing Law
            </h2>
            <p className="text-gray-600 mb-4">
              These Terms are governed by the laws of England and Wales. Any disputes shall be resolved in the courts of England and Wales.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              14. Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> <a href="mailto:info@facsystems.co.uk" className="text-primary-600 hover:underline">info@facsystems.co.uk</a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong> <a href="tel:+03333220408" className="text-primary-600 hover:underline">+0333 322 0408</a>
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> FAC Systems Ltd, United Kingdom
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              15. Acknowledgment
            </h2>
            <p className="text-gray-600 mb-4">
              By using MOT Alert, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/images/logo.png"
                  alt="MOT Alert Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-xl font-bold">MOT Alert</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional MOT tracking service helping drivers across the UK stay compliant and safe.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/check-example" className="hover:text-white transition-colors">Check Example</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/#contact" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><a href="tel:+03333220408" className="hover:text-white transition-colors">+0333 322 0408</a></li>
                <li><a href="mailto:info@facsystems.co.uk" className="hover:text-white transition-colors">info@facsystems.co.uk</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MOT Alert. A service of FAC Systems Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
