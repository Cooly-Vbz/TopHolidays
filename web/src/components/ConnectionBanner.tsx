import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'

export default function ConnectionBanner() {
  const [online, setOnline] = useState(navigator.onLine)
  const { theme } = useTheme()
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#B45309' : '#F59E0B'

  if (online) return null
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', top: 64, left: 0, right: 0, background: bgColor, color: '#fff', padding: 8, textAlign: 'center', zIndex: 1000 }}>
      You are offline. Some features may be unavailable.
    </div>
  )
}