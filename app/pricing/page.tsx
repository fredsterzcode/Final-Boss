'use client'

import { useState } from 'react'
import { Check, Star, Car, Bell, Shield, Clock } from 'lucide-react'
import { useStripeCheckout } from '../../lib/hooks/useStripeCheckout'
import { useSupabase } from '../providers'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const { upgradeToMonthly, upgradeToAnnual, loading } = useStripeCheckout()
  const supabase = useSupabase()
  const router = useRouter()

  const features = [
    'Unlimited vehicle tracking',
    'SMS MOT reminders',
    'Email notifications',
    'Priority customer support',
    'Mobile app access',
    'Export vehicle history'
  ]

  const handleUpgrade = async () => {
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // Redirect to sign in if not logged in
      router.push('/auth/signin')
      return
    }

    // Proceed with checkout based on selected plan
    if (isAnnual) {
      await upgradeToAnnual()
    } else {
      await upgradeToMonthly()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for you. All plans include our full MOT tracking service.
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg border">
            <div className="flex">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  !isAnnual
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  isAnnual
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annual
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 relative">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
              <p className="text-gray-600 mb-6">Perfect for individual users</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  £{isAnnual ? '30' : '3'}
                </span>
                <span className="text-gray-600 ml-2">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              {isAnnual && (
                <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                  Save £6/year
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <div className="text-sm text-gray-500 mb-4">
                Limited to 3 vehicles
              </div>
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl border border-blue-200 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Most Popular
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
              <p className="text-gray-600 mb-6">Unlimited vehicles & features</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  £{isAnnual ? '60' : '6'}
                </span>
                <span className="text-gray-600 ml-2">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              {isAnnual && (
                <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full inline-block">
                  Save £12/year
                </div>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="text-center">
              <button 
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Get ${isAnnual ? 'Annual' : 'Monthly'} Plan`}
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Everything you need to stay MOT compliant
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vehicle Management
              </h3>
              <p className="text-gray-600">
                Track unlimited vehicles with detailed MOT history and expiry dates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Reminders
              </h3>
              <p className="text-gray-600">
                Get SMS and email notifications before your MOT expires
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Priority Support
              </h3>
              <p className="text-gray-600">
                Dedicated support team to help with any questions
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I miss an MOT?
              </h3>
              <p className="text-gray-600">
                We'll send you multiple reminders before your MOT expires. If you still miss it, you can quickly check when you can book a new one.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600">
                No setup fees! Just pay your monthly or annual subscription and you're ready to go.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
