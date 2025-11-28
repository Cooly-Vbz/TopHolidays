import { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'
import { getThemeColors } from '../lib/theme-colors'
import { useNotifications } from '../contexts/NotificationsContext'
import { LocaleSelector } from './LocaleSelector'
import { LocaleContext } from '../contexts/LocaleContext'
import { LOCALES } from '../lib/locales'
import { listAccounts } from '../lib/auth'
import OAuthButtons from './OAuthButtons'

interface AccountPopupProps {
    isOpen: boolean
    onClose: () => void
    anchorRef: React.RefObject<HTMLElement | null>
    onOpenSettings?: () => void
}

export default function AccountPopup({
    isOpen,
    onClose,
    anchorRef,
    onOpenSettings
}: AccountPopupProps) {
    const { theme } = useTheme()
    const { user, signOut, switchToAccount } = useAuth()
    const { locale } = useContext(LocaleContext)
    const navigate = useNavigate()
    const colors = getThemeColors(theme)
    const popupRef = useRef<HTMLDivElement>(null)
    const { notifications } = useNotifications()
    const notificationCount = notifications.filter(n => !n.read).length
    const [showLocaleSelector, setShowLocaleSelector] = useState(false)
    const [showLogin, setShowLogin] = useState(false)
    const [showSwitcher, setShowSwitcher] = useState(false)
    const [isAddingAccount, setIsAddingAccount] = useState(false)
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

    useEffect(() => {
        if (isOpen) {
            listAccounts().then(setAccounts).catch(() => setAccounts([]))
        }
    }, [isOpen])

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
    }, [isOpen, onClose])

    if (!isOpen) return null

    const showLoginView = showLogin || isAddingAccount

    return (
        <>
            <div
                ref={popupRef}
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
                    padding: 12,
                    animation: 'fadeIn 0.5s ease-out',
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
                    borderBottom: `8px solid ${colors.bg.primary}`,
                }} />

                {/* Locale & Currency */}
                <button
                    onClick={() => setShowLocaleSelector(true)}
                    style={{
                        width: '100%',
                        padding: 12,
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 8,
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: colors.text.primary,
                    }}
                >
                    🌍 Locale & Currency
                    <span style={{ fontSize: 12, color: colors.text.tertiary }}>
                        {LOCALES[locale].name} • {LOCALES[locale].currency}
                    </span>
                </button>

                <hr style={{ border: 0, height: 1, background: colors.border.light, margin: '8px 0' }} />

                {/* Current Login Info (only if not adding account) */}
                {!isAddingAccount && (
                    <div style={{ padding: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: colors.text.primary }}>
                            {user?.displayName || 'Guest User'}
                        </div>
                        <div style={{ fontSize: 12, color: colors.text.tertiary }}>
                            {user?.email || 'Not signed in'}
                        </div>
                    </div>
                )}

                {user && !showLoginView ? (
                    <>
                        <button
                            onClick={() => { onClose(); onOpenSettings?.(); }}
                            style={{
                                width: '100%',
                                padding: 12,
                                marginBottom: 8,
                                background: colors.brand.primary,
                                border: 'none',
                                borderRadius: 8,
                                color: '#FFFFFF',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            Account Settings
                        </button>
                        <button
                            onClick={() => { signOut(); onClose(); }}
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

                        {/* Account Switcher Section */}
                        <div style={{ marginTop: 12, borderTop: `1px solid ${colors.border.light}`, paddingTop: 12 }}>
                            {showSwitcher ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: colors.text.secondary }}>Switch Account</span>
                                        <button
                                            onClick={() => setShowSwitcher(false)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: colors.brand.primary }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    {accounts.map(acc => (
                                        <button
                                            key={acc.email}
                                            onClick={() => {
                                                if (acc.email !== user.email) {
                                                    switchToAccount(acc.email)
                                                    onClose()
                                                }
                                            }}
                                            disabled={acc.email === user.email}
                                            style={{
                                                width: '100%',
                                                padding: 8,
                                                background: acc.email === user.email ? colors.bg.secondary : 'transparent',
                                                border: `1px solid ${colors.border.default}`,
                                                borderRadius: 8,
                                                color: colors.text.primary,
                                                cursor: acc.email === user.email ? 'default' : 'pointer',
                                                textAlign: 'left',
                                                opacity: acc.email === user.email ? 0.7 : 1
                                            }}
                                        >
                                            <div style={{ fontWeight: 500 }}>{acc.displayName || 'User'}</div>
                                            <div style={{ fontSize: 11, color: colors.text.tertiary }}>{acc.email}</div>
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setIsAddingAccount(true)}
                                        style={{
                                            width: '100%',
                                            padding: 8,
                                            background: 'transparent',
                                            border: '1px dashed ' + colors.border.default,
                                            borderRadius: 8,
                                            color: colors.brand.primary,
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            marginTop: 4
                                        }}
                                    >
                                        + Add another account
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {accounts.length > 1 && (
                                        <button
                                            onClick={() => setShowSwitcher(true)}
                                            style={{
                                                width: '100%',
                                                padding: 12,
                                                background: 'transparent',
                                                border: `1px solid ${colors.border.default}`,
                                                borderRadius: 8,
                                                color: colors.text.primary,
                                                cursor: 'pointer',
                                                textAlign: 'left'
                                            }}
                                        >
                                            🔄 Switch Account ({accounts.length})
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsAddingAccount(true)}
                                        style={{
                                            width: '100%',
                                            padding: 12,
                                            background: 'transparent',
                                            border: 'none',
                                            borderRadius: 8,
                                            color: colors.text.primary,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            fontSize: 13
                                        }}
                                    >
                                        ➕ Add another account
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : showLoginView ? (
                    <div>
                        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button
                                onClick={() => {
                                    setShowLogin(false)
                                    setIsAddingAccount(false)
                                }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, padding: 4, color: colors.text.primary }}
                            >
                                ←
                            </button>
                            <span style={{ fontWeight: 600, color: colors.text.primary }}>
                                {isAddingAccount ? 'Add Account' : 'Sign In'}
                            </span>
                        </div>
                        <OAuthButtons
                            onSuccess={() => { onClose(); setShowLogin(false); setIsAddingAccount(false); }}
                            onError={(err) => console.error(err)}
                        />
                    </div>
                ) : (
                    <button
                        onClick={() => setShowLogin(true)}
                        style={{
                            width: '100%',
                            padding: 12,
                            background: colors.brand.primary,
                            border: 'none',
                            borderRadius: 8,
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Sign In / Sign Up
                    </button>
                )}

                <hr style={{ border: 0, height: 1, background: colors.border.light, margin: '8px 0' }} />

                {/* Notifications */}
                <button
                    onClick={() => { navigate('/notifications'); onClose(); }}
                    style={{
                        width: '100%',
                        padding: 12,
                        background: 'transparent',
                        border: 'none',
                        borderRadius: 8,
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: colors.text.primary,
                    }}
                >
                    🔔 Notifications
                    {notificationCount > 0 && (
                        <span style={{
                            float: 'right',
                            background: colors.status.error.border,
                            color: '#FFFFFF',
                            borderRadius: 9999,
                            padding: '2px 8px',
                            fontSize: 12,
                            fontWeight: 600,
                        }}>
                            {notificationCount}
                        </span>
                    )}
                </button>

                <style>{`
                    @keyframes fadeIn {
                      from { opacity: 0; transform: translateY(-10px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>

            <LocaleSelector
                isOpen={showLocaleSelector}
                onClose={() => setShowLocaleSelector(false)}
                anchorRef={anchorRef}
            />
        </>
    )
}
