import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'
import Stripe from 'stripe'

// Create Supabase client lazily to avoid build-time errors
function getSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break
      
      case 'invoice.payment_action_required':
        await handlePaymentActionRequired(event.data.object as Stripe.Invoice, supabase)
        break
      
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer, supabase)
        break
      
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer, supabase)
        break
      
      case 'customer.deleted':
        await handleCustomerDeleted(event.data.object as Stripe.Customer, supabase)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session, supabase: any) {
  console.log('Processing checkout session completed:', session.id)
  
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    const userId = session.metadata?.supabase_user_id

    if (userId) {
      console.log('Updating subscription for user:', userId)
      
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
      
      console.log('Subscription updated successfully')
    } else {
      console.error('No user ID found in session metadata')
    }
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription created:', subscription.id)
  
  const userId = subscription.metadata?.supabase_user_id
  if (userId) {
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription updated:', subscription.id)
  
  const userId = subscription.metadata?.supabase_user_id
  if (userId) {
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing subscription deleted:', subscription.id)
  
  const userId = subscription.metadata?.supabase_user_id
  if (userId) {
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('user_id', userId)
  }
}

async function handleTrialWillEnd(subscription: Stripe.Subscription, supabase: any) {
  console.log('Processing trial will end:', subscription.id)
  
  const userId = subscription.metadata?.supabase_user_id
  if (userId) {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('user_id', userId)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing payment failed:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    const userId = subscription.metadata?.supabase_user_id
    
    if (userId) {
      await supabase
        .from('subscriptions')
        .update({ 
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('user_id', userId)
    }
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing payment succeeded:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    const userId = subscription.metadata?.supabase_user_id
    
    if (userId) {
      await supabase
        .from('subscriptions')
        .update({ 
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('user_id', userId)
    }
  }
}

async function handlePaymentActionRequired(invoice: Stripe.Invoice, supabase: any) {
  console.log('Processing payment action required:', invoice.id)
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
    const userId = subscription.metadata?.supabase_user_id
    
    if (userId) {
      await supabase
        .from('subscriptions')
        .update({ 
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('user_id', userId)
    }
  }
}

async function handleCustomerCreated(customer: Stripe.Customer, supabase: any) {
  console.log('Processing customer created:', customer.id)
  // Customer creation is handled by subscription events
}

async function handleCustomerUpdated(customer: Stripe.Customer, supabase: any) {
  console.log('Processing customer updated:', customer.id)
  // Customer updates are handled by subscription events
}

async function handleCustomerDeleted(customer: Stripe.Customer, supabase: any) {
  console.log('Processing customer deleted:', customer.id)
  // Customer deletion is handled by subscription events
}
