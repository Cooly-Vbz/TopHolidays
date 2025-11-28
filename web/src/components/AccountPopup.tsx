import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from './ThemeProvider'
import { useAuth, type OAuthProvider } from './AuthProvider'
import { getThemeColors } from '../lib/theme-colors'
import { LocaleSelector } from './LocaleSelector'
import type { LocaleOption } from './LocaleSelector'
import { listAccounts, switchAccount } from '../lib/auth'
import { useNotifications } from '../contexts/NotificationsContext'

interface AccountPopupProps {
    isOpen: boolean
    onClose: () => void
    anchorRef: React.RefObject<HTMLElement>
    onOpenSettings: () => void
    currentLocale: string
    onLocaleChange: (locale: LocaleOption) => void
}

export default function AccountPopup({
    isOpen,
    onClose,
    anchorRef,
    onOpenSettings,
    currentLocale,
    onLocaleChange
}: AccountPopupProps) {
    const { theme } = useTheme()
    const { user, signOut, signInWithOAuth, signUpWithOAuth, switchToAccount } = useAuth()
    const navigate = useNavigate()
    const colors = getThemeColors(theme)
    const popupRef = useRef<HTMLDivElement>(null)
    const { notifications } = useNotifications()
    const notificationCount = notifications.filter(n => !n.read).length
    const [showSignUp, setShowSignUp] = useState(false)
    const [showLocaleSelector, setShowLocaleSelector] = useState(false)
    const [accounts, setAccounts] = useState<Array<{ email: string; displayName?: string }>>([])

    // Calculate position relative to anchor
    const [position, setPosition] = useState({ top: 0, right: 0 })

    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect()
            setPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            })
        }
    }, [isOpen, anchorRef])

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
                anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose, anchorRef])

    // Close on escape key
    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            return () => document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const handleOAuthSignIn = async (provider: OAuthProvider) => {
    try {
      await signInWithOAuth(provider)
      onClose()
    } catch (error) {
      console.error(`Failed to sign in with ${provider}:`, error)
      alert('Sign-in failed. Please try again.')
    }
  }

  const handleOAuthSignUp = async (provider: OAuthProvider) => {
    try {
      await signUpWithOAuth(provider)
      onClose()
    } catch (error) {
      console.error(`Failed to sign up with ${provider}:`, error)
      alert('Sign-up failed. Please try again.')
    }
  }

  const handleLocaleChange = (locale: LocaleOption) => {
    onLocaleChange(locale)
    setShowLocaleSelector(false)
  }

  const handleLocaleClick = () => {
    setShowLocaleSelector(!showLocaleSelector)
  }

  useEffect(() => {
    if (isOpen) {
      listAccounts().then(setAccounts).catch(() => setAccounts([]))
    }
  }, [isOpen])

    const handleNotificationsClick = () => {
        navigate('/notifications')
        onClose()
    }

    const handleSignOut = () => {
        signOut()
        onClose()
    }

    return (
        <div
            ref={popupRef}
            role="dialog"
            aria-label="Account menu"
            style={{
                position: 'fixed',
                top: position.top,
                right: position.right,
                zIndex: 1001,
                background: colors.bg.primary,
                border: `1px solid ${colors.border.default}`,
                borderRadius: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                minWidth: 280,
                maxWidth: 320,
                padding: 0,
                animation: 'accountPopupFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {/* Arrow pointing to account button */}
            <div style={{
                position: 'absolute',
                top: -8,
                right: 16,
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: `8px solid ${colors.border.default}`,
            }} />
            <div style={{
                position: 'absolute',
                top: -7,
                right: 16,
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: `8px solid ${colors.bg.primary}`,
            }} />

            <div style={{ padding: 12 }}>
                {/* Locale & Currency Button */}
                <button
                    onClick={handleLocaleClick}
                    style={{
                        width: '100%',
                        padding: 12,
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 8,
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: colors.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = colors.bg.tertiary}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <span style={{ fontSize: 20 }}>🌍</span>
                  {showLocaleSelector && (
                    <LocaleSelector
                      isOpen={showLocaleSelector}
                      onClose={() => setShowLocaleSelector(false)}
                      currentLocale={currentLocale}
                      onLocaleChange={handleLocaleChange}
                    />
                  )}
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>Locale & Currency</div>
                        <div style={{ fontSize: 12, color: colors.text.tertiary }}>
                            English (US) • USD $
                        </div>
                    </div>
                </button>

                <hr style={{ border: 0, height: 1, background: colors.border.light, margin: '8px 0' }} />

                {/* Current Login */}
                <div style={{
                    padding: 12,
                    background: colors.bg.secondary,
                    borderRadius: 8,
                    marginBottom: 8,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            background: colors.brand.primary,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 20,
                        }}>
                            {user?.displayName?.[0] || '👤'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: colors.text.primary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {user?.displayName || 'Guest User'}
                            </div>
                            <div style={{
                                fontSize: 12,
                                color: colors.text.tertiary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {user?.email || 'Not signed in'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Switcher */}
                {accounts.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    {accounts.map(acc => (
                      <button key={acc.email}
                        onClick={() => { try { switchToAccount(acc.email); onClose(); } catch (e) { alert((e as Error).message) } }}
                        style={{ width: '100%', padding: 10, background: 'transparent', border: `1px solid ${colors.border.default}`, borderRadius: 8, color: colors.text.primary, textAlign: 'left', cursor: 'pointer', marginBottom: 6 }}
                      >
                        <span style={{ fontWeight: 600 }}>{acc.displayName || acc.email}</span>
                        {acc.displayName && (
                          <span style={{ marginLeft: 6, color: colors.text.tertiary }}>({acc.email})</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {user ? (
                    <>
                        <button
                            onClick={() => { onOpenSettings(); onClose(); }}
                            style={{
                                width: '100%',
                                padding: 12,
                                background: colors.brand.primary,
                                border: 'none',
                                borderRadius: 8,
                                color: '#FFFFFF',
                                cursor: 'pointer',
                                fontWeight: 600,
                                marginBottom: 8,
                            }}
                        >
                            Account Settings
                        </button>
                        <button
                            onClick={() => { navigate('/auth'); onClose(); }}
                            style={{
                                width: '100%',
                                padding: 12,
                                background: 'transparent',
                                border: `1px dashed ${colors.border.default}`,
                                borderRadius: 8,
                                color: colors.text.secondary,
                                cursor: 'pointer',
                                marginTop: 8,
                            }}
                        >
                            Add another login
                        </button>
                        <button
                            onClick={handleSignOut}
                            style={{
                                width: '100%',
                                padding: 12,
                                background: 'transparent',
                                border: `1px solid ${colors.border.default}`,
                                borderRadius: 8,
                                color: colors.text.secondary,
                                cursor: 'pointer',
                            }}
                        >
                            Sign Out
                        </button>
                    </>
                ) : (
                    <div>
                        <button
                            onClick={() => { setShowSignUp(true); navigate('/auth'); }}
                            style={{
                                width: '100%',
                                padding: 12,
                                background: colors.brand.primary,
                                border: 'none',
                                borderRadius: 8,
                                color: '#FFFFFF',
                                cursor: 'pointer',
                                fontWeight: 600,
                                marginBottom: 8,
                            }}
                        >
                            Sign In / Sign Up
                        </button>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                          {(['google','facebook','apple','github'] as OAuthProvider[]).map(p => (
                            <button key={p}
                              onClick={() => handleOAuthSignIn(p)}
                              title={`Sign in with ${p}`}
                              style={{ padding: 10, borderRadius: 8, border: `1px solid ${colors.border.light}`, background: 'transparent', cursor: 'pointer' }}
                            >{p === 'google' ? 'G' : p === 'facebook' ? 'f' : p === 'apple' ? '' : 'GH'}</button>
                          ))}
                        </div>
                    </div>
                )}

                <hr style={{ border: 0, height: 1, background: colors.border.light, margin: '8px 0' }} />

                {/* Notifications */}
                <button
                    onClick={handleNotificationsClick}
                    style={{
                        width: '100%',
                        padding: 12,
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 8,
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: colors.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = colors.bg.secondary}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <span>🔔 Notifications</span>
                    {notificationCount > 0 && (
                        <span style={{
                            background: colors.status.error.border,
                            color: '#FFFFFF',
                            borderRadius: 9999,
                            padding: '2px 8px',
                            fontSize: 12,
                            fontWeight: 600,
                            minWidth: 20,
                            textAlign: 'center',
                        }}>
                            {notificationCount}
                        </span>
                    )}
                </button>
            </div>

            <style>{`
        @keyframes accountPopupFadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
        </div>
    )
}
