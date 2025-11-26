import { useEffect, useState } from 'react'

export default function ConnectionBanner() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  if (online) return null
  return (
    <div role="status" aria-live="polite" style={{ position: 'fixed', top: 64, left: 0, right: 0, background: '#F59E0B', color: '#fff', padding: 8, textAlign: 'center', zIndex: 1000 }}>
      You are offline. Some features may be unavailable.
    </div>
  )
}