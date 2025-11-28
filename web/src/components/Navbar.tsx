import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'
import { useAuth } from './AuthProvider'

function useCartCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const update = () => {
      try {
        const items = JSON.parse(localStorage.getItem('cart') || '[]')
        setCount(Array.isArray(items) ? items.reduce((n: number, it: any) => n + (it.qty || 1), 0) : 0)
      } catch {
        setCount(0)
      }
    }
    update()
    const onStorage = () => update()
    const onCartUpdate = () => update()
    window.addEventListener('storage', onStorage)
    window.addEventListener('cart-updated', onCartUpdate)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('cart-updated', onCartUpdate)
    }
  }, [])
  return count
}

function currentTheme() {
  const now = new Date();
  const m = now.getMonth() + 1; const d = now.getDate();
  if (m === 12 && d <= 26) return 'christmas';
  if ((m === 12 && d >= 27) || (m === 1 && d <= 2)) return 'newyear';
  if (m === 2 && d <= 15) return 'valentine';
  if (m === 10 && d >= 15 && d <= 31) return 'halloween';
  return 'default';
}

export default function Navbar({ onMenu, onAccount }: { onMenu: () => void, onAccount: () => void }) {
  const cartCount = useCartCount()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { theme: appTheme } = useTheme()
  const onCart = () => navigate('/cart')

  const onHome = () => navigate('/')
  const isCartRoute = location.pathname.startsWith('/cart')
  const seasonalTheme = currentTheme()

  const isDark = appTheme === 'dark'
  const bgColor = isDark ? '#020617' : '#FFFFFF'
  const textColor = isDark ? '#E5E7EB' : '#2D3748'
  const buttonBg = isDark ? '#1E293B' : '#F7FAFC'
  const buttonColor = isDark ? '#E5E7EB' : '#2D3748'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 64,
      background: bgColor, boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.06)', zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px',
      transition: 'background-color 0.3s, color 0.3s'
    }}>
      <button aria-label="Menu" onClick={onMenu} style={{
        width: 40, height: 40, borderRadius: 8, border: 'none', background: buttonBg, color: buttonColor, cursor: 'pointer'
      }}>☰</button>

      <button onClick={onHome} style={{
        background: 'none', border: 'none', cursor: 'pointer'
      }} aria-label="Go Home">
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ fontFamily: '"Caveat", cursive', fontSize: 28, fontWeight: 700, color: textColor, letterSpacing: '0.5px' }}>Top Holidays</span>
          {/* Decorations */}
          {seasonalTheme === 'christmas' && (
            <span aria-hidden style={{ position: 'absolute', left: -24, top: -12, color: '#14B8A6' }}>❄️</span>
          )}
          {seasonalTheme === 'christmas' && (
            <span aria-hidden style={{ position: 'absolute', right: -24, top: -10, color: '#10B981' }}>🎄</span>
          )}
          {seasonalTheme === 'halloween' && (
            <span aria-hidden style={{ position: 'absolute', left: -24, top: -12 }}>🦇</span>
          )}
          {seasonalTheme === 'valentine' && (
            <span aria-hidden style={{ position: 'absolute', left: -24, top: -12, color: '#EF4444' }}>❤️</span>
          )}
          {seasonalTheme === 'newyear' && (
            <span aria-hidden style={{ position: 'absolute', left: -24, top: -12 }}>🎆</span>
          )}
        </span>
      </button>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={onCart} aria-label="Cart" style={{ position: 'relative', width: 40, height: 40, borderRadius: 20, border: 'none', cursor: 'pointer', background: isCartRoute ? '#F59E0B' : buttonBg, color: isCartRoute ? '#fff' : buttonColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, lineHeight: 1 }}>
          🛒
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, background: '#EF4444', color: '#fff', borderRadius: 9999, padding: '2px 6px', fontSize: 12 }}>
              {cartCount}
            </span>
          )}
        </button>
        <button onClick={onAccount} aria-label="Account" style={{ position: 'relative', minWidth: 40, height: 40, borderRadius: 20, border: 'none', background: buttonBg, color: buttonColor, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, lineHeight: 1, padding: '0 10px', gap: 8 }}>
          <span>👤</span>
          {user && (
            <span style={{ fontSize: 13, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isDark ? '#9CA3AF' : '#4B5563' }}>
              {user.displayName || user.email}
            </span>
          )}
          {seasonalTheme === 'christmas' && (
            <span aria-hidden style={{ position: 'absolute', top: -8, right: -8 }}>❄️</span>
          )}
        </button>
      </div>
    </nav>
  )
}