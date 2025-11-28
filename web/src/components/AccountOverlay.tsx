import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useTheme } from './ThemeProvider'

const tabLabels = ['Profile', 'Security', 'Payment Methods', 'Addresses', 'Privacy'] as const

export default function AccountOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, settings, signIn, signUp, signOut, updateProfile, updateSettings } = useAuth()
  const { theme } = useTheme()
  const [tab, setTab] = useState<(typeof tabLabels)[number]>('Profile')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [closing, setClosing] = useState(false)

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#1E293B' : '#FFFFFF'
  const textColor = isDark ? '#E5E7EB' : '#111827'
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280'
  const borderColor = isDark ? '#374151' : '#E5E7EB'
  const inputBg = isDark ? '#0F172A' : '#FFFFFF'
  const inputBorder = isDark ? '#374151' : '#D1D5DB'

  // Keep mounted during closing animation
  if (!open && !closing) return null

  const requestClose = () => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 250)
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    try {
      if (mode === 'signin') {
        await signIn(email, password)
        setMessage('Signed in successfully.')
      } else {
        await signUp(email, password, displayName || undefined)
        setMessage('Account created and signed in.')
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed.')
    }
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    try {
      await updateProfile({ displayName: displayName || undefined })
      setMessage('Profile saved (locally encrypted).')
    } catch (err: any) {
      setError(err?.message || 'Could not save profile.')
    }
  }

  const renderProfileTab = () => {
    if (!user) {
      return (
        <div style={{ color: textColor }}>
          <h2 style={{ marginBottom: 8 }}>Sign {mode === 'signin' ? 'in' : 'up'}</h2>
          <p style={{ marginBottom: 12, fontSize: 14, color: mutedColor }}>
            Your display name is stored encrypted on this device. This demo auth flow does not contact a backend.
          </p>
          <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Email</span>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${inputBorder}`, background: inputBg, color: textColor }} />
            </label>
            <label style={{ display: 'grid', gap: 4 }}>
              <span>Password</span>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${inputBorder}`, background: inputBg, color: textColor }} />
            </label>
            {mode === 'signup' && (
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Display name (encrypted)</span>
                <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${inputBorder}`, background: inputBg, color: textColor }} />
              </label>
            )}
            {error && <div style={{ color: '#EF4444', fontSize: 13 }}>{error}</div>}
            {message && <div style={{ color: '#10B981', fontSize: 13 }}>{message}</div>}
            <button type="submit" style={{ marginTop: 4, padding: '8px 12px', borderRadius: 8, border: 'none', background: '#10B981', color: '#fff' }}>
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
            <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} style={{ border: 'none', background: 'transparent', color: '#3B82F6', fontSize: 13, textAlign: 'left', padding: 0 }}>
              {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </form>
        </div>
      )
    }

    if (!displayName && user.displayName) setDisplayName(user.displayName)

    return (
      <form onSubmit={handleProfileSave} style={{ display: 'grid', gap: 8, maxWidth: 420, color: textColor }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: 600 }}>Profile</div>
          <div style={{ fontSize: 13, color: mutedColor }}>Update your display name. It is stored encrypted locally.</div>
        </div>
        <div style={{ fontSize: 14 }}>Signed in as <strong>{user.email}</strong></div>
        <label style={{ display: 'grid', gap: 4 }}>
          <span>Display name (encrypted)</span>
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} style={{ padding: 8, borderRadius: 6, border: `1px solid ${inputBorder}`, background: inputBg, color: textColor }} />
        </label>
        {error && <div style={{ color: '#EF4444', fontSize: 13 }}>{error}</div>}
        {message && <div style={{ color: '#10B981', fontSize: 13 }}>{message}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button type="submit" style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: '#10B981', color: '#fff' }}>Save changes</button>
          <button type="button" onClick={signOut} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #DC2626', background: isDark ? '#450a0a' : '#FFF5F5', color: '#EF4444' }}>Sign out</button>
        </div>
      </form>
    )
  }

  const renderSecurityTab = () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 480, color: textColor }}>
      <div>
        <div style={{ fontWeight: 600 }}>Security</div>
        <div style={{ fontSize: 13, color: mutedColor }}>Toggle basic security preferences for this device.</div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={settings.twoFactorEnabled}
          onChange={e => updateSettings(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
        />
        <span>Require 2-step verification on this device (simulated)</span>
      </label>
      <div style={{ fontSize: 12, color: mutedColor }}>
        This is a local-only demo toggle. In production this would be backed by a server and authenticator app or SMS.
      </div>
    </div>
  )

  const renderPaymentTab = () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520, color: textColor }}>
      <div>
        <div style={{ fontWeight: 600 }}>Payment methods</div>
        <div style={{ fontSize: 13, color: mutedColor }}>Stored locally for demo purposes only.</div>
      </div>
      {settings.paymentMethods.length === 0 ? (
        <div style={{ fontSize: 14, color: mutedColor }}>No payment methods saved.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {settings.paymentMethods.map(pm => (
            <li key={pm.id} style={{ padding: 8, borderRadius: 8, border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between' }}>
              <span>{pm.brand} •••• {pm.last4} (exp {pm.exp})</span>
              <button
                type="button"
                onClick={() => updateSettings(prev => ({
                  ...prev,
                  paymentMethods: prev.paymentMethods.filter(x => x.id !== pm.id),
                }))}
                style={{ border: 'none', background: 'transparent', color: '#EF4444', fontSize: 13 }}
              >Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => updateSettings(prev => ({
          ...prev,
          paymentMethods: prev.paymentMethods.concat({
            id: `${Date.now()}`,
            brand: 'Visa',
            last4: '4242',
            exp: '12/30',
          }),
        }))}
        style={{ alignSelf: 'flex-start', padding: '8px 12px', borderRadius: 8, border: '1px dashed #9CA3AF', background: isDark ? '#1E293B' : '#F9FAFB', color: textColor }}
      >Add sample card</button>
    </div>
  )

  const renderAddressesTab = () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520, color: textColor }}>
      <div>
        <div style={{ fontWeight: 600 }}>Addresses</div>
        <div style={{ fontSize: 13, color: mutedColor }}>Shipping addresses stored only in this browser.</div>
      </div>
      {settings.addresses.length === 0 ? (
        <div style={{ fontSize: 14, color: mutedColor }}>No addresses saved.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {settings.addresses.map(addr => (
            <li key={addr.id} style={{ padding: 8, borderRadius: 8, border: `1px solid ${borderColor}` }}>
              <div style={{ fontWeight: 600 }}>{addr.label}</div>
              <div style={{ fontSize: 14 }}>{addr.line1}</div>
              <div style={{ fontSize: 13, color: mutedColor }}>{addr.city}, {addr.country}</div>
              <button
                type="button"
                onClick={() => updateSettings(prev => ({
                  ...prev,
                  addresses: prev.addresses.filter(x => x.id !== addr.id),
                }))}
                style={{ marginTop: 4, border: 'none', background: 'transparent', color: '#EF4444', fontSize: 13 }}
              >Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        onClick={() => updateSettings(prev => ({
          ...prev,
          addresses: prev.addresses.concat({
            id: `${Date.now()}`,
            label: 'Home',
            line1: '123 Demo Street',
            city: 'Holiday Town',
            country: 'Wonderland',
          }),
        }))}
        style={{ alignSelf: 'flex-start', padding: '8px 12px', borderRadius: 8, border: '1px dashed #9CA3AF', background: isDark ? '#1E293B' : '#F9FAFB', color: textColor }}
      >Add sample address</button>
    </div>
  )

  const renderPrivacyTab = () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520, color: textColor }}>
      <div>
        <div style={{ fontWeight: 600 }}>Privacy</div>
        <div style={{ fontSize: 13, color: mutedColor }}>Control how this app uses your data on this device.</div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={settings.marketingEmails}
          onChange={e => updateSettings(prev => ({ ...prev, marketingEmails: e.target.checked }))}
        />
        <span>Allow marketing emails (simulated)</span>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={settings.personalizedRecommendations}
          onChange={e => updateSettings(prev => ({ ...prev, personalizedRecommendations: e.target.checked }))}
        />
        <span>Enable personalized product recommendations</span>
      </label>
      <button
        type="button"
        onClick={() => {
          if (confirm('This will clear local account settings and auth state for this app in this browser. Continue?')) {
            localStorage.clear()
            window.location.reload()
          }
        }}
        style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, border: '1px solid #DC2626', background: isDark ? '#450a0a' : '#FEF2F2', color: '#EF4444' }}
      >Delete local account & data</button>
    </div>
  )

  let content: React.ReactElement
  if (tab === 'Profile') content = renderProfileTab()
  else if (tab === 'Security') content = renderSecurityTab()
  else if (tab === 'Payment Methods') content = renderPaymentTab()
  else if (tab === 'Addresses') content = renderAddressesTab()
  else content = renderPrivacyTab()

  return (
    <div role="dialog" aria-modal style={{ position: 'fixed', inset: 0, zIndex: 1100 }}>
      <div onClick={requestClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', transition: 'opacity 250ms', opacity: closing ? 0 : 1 }} />
      <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', background: bgColor, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', overflow: 'auto', transition: 'transform 250ms, opacity 250ms', transform: closing ? 'translateY(8px)' : 'translateY(0)', opacity: closing ? 0 : 1, maxHeight: '80vh', color: textColor }}>
        <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @media (max-width: 768px) { .ao-grid { grid-template-columns: 1fr } }`}</style>
        <header style={{ padding: 12, borderBottom: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 700 }}>Account Settings</div>
          <button onClick={requestClose} aria-label="Close" style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer' }}>⬇️</button>
        </header>
        <div className="ao-grid" style={{ display: 'grid', gridTemplateColumns: '200px 1fr', height: 'calc(100% - 48px)' }}>
          <aside style={{ borderRight: `1px solid ${borderColor}`, padding: 12, overflow: 'auto' }}>
            {tabLabels.map(label => (
              <button
                key={label}
                onClick={() => setTab(label)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: 8, borderRadius: 6, border: 'none',
                  marginBottom: 4, cursor: 'pointer',
                  background: tab === label ? (isDark ? '#1E3A8A' : '#EFF6FF') : 'transparent',
                  color: tab === label ? (isDark ? '#93C5FD' : '#1D4ED8') : textColor,
                }}
              >{label}</button>
            ))}
          </aside>
          <section style={{ padding: 16, overflow: 'auto' }}>
            {content}
          </section>
        </div>
      </div>
    </div>
  )
}