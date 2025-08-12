import { useState } from 'react'
import { useSupabase } from '../../app/providers'
import { STRIPE_PRICES } from '../stripe'

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabase()

  const createCheckoutSession = async (priceId: string) => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to upgrade')
      }

      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await loadStripe()
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw new Error(error.message)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const upgradeToPremium = () => createCheckoutSession(STRIPE_PRICES.premium)

  return {
    createCheckoutSession,
    upgradeToPremium,
    loading,
    error,
  }
}

// Load Stripe dynamically
const loadStripe = async () => {
  if (typeof window === 'undefined') return null
  
  try {
    const { loadStripe } = await import('@stripe/stripe-js')
    return await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  } catch (error) {
    console.error('Failed to load Stripe:', error)
    return null
  }
}
