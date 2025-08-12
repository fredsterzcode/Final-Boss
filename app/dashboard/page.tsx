'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../providers'
import { useStripeCheckout } from '../../lib/hooks/useStripeCheckout'
import { 
  Car, 
  Plus, 
  Bell, 
  Settings, 
  LogOut, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Crown,
  Calendar,
  CreditCard
} from 'lucide-react'
import { 
  hasActiveSubscription, 
  canAccessPremiumFeatures, 
  getSubscriptionStatusText, 
  getSubscriptionStatusColor,
  isSubscriptionExpiringSoon,
  getDaysUntilExpiry,
  type Subscription 
} from '../../lib/subscription-utils'

interface Vehicle {
  id: string
  registration: string
  nickname?: string
  make?: string
  model?: string
  mot_due: string
  status: string
  days_until_due: number
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = useSupabase()
  const { upgradeToMonthly, upgradeToAnnual, loading: checkoutLoading } = useStripeCheckout()

  useEffect(() => {
    checkUser()
    fetchData()
    checkSelectedPlan()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
      return
    }
    setUser(user)
  }

  const checkSelectedPlan = () => {
    const selectedPlan = localStorage.getItem('selectedPlan')
    if (selectedPlan && !subscription) {
      // User has a selected plan but no subscription - show upgrade prompt
      setShowUpgradePrompt(true)
    }
  }

  const handleCompleteSubscription = () => {
    const selectedPlan = localStorage.getItem('selectedPlan')
    if (selectedPlan === 'annual') {
      upgradeToAnnual()
    } else {
      upgradeToMonthly()
    }
    // Clear the selected plan
    localStorage.removeItem('selectedPlan')
    setShowUpgradePrompt(false)
  }

  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch subscription first - handle duplicate records
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (subscriptionError) {
        console.error('Error fetching subscription:', subscriptionError)
        // Create a subscription record for the user
        const { data: newSubscription, error: createError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: user.id,
            status: 'inactive'
          })
          .select()
          .single()
        
        if (newSubscription && !createError) {
          setSubscription(newSubscription)
        }
      } else if (subscriptionData && subscriptionData.length > 0) {
        // Use the most recent subscription record
        setSubscription(subscriptionData[0])
        
        // If there are multiple records, clean them up in the background
        if (subscriptionData.length > 1) {
          console.log(`Found ${subscriptionData.length} subscription records, cleaning up duplicates...`)
          // Keep only the most recent one, delete the rest
          const idsToDelete = subscriptionData.slice(1).map((sub: Subscription) => sub.id)
          if (idsToDelete.length > 0) {
            await supabase
              .from('subscriptions')
              .delete()
              .in('id', idsToDelete)
          }
        }
      }

      // Only fetch vehicles if user has active subscription
      if (canAccessPremiumFeatures(subscriptionData)) {
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

  const isPremium = canAccessPremiumFeatures(subscription)

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
                  onClick={() => router.push('/')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Main Site
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Required */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 mb-8">
              <Crown className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {subscription ? 'Subscription Required' : 'Welcome to MOT Alert!'}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {subscription 
                ? 'Your subscription is currently inactive. Please renew to continue accessing your MOT tracking service.'
                : 'Get started with professional MOT tracking, SMS reminders, and unlimited vehicle management.'
              }
            </p>
            
            {subscription && (
              <div className="bg-white rounded-lg p-6 shadow-sm border mb-8 max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Status</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${getSubscriptionStatusColor(subscription)}-100 text-${getSubscriptionStatusColor(subscription)}-800`}>
                    {getSubscriptionStatusText(subscription)}
                  </span>
                </div>
                {subscription.current_period_end && (
                  <p className="text-sm text-gray-600">
                    Expires: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => router.push('/pricing')}
                className="w-full max-w-md bg-blue-600 text-white py-4 px-8 rounded-lg text-xl font-bold hover:bg-blue-700 transition-colors"
              >
                View Pricing Plans
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full max-w-md bg-gray-100 text-gray-700 py-4 px-8 rounded-lg text-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Learn More
              </button>
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
                onClick={() => router.push('/')}
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

        {/* Upgrade Prompt Banner */}
        {showUpgradePrompt && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Complete Your Subscription
                  </h3>
                  <p className="text-blue-700">
                    You've selected a plan - let's get you started with premium MOT tracking!
                  </p>
                </div>
              </div>
              <button
                onClick={handleCompleteSubscription}
                disabled={checkoutLoading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Processing...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}

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
                  <p className="font-medium">{new Date(subscription.current_period_end).toLocaleDateString()}</p>
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
                          {new Date(vehicle.mot_due).toLocaleDateString()}
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
