'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../providers'
import { format } from 'date-fns'
import { Crown, CreditCard, Settings, Trash2, AlertTriangle } from 'lucide-react'

interface Subscription {
  id: string
  status: string
  current_period_end?: string
  stripe_customer_id?: string
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()
  const supabase = useSupabase()

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

      // Fetch subscription
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (subscriptionData) {
        setSubscription(subscriptionData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      alert('Password updated successfully!')
      e.currentTarget.reset()
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Failed to update password')
    }
  }

  const openCustomerPortal = async () => {
    try {
      setPortalLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Error opening customer portal:', error)
      alert('Failed to open customer portal')
    } finally {
      setPortalLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Delete user data from Supabase
      await supabase.from('vehicles').delete().eq('user_id', user.id)
      await supabase.from('subscriptions').delete().eq('user_id', user.id)
      await supabase.from('email_logs').delete().eq('user_id', user.id)

      // Delete the user account
      const { error } = await supabase.auth.admin.deleteUser(user.id)
      if (error) throw error

      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account')
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing'

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Account Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-gray-900 font-mono text-sm">{user?.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Member since</label>
              <p className="text-gray-900">{format(new Date(user?.created_at), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
            {isPremium && (
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <Crown className="w-4 h-4" />
                <span>Premium</span>
              </div>
            )}
          </div>

          {subscription ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-gray-900 capitalize">{subscription.status}</p>
                </div>
                {subscription.current_period_end && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Next billing</label>
                    <p className="text-gray-900">{format(new Date(subscription.current_period_end), 'MMM dd, yyyy')}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Plan</label>
                  <p className="text-gray-900">{isPremium ? 'Premium' : 'Free'}</p>
                </div>
              </div>

              {isPremium && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={openCustomerPortal}
                    disabled={portalLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{portalLoading ? 'Loading...' : 'Manage Subscription'}</span>
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Update payment methods, view billing history, or cancel your subscription
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active subscription</h3>
              <p className="text-gray-600 mb-6">
                Upgrade to Premium to get unlimited vehicles, SMS reminders, and priority support
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-primary"
              >
                View Premium Plans
              </button>
            </div>
          )}
        </div>

        {/* Password Update */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Password</h2>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="input-field mt-1"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={6}
                className="input-field mt-1"
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </form>
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Account</h2>
              <p className="text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </p>
              
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Delete Account
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-red-600 font-medium">
                    Are you sure? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {deleteLoading ? 'Deleting...' : 'Yes, Delete My Account'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
