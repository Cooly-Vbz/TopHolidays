import { encryptionService } from './crypto'

const USER_KEY = 'auth:user'
const ACCOUNTS_KEY = 'auth:accounts'
const SETTINGS_KEY = 'auth:settings'

export type UserProfile = {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
  provider?: 'local' | 'google' | 'facebook' | 'apple' | 'github'
  providerId?: string
}

export type AuthState = {
  user: UserProfile | null
}

export type AccountSettings = {
  twoFactorEnabled: boolean
  marketingEmails: boolean
  personalizedRecommendations: boolean
  paymentMethods: Array<{ id: string; brand: string; last4: string; exp: string }>
  addresses: Array<{ id: string; label: string; line1: string; city: string; country: string }>
}

const defaultSettings: AccountSettings = {
  twoFactorEnabled: false,
  marketingEmails: true,
  personalizedRecommendations: true,
  paymentMethods: [],
  addresses: [],
}

function getSalt(email: string) {
  return `th-${email}-salt`
}

async function hashPassword(email: string, password: string) {
  const data = new TextEncoder().encode(`${email}:${password}:${getSalt(email)}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export type StoredUser = {
  email: string
  passwordHash: string
  encryptedProfile: string // Encrypted JSON string
}

function loadStored(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return {
      email: parsed.email,
      passwordHash: parsed.passwordHash,
      encryptedProfile: parsed.encryptedProfile, // Now a string
    }
  } catch {
    return null
  }
}

function saveStored(user: StoredUser | null) {
  if (!user) {
    localStorage.removeItem(USER_KEY)
    return
  }
  const serializable = {
    email: user.email,
    passwordHash: user.passwordHash,
    encryptedProfile: user.encryptedProfile, // Now a string
  }
  localStorage.setItem(USER_KEY, JSON.stringify(serializable))
}

function loadAccounts(): StoredUser[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((acc: any) => ({
      email: acc.email,
      passwordHash: acc.passwordHash,
      encryptedProfile: acc.encryptedProfile, // Now a string
    }))
  } catch {
    return []
  }
}

function saveAccounts(accounts: StoredUser[]) {
  const serializable = accounts.map(acc => ({
    email: acc.email,
    passwordHash: acc.passwordHash,
    encryptedProfile: acc.encryptedProfile, // Now a string
  }))
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(serializable))
}

function upsertAccount(user: StoredUser) {
  const accounts = loadAccounts()
  const idx = accounts.findIndex(a => a.email === user.email)
  if (idx >= 0) accounts[idx] = user
  else accounts.push(user)
  saveAccounts(accounts)
}

export async function signUp(email: string, password: string, displayName?: string) {
  const existing = loadStored()
  if (existing && existing.email === email) {
    throw new Error('An account already exists for this email on this device.')
  }
  const passwordHash = await hashPassword(email, password)
  const profile: UserProfile = {
    id: crypto.randomUUID(),
    email,
    displayName,
    createdAt: new Date().toISOString(),
  }
  const encryptedProfile = encryptionService.encryptUserData(profile)
  saveStored({ email, passwordHash, encryptedProfile })
  upsertAccount({ email, passwordHash, encryptedProfile })
  return profile
}

export async function signIn(email: string, password: string): Promise<UserProfile> {
  const stored = loadStored()
  if (!stored || stored.email !== email) {
    throw new Error('No local account found for this email on this device.')
  }
  const passwordHash = await hashPassword(email, password)
  if (passwordHash !== stored.passwordHash) {
    throw new Error('Incorrect password.')
  }
  const profile = encryptionService.decryptUserData<UserProfile>(stored.encryptedProfile)
  localStorage.setItem('auth:current', JSON.stringify({ email }))
  upsertAccount({ email, passwordHash, encryptedProfile: stored.encryptedProfile })
  return profile
}

export function signOut() {
  localStorage.removeItem('auth:current')
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const raw = localStorage.getItem('auth:current')
    if (!raw) return null
    const { email } = JSON.parse(raw)
    const stored = loadStored()
    if (!stored || stored.email !== email) return null
    const profile = encryptionService.decryptUserData<UserProfile>(stored.encryptedProfile)
    return profile
  } catch {
    return null
  }
}

export async function signInWithOAuth(provider: 'google' | 'facebook' | 'apple' | 'github'): Promise<UserProfile> {
  // Mock OAuth implementation for demo purposes
  const mockProfiles = {
    google: { email: 'user@gmail.com', displayName: 'Google User', providerId: 'google_123' },
    facebook: { email: 'user@facebook.com', displayName: 'Facebook User', providerId: 'facebook_123' },
    apple: { email: 'user@apple.com', displayName: 'Apple User', providerId: 'apple_123' },
    github: { email: 'user@github.com', displayName: 'GitHub User', providerId: 'github_123' },
  }
  
  const mockData = mockProfiles[provider]
  if (!mockData) throw new Error(`OAuth provider ${provider} not supported`)
  
  // Check if user already exists
  const existing = loadStored()
  if (existing && existing.email === mockData.email) {
    const profile = encryptionService.decryptUserData<UserProfile>(existing.encryptedProfile)
    localStorage.setItem('auth:current', JSON.stringify({ email: mockData.email }))
    return profile
  }
  
  // Create new OAuth user
  const profile: UserProfile = {
    id: crypto.randomUUID(),
    email: mockData.email,
    displayName: mockData.displayName,
    provider,
    providerId: mockData.providerId,
    createdAt: new Date().toISOString(),
  }
  
  // Generate a secure password hash for OAuth users
  const passwordHash = await hashPassword(mockData.email, `oauth_${provider}_${mockData.providerId}`)
  const encryptedProfile = encryptionService.encryptUserData(profile)
  saveStored({ email: mockData.email, passwordHash, encryptedProfile })
  upsertAccount({ email: mockData.email, passwordHash, encryptedProfile })
  localStorage.setItem('auth:current', JSON.stringify({ email: mockData.email }))
  return profile
}

export async function signUpWithOAuth(provider: 'google' | 'facebook' | 'apple' | 'github'): Promise<UserProfile> {
  return signInWithOAuth(provider) // Same implementation for sign up
}
export async function updateProfile(next: Partial<UserProfile>, password?: string): Promise<UserProfile> {
  const stored = loadStored()
  if (!stored) throw new Error('No local account stored.')

  // If password is provided, verify it before allowing the update
  if (password) {
    const providedHash = await hashPassword(stored.email, password)
    if (providedHash !== stored.passwordHash) {
      throw new Error('Incorrect password.')
    }
  }

  const current = encryptionService.decryptUserData<UserProfile>(stored.encryptedProfile)
  const updated: UserProfile = { ...current, ...next }
  const encryptedProfile = encryptionService.encryptUserData(updated)
  saveStored({ email: stored.email, passwordHash: stored.passwordHash, encryptedProfile })
  upsertAccount({ email: stored.email, passwordHash: stored.passwordHash, encryptedProfile })
  localStorage.setItem('auth:current', JSON.stringify({ email: stored.email }))
  return updated
}

export async function listAccounts(): Promise<Array<{ email: string; displayName?: string }>> {
  const accounts = loadAccounts()
  const result: Array<{ email: string; displayName?: string }> = []
  for (const acc of accounts) {
    try {
      const profile = encryptionService.decryptUserData<UserProfile>(acc.encryptedProfile)
      result.push({ email: acc.email, displayName: profile.displayName })
    } catch {
      result.push({ email: acc.email })
    }
  }
  return result
}

export function switchAccount(email: string): void {
  const accounts = loadAccounts()
  const match = accounts.find(a => a.email === email)
  if (!match) throw new Error('Account not found on this device.')
  localStorage.setItem('auth:current', JSON.stringify({ email }))
}

export function isDevUser(user: UserProfile | null): boolean {
  const devEmails = ['dev@topholidays.dev', 'dev@localhost']
  const name = user?.displayName?.toLowerCase() || ''
  const email = user?.email?.toLowerCase() || ''
  return name === 'dev' || devEmails.includes(email)
}

export function loadSettings(): AccountSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    if (parsed && parsed.encryptedProfile && parsed.secretVersion === 1) {
      return encryptionService.decryptUserData<AccountSettings>(parsed.encryptedProfile)
    }
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(next: AccountSettings) {
  try {
    const payload = encryptionService.encryptUserData(next)
    const serializable = {
      encryptedProfile: payload,
      secretVersion: 1,
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(serializable))
  } catch {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }
}

