'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '../../providers'
import { ArrowLeft, Loader2, Car } from 'lucide-react'

import { mockMOTApi } from '../../../lib/mot-api'

export default function AddVehiclePage() {
  const [registration, setRegistration] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [vehicleData, setVehicleData] = useState<any>(null)
  
  const supabase = useSupabase()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/signin')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Get user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('User not authenticated')
        return
      }

      // Call mock MOT API
      const motData = await mockMOTApi(registration)
      setVehicleData(motData)

      // Save to database
      const { data, error: dbError } = await supabase
        .from('vehicles')
        .insert([
          {
            user_id: user.id,
            registration: motData.registration,
            nickname: nickname || null,
            make: motData.make,
            model: motData.model,
            mot_due: motData.mot_due
          }
        ])
        .select()

      if (dbError) {
        setError(dbError.message)
      } else {
        setSuccess(true)
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="mr-4">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <span className="text-xl font-bold text-gray-900">Add New Vehicle</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Vehicle</h1>
            <p className="text-gray-600">
              Enter your vehicle registration number and we'll fetch the MOT information for you.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="registration" className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number *
                </label>
                <input
                  id="registration"
                  type="text"
                  required
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                  className="input-field text-center text-lg font-mono tracking-wider"
                  placeholder="AB12 CDE"
                  maxLength={8}
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the registration number exactly as it appears on your vehicle
                </p>
              </div>

              <div>
                <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Nickname (Optional)
                </label>
                <input
                  id="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="input-field"
                  placeholder="e.g., My Car, Work Van, Family SUV"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Give your vehicle a friendly name to help you identify it
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <Link
                  href="/dashboard"
                  className="btn-secondary flex-1 text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || !registration.trim()}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                      Adding Vehicle...
                    </div>
                  ) : (
                    'Add Vehicle'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Car className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Vehicle Added Successfully!
              </h3>
              <p className="text-gray-600 mb-4">
                Your {vehicleData?.make} {vehicleData?.model} ({vehicleData?.registration}) has been added to your account.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">How it works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We'll automatically fetch your vehicle's MOT information</li>
            <li>• You'll receive email reminders 30 days before your MOT is due</li>
            <li>• You can manage multiple vehicles from your dashboard</li>
            <li>• All data is securely stored and encrypted</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
