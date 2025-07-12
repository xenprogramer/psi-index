import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Set a maximum timeout for initialization
        const timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Auth initialization timeout, proceeding without session')
            setLoading(false)
          }
        }, 3000)

        const { data: { session }, error } = await supabase.auth.getSession()
        
        clearTimeout(timeoutId)
        
        if (!mounted) return

        if (error) {
          console.error('Session error:', error)
          setLoading(false)
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Create a simple profile without database dependency
          const simpleProfile: Profile = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.email?.split('@')[0] || 'User',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
            created_at: new Date().toISOString()
          }
          setProfile(simpleProfile)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        try {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            // Create a simple profile without database dependency
            const simpleProfile: Profile = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.email?.split('@')[0] || 'User',
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(session.user.email || 'user')}`,
              created_at: new Date().toISOString()
            }
            setProfile(simpleProfile)
          } else {
            setProfile(null)
          }
          
          setLoading(false)
        } catch (error) {
          console.error('Auth state change error:', error)
          if (mounted) {
            setLoading(false)
          }
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') }

    // Update local state immediately
    setProfile(prev => prev ? { ...prev, ...updates } : null)
    
    return { error: null }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}