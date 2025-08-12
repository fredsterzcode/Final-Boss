'use client'

import { createClient } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'

const SupabaseContext = createContext<any>(null)

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    // Debug: Log environment variables
    console.log('Environment variables check:', {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
    })
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables:', {
        supabaseUrl: supabaseUrl || 'NOT SET',
        supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET'
      })
      // Return a mock client to prevent crashes
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
          signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          signOut: async () => ({ error: null })
        }
      }
    }
    
    console.log('Creating Supabase client with URL:', supabaseUrl)
    return createClient(supabaseUrl, supabaseAnonKey)
  })

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (context === null) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
