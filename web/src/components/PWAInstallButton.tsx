import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

export default function PWAInstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault()
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e)
            setIsVisible(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null)
        setIsVisible(false)

        console.log(`User response to the install prompt: ${outcome}`)
    }

    if (!isVisible) return null

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '16px 0',
            width: '100%'
        }}>
            <button
                onClick={handleInstallClick}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: isDark ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' : 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: isDark ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 4px 12px rgba(59, 130, 246, 0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    outline: 'none'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = isDark ? '0 6px 16px rgba(37, 99, 235, 0.4)' : '0 6px 16px rgba(59, 130, 246, 0.4)'
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                aria-label="Install Top Holidays App"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Install App
            </button>
        </div>
    )
}
