'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '../providers'
import { useStripeCheckout } from '../../lib/hooks/useStripeCheckout'
import { format, addDays, isAfter, isBefore, differenceInDays } from 'date-fns'
import { Car, Plus, Crown, AlertTriangle, CheckCircle, XCircle, Lock } from 'lucide-react'

interface Vehicle {
  id: string
  registration: string
  nickname?: string
  make?: string
  model?: string
  mot_due: string
  status: 'up_to_date' | 'due_soon' | 'expired'
  days_until_due: number
}

interface Subscription {
  id: string
  status: string
  current_period_end?: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useSupabase()
  const { upgradeToMonthly, loading: checkoutLoading } = useStripeCheckout()

  useEffect(() => {
    checkUser()
    fetchData()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setUser(user)
  }

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch subscription first
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (subscriptionData) {
        setSubscription(subscriptionData)
      }

      // Only fetch vehicles if user has active subscription
      if (subscriptionData && (subscriptionData.status === 'active' || subscriptionData.status === 'trialing')) {
        try {
          const { data: vehiclesData } = await supabase
            .rpc('get_vehicles_with_status', { user_uuid: user.id })

          if (vehiclesData) {
            setVehicles(vehiclesData)
          }
        } catch (error) {
          console.error('Error fetching vehicles:', error)
          // Function might not exist yet, that's okay
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up_to_date':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'due_soon':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'up_to_date':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">✅ Up to date</span>
      case 'due_soon':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">⚠️ Due soon</span>
      case 'expired':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">❌ Expired</span>
      default:
        return null
    }
  }

  const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If no subscription, show subscription required screen
  if (!subscription || !isPremium) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <Car className="w-8 h-8 text-primary-600" />
                <h1 className="text-2xl font-bold text-gray-900">MOT Alert</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/main-home-page')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Main Site
                </button>
                <button
                  onClick={() => router.push('/account')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Account
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Subscription Required */}
          <div className="text-center">
            <Lock className="w-24 h-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Subscribe to MOT Alert
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Get unlimited vehicle tracking, SMS reminders, and never miss an MOT again. 
              Start with a 14-day free trial, then just £3/month.
            </p>
            <div className="mb-8">
              <Link href="/pricing" className="text-blue-600 hover:text-blue-800 font-medium underline">
                View full pricing options →
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Car className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlimited Vehicles</h3>
                <p className="text-gray-600">Track as many vehicles as you need</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <AlertTriangle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">SMS Reminders</h3>
                <p className="text-gray-600">Get notified 30 days before MOT due</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <Crown className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Priority Support</h3>
                <p className="text-gray-600">Get help when you need it most</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">Premium MOT Alert</h2>
                <div className="text-6xl font-bold mb-2">£3</div>
                <div className="text-xl text-primary-100 mb-6">per month</div>
                <div className="bg-white/20 rounded-lg p-4 mb-6">
                  <p className="text-lg font-semibold">✨ 14 Days Free Trial</p>
                  <p className="text-primary-100">Try all premium features before you pay</p>
                </div>
                <button
                  onClick={upgradeToMonthly}
                  disabled={checkoutLoading}
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {checkoutLoading ? 'Loading...' : 'Start Free Trial Now'}
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="text-gray-500 text-sm">
              <p>✓ Cancel anytime • ✓ No setup fees • ✓ Secure payments via Stripe</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Premium user dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">MOT Alert</h1>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/main-home-page')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Main Site
              </button>
              <button
                onClick={() => router.push('/account')}
                className="text-gray-600 hover:text-gray-900"
              >
                Account
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h2>
          <p className="text-gray-600">
            You're on Premium - enjoy unlimited vehicles and SMS reminders!
          </p>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium capitalize">{subscription.status}</p>
              </div>
              {subscription.current_period_end && (
                <div>
                  <p className="text-sm text-gray-600">Next billing</p>
                  <p className="font-medium">{format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="font-medium">Premium</p>
              </div>
            </div>
          </div>
        )}

        {/* Vehicles Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Vehicles</h3>
              <button
                onClick={() => router.push('/dashboard/add-vehicle')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {vehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles yet</h3>
                <p className="text-gray-600 mb-6">
                  Add your first vehicle to start tracking MOT due dates
                </p>
                <button
                  onClick={() => router.push('/dashboard/add-vehicle')}
                  className="btn-primary"
                >
                  Add Your First Vehicle
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(vehicle.status)}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {vehicle.registration}
                        </h4>
                        {vehicle.nickname && (
                          <p className="text-sm text-gray-600">{vehicle.nickname}</p>
                        )}
                        {vehicle.make && vehicle.model && (
                          <p className="text-sm text-gray-500">
                            {vehicle.make} {vehicle.model}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">MOT Due</p>
                        <p className="font-medium text-gray-900">
                          {format(new Date(vehicle.mot_due), 'MMM dd, yyyy')}
                        </p>
                        {vehicle.days_until_due > 0 && (
                          <p className="text-xs text-gray-500">
                            in {vehicle.days_until_due} days
                          </p>
                        )}
                        {vehicle.days_until_due < 0 && (
                          <p className="text-xs text-red-500">
                            {Math.abs(vehicle.days_until_due)} days overdue
                          </p>
                        )}
                      </div>
                      {getStatusBadge(vehicle.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
