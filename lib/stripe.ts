import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Price IDs for different subscription tiers
export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly_placeholder',
  annual: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual_placeholder',
} as const

// Get price ID based on plan type
export const getPriceId = (planType: 'monthly' | 'annual') => {
  return STRIPE_PRICES[planType]
}

// Subscription status types
export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'

// Create customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  
  return session
}
