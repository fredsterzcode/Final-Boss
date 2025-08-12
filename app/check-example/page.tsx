'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Car, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { format, addDays, isBefore } from 'date-fns'

import { mockMOTApiExample as mockMOTApi } from '../../lib/mot-api'

export default function CheckExamplePage() {
  const [registration, setRegistration] = useState('')
  const [loading, setLoading] = useState(false)
  const [vehicleData, setVehicleData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!registration.trim()) return

    setLoading(true)
    setError('')
    setVehicleData(null)

    try {
      const data = await mockMOTApi(registration)
      setVehicleData(data)
    } catch (err) {
      setError('Failed to fetch vehicle information')
    } finally {
      setLoading(false)
    }
  }

  const getMOTStatus = (motDue: string) => {
    const dueDate = new Date(motDue)
    const today = new Date()
    const thirtyDaysFromNow = addDays(today, 30)

    if (isBefore(dueDate, today)) {
      return { status: 'expired', icon: <XCircle className="w-5 h-5 text-red-500" />, text: 'Expired', color: 'text-red-600', bgColor: 'bg-red-50' }
    } else if (isBefore(dueDate, thirtyDaysFromNow)) {
      return { status: 'due-soon', icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />, text: 'Due Soon', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
    } else {
      return { status: 'up-to-date', icon: <CheckCircle className="w-5 h-5 text-green-500" />, text: 'Up to Date', color: 'text-green-600', bgColor: 'bg-green-50' }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                MOT Alert
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Check MOT Status Example
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how MOT Alert works by checking a sample vehicle registration. 
            This demonstrates the kind of information you'll get for your own vehicles.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow rounded-lg p-8 mb-8">
          <form onSubmit={handleCheck} className="max-w-md mx-auto">
            <div className="mb-6">
              <label htmlFor="registration" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Registration Number
              </label>
              <div className="relative">
                <input
                  id="registration"
                  type="text"
                  required
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value.toUpperCase())}
                  className="input-field text-center text-lg font-mono tracking-wider pr-12"
                  placeholder="AB12 CDE"
                  maxLength={8}
                />
                <button
                  type="submit"
                  disabled={loading || !registration.trim()}
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Try entering any registration number (e.g., AB12 CDE)
              </p>
            </div>
          </form>
        </div>

        {/* Results */}
        {vehicleData && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-medium text-gray-900">
                Vehicle Information
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registration:</span>
                      <span className="font-mono font-medium">{vehicleData.registration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Make:</span>
                      <span className="font-medium">{vehicleData.make}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Model:</span>
                      <span className="font-medium">{vehicleData.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Colour:</span>
                      <span className="font-medium">{vehicleData.colour}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fuel Type:</span>
                      <span className="font-medium">{vehicleData.fuel_type}</span>
                    </div>
                  </div>
                </div>

                {/* MOT Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">MOT Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">MOT Due:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {format(new Date(vehicleData.mot_due), 'dd MMM yyyy')}
                        </span>
                        {getMOTStatus(vehicleData.mot_due).icon}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last MOT:</span>
                      <span className="font-medium">
                        {format(new Date(vehicleData.last_mot), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-medium">{vehicleData.mileage}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Banner */}
              <div className={`mt-6 p-4 rounded-lg ${getMOTStatus(vehicleData.mot_due).bgColor}`}>
                <div className="flex items-center justify-center space-x-2">
                  {getMOTStatus(vehicleData.mot_due).icon}
                  <span className={`font-medium ${getMOTStatus(vehicleData.mot_due).color}`}>
                    MOT Status: {getMOTStatus(vehicleData.mot_due).text}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">
                  Want to track this vehicle and get MOT reminders?
                </p>
                <Link href="/auth/signup" className="btn-primary">
                  Sign Up for MOT Alert
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="mt-12 bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How MOT Alert Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Add Your Vehicle</h3>
              <p className="text-gray-600">Enter your registration number and we'll fetch the MOT information automatically</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Get Reminders</h3>
              <p className="text-gray-600">Receive email notifications 30 days before your MOT is due</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Car className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Stay Compliant</h3>
              <p className="text-gray-600">Never miss an MOT again and avoid fines</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-12 text-center">
          <div className="bg-white shadow rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Today</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">£3</span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-gray-600 mb-6">14-day free trial, no credit card required</p>
            <Link href="/auth/signup" className="btn-primary w-full">
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
