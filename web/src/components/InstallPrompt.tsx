import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

type InstallPromptProps = {
  show?: boolean
}

export default function InstallPrompt({ show = true }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      if (show) setIsVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [show])

  const handleInstall = async () => {
    if (!deferredPrompt?.prompt) return
    try {
      await deferredPrompt.prompt()
      setIsVisible(false)
    } catch {
      // ignore
    }
  }

  if (!isVisible) return null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: isDark ? '#E5E7EB' : '#111827', fontWeight: 600 }}>Install Top Holidays</span>
        <button
          onClick={handleInstall}
          style={{
            padding: '8px 16px',
            background: isDark ? '#2563EB' : '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 9999,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >Install</button>
      </div>
    </div>
  )
}