// Create Supabase client lazily to avoid build-time errors
function getSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  status: string
  current_period_end?: string
  created_at: string
  updated_at: string
}

export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'
  | 'inactive'

/**
 * Check if a user has an active subscription
 */
export function hasActiveSubscription(subscription: Subscription | null): boolean {
  if (!subscription) return false
  
  const activeStatuses: SubscriptionStatus[] = ['active', 'trialing']
  return activeStatuses.includes(subscription.status as SubscriptionStatus)
}

/**
 * Check if a user's subscription is in a grace period (past due but not yet canceled)
 */
export function isInGracePeriod(subscription: Subscription | null): boolean {
  if (!subscription) return false
  
  return subscription.status === 'past_due'
}

/**
 * Check if a user's subscription has been canceled
 */
export function isSubscriptionCanceled(subscription: Subscription | null): boolean {
  if (!subscription) return false
  
  return subscription.status === 'canceled'
}

/**
 * Check if a user can access premium features
 */
export function canAccessPremiumFeatures(subscription: Subscription | null): boolean {
  return hasActiveSubscription(subscription) || isInGracePeriod(subscription)
}

/**
 * Check if a user can add vehicles
 */
export function canAddVehicles(subscription: Subscription | null): boolean {
  return canAccessPremiumFeatures(subscription)
}

/**
 * Check if a user can receive notifications
 */
export function canReceiveNotifications(subscription: Subscription | null): boolean {
  return hasActiveSubscription(subscription) // No grace period for notifications
}

/**
 * Get subscription status display text
 */
export function getSubscriptionStatusText(subscription: Subscription | null): string {
  if (!subscription) return 'No subscription'
  
  switch (subscription.status) {
    case 'active':
      return 'Active'
    case 'trialing':
      return 'Trial'
    case 'past_due':
      return 'Payment overdue'
    case 'canceled':
      return 'Canceled'
    case 'unpaid':
      return 'Payment failed'
    case 'incomplete':
      return 'Incomplete'
    case 'incomplete_expired':
      return 'Expired'
    case 'paused':
      return 'Paused'
    case 'inactive':
      return 'Inactive'
    default:
      return 'Unknown'
  }
}

/**
 * Get subscription status color for UI
 */
export function getSubscriptionStatusColor(subscription: Subscription | null): string {
  if (!subscription) return 'gray'
  
  switch (subscription.status) {
    case 'active':
    case 'trialing':
      return 'green'
    case 'past_due':
      return 'yellow'
    case 'canceled':
    case 'unpaid':
    case 'incomplete_expired':
      return 'red'
    case 'incomplete':
    case 'paused':
      return 'orange'
    case 'inactive':
      return 'gray'
    default:
      return 'gray'
  }
}

/**
 * Check if subscription is expiring soon (within 7 days)
 */
export function isSubscriptionExpiringSoon(subscription: Subscription | null): boolean {
  if (!subscription?.current_period_end) return false
  
  const endDate = new Date(subscription.current_period_end)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0
}

/**
 * Get days until subscription expires
 */
export function getDaysUntilExpiry(subscription: Subscription | null): number | null {
  if (!subscription?.current_period_end) return null
  
  const endDate = new Date(subscription.current_period_end)
  const now = new Date()
  const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  return daysUntilExpiry > 0 ? daysUntilExpiry : 0
}

/**
 * Fetch user subscription from database
 */
export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return null
  }
}
