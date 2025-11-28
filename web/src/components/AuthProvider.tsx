import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserProfile, AccountSettings } from '../lib/auth'
import { getCurrentUser, signIn as rawSignIn, signUp as rawSignUp, signInWithOAuth as rawSignInWithOAuth, signUpWithOAuth as rawSignUpWithOAuth, signOut as rawSignOut, updateProfile as rawUpdateProfile, loadSettings, saveSettings } from '../lib/auth'

export type OAuthProvider = 'google' | 'facebook' | 'apple' | 'github'

export type AuthContextValue = {
  user: UserProfile | null
  loading: boolean
  settings: AccountSettings
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>
  signUpWithOAuth: (provider: OAuthProvider) => Promise<void>
  signOut: () => void
  updateProfile: (next: Partial<UserProfile>, password?: string) => Promise<void>
  updateSettings: (updater: (prev: AccountSettings) => AccountSettings) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<AccountSettings>(() => loadSettings())

  useEffect(() => {
    let mounted = true
    getCurrentUser().then(u => {
      if (mounted) setUser(u)
    }).finally(() => {
      if (mounted) setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  const signIn = async (email: string, password: string) => {
    const u = await rawSignIn(email, password)
    setUser(u)
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    const u = await rawSignUp(email, password, displayName)
    setUser(u)
  }

  const signInWithOAuth = async (provider: OAuthProvider) => {
    const u = await rawSignInWithOAuth(provider)
    setUser(u)
  }

  const signUpWithOAuth = async (provider: OAuthProvider) => {
    const u = await rawSignUpWithOAuth(provider)
    setUser(u)
  }

  const signOut = () => {
    rawSignOut()
    setUser(null)
  }

  const updateProfile = async (next: Partial<UserProfile>, password?: string) => {
    const u = await rawUpdateProfile(next, password)
    setUser(u)
  }

  const updateSettings = (updater: (prev: AccountSettings) => AccountSettings) => {
    setSettings(prev => {
      const next = updater(prev)
      saveSettings(next)
      return next
    })
  }

  const value: AuthContextValue = {
    user,
    loading,
    settings,
    signIn,
    signUp,
    signInWithOAuth,
    signUpWithOAuth,
    signOut,
    updateProfile,
    updateSettings,
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
