'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Clock, Car, Shield, Bell, ArrowRight } from 'lucide-react'
import { ADMIN_ACCESS_CODE, LAUNCH_DATE } from '@/lib/site-status'

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [showAdminForm, setShowAdminForm] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = LAUNCH_DATE.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminCode === ADMIN_ACCESS_CODE) {
      // Redirect to dashboard instead of home to bypass protection
      router.push('/dashboard')
    } else {
      setError('Invalid access code')
      setAdminCode('')
    }
  }

  const toggleAdminForm = () => {
    setShowAdminForm(!showAdminForm)
    setError('')
    setAdminCode('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Logo and Title */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            MOT Alert
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Professional MOT tracking service coming soon
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-700 mb-8 flex items-center justify-center">
            <Clock className="w-6 h-6 mr-2" />
            Launching in
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">{timeLeft.days}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Days</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">{timeLeft.hours}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Hours</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">{timeLeft.minutes}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Minutes</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-blue-600">{timeLeft.seconds}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Seconds</div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-700 mb-8">What's Coming</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">SMS Reminders</h4>
              <p className="text-gray-600">Never miss an MOT with automated SMS notifications</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Unlimited Vehicles</h4>
              <p className="text-gray-600">Track as many vehicles as you need</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Priority Support</h4>
              <p className="text-gray-600">Get help when you need it most</p>
            </div>
          </div>
        </div>

                 {/* Pricing Link */}
         <div className="mt-12">
           <Link 
             href="/pricing" 
             className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
           >
             View Pricing
             <ArrowRight className="w-4 h-4 ml-2" />
           </Link>
         </div>

         {/* Admin Access */}
         <div className="mt-16">
           <button
             onClick={toggleAdminForm}
             className="text-sm text-gray-500 hover:text-gray-700 underline"
           >
             Admin Access
           </button>
          
          {showAdminForm && (
            <div className="mt-4 p-6 bg-white rounded-lg shadow-lg max-w-sm mx-auto">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Admin Access</h4>
              <form onSubmit={handleAdminSubmit}>
                <input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Access Site
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
