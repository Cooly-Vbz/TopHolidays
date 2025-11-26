import { encryptData, decryptData } from './crypto'

const USER_KEY = 'auth:user'
const SETTINGS_KEY = 'auth:settings'
const SETTINGS_SECRET_KEY = 'auth:settings-secret'

export type UserProfile = {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  createdAt: string
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
  encryptedProfile: { encrypted: Uint8Array; iv: Uint8Array }
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
      encryptedProfile: {
        encrypted: new Uint8Array(parsed.encryptedProfile.encrypted),
        iv: new Uint8Array(parsed.encryptedProfile.iv),
      },
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
    encryptedProfile: {
      encrypted: Array.from(user.encryptedProfile.encrypted),
      iv: Array.from(user.encryptedProfile.iv),
    },
  }
  localStorage.setItem(USER_KEY, JSON.stringify(serializable))
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
  const encryptedProfile = await encryptData(profile, passwordHash)
  saveStored({ email, passwordHash, encryptedProfile })
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
  const profile = await decryptData(stored.encryptedProfile, passwordHash) as UserProfile
  localStorage.setItem('auth:current', JSON.stringify({ email }))
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
    const profile = await decryptData(stored.encryptedProfile, stored.passwordHash) as UserProfile
    return profile
  } catch {
    return null
  }
}

export async function updateProfile(next: Partial<UserProfile>, password?: string): Promise<UserProfile> {
  const stored = loadStored()
  if (!stored) throw new Error('No local account stored.')
  const passwordHash = password
    ? await hashPassword(stored.email, password)
    : stored.passwordHash
  if (passwordHash !== stored.passwordHash) {
    throw new Error('Incorrect password.')
  }
  const current = await decryptData(stored.encryptedProfile, stored.passwordHash) as UserProfile
  const updated: UserProfile = { ...current, ...next }
  const encryptedProfile = await encryptData(updated, passwordHash)
  saveStored({ email: stored.email, passwordHash, encryptedProfile })
  localStorage.setItem('auth:current', JSON.stringify({ email: stored.email }))
  return updated
}

export function loadSettings(): AccountSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    if (parsed && parsed.encrypted && parsed.iv && parsed.secretVersion === 1) {
      const secret = getOrCreateSettingsSecret()
      const payload = {
        encrypted: new Uint8Array(parsed.encrypted),
        iv: new Uint8Array(parsed.iv),
      }
      return decryptData(payload, secret) as AccountSettings
    }
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(next: AccountSettings) {
  try {
    const secret = getOrCreateSettingsSecret()
    const payloadPromise = encryptData(next, secret)
    Promise.resolve(payloadPromise).then(payload => {
      const serializable = {
        encrypted: Array.from(payload.encrypted),
        iv: Array.from(payload.iv),
        secretVersion: 1,
      }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(serializable))
    }).catch(() => {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    })
  } catch {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }
}

function getOrCreateSettingsSecret(): string {
  let secret = localStorage.getItem(SETTINGS_SECRET_KEY)
  if (!secret) {
    const bytes = new Uint8Array(32)
    crypto.getRandomValues(bytes)
    secret = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
    localStorage.setItem(SETTINGS_SECRET_KEY, secret)
  }
  return secret
}
