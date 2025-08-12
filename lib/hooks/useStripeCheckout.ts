import { useState } from 'react'
import { useSupabase } from '../../app/providers'
import { getPriceId, getStripe } from '../stripe'

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = useSupabase()

  const createCheckoutSession = async (planType: 'monthly' | 'annual') => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to upgrade')
      }

      const priceId = getPriceId(planType)

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
      const stripe = await getStripe()
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

  const upgradeToMonthly = () => createCheckoutSession('monthly')
  const upgradeToAnnual = () => createCheckoutSession('annual')

  return {
    createCheckoutSession,
    upgradeToMonthly,
    upgradeToAnnual,
    loading,
    error,
  }
}


