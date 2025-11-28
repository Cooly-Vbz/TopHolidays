import { Link } from 'react-router-dom'
import { useTheme } from './ThemeProvider'

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'
  const bgColor = isDark ? '#020617' : '#FFFFFF'
  const textColor = isDark ? '#E5E7EB' : '#111827'
  const borderColor = isDark ? '#1E293B' : '#E5E7EB'
  const mutedColor = isDark ? '#9CA3AF' : '#718096'

  return (
    <>
      <div aria-hidden={!open} onClick={onClose} style={{
        position: 'fixed', inset: 0, background: open ? 'rgba(0,0,0,0.8)' : 'transparent',
        backdropFilter: open ? 'blur(2px)' : 'none',
        transition: 'background 350ms', zIndex: 999, pointerEvents: open ? 'auto' : 'none'
      }} />

      <aside role="dialog" aria-modal={open} style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: '75vw', maxWidth: 320,
        background: bgColor,
        boxShadow: '2px 0 12px rgba(0,0,0,0.2)',
        zIndex: 1000,
        transform: open ? 'translateX(0%)' : 'translateX(-105%)',
        transition: 'transform 350ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Title Header - Fixed height to match navbar */}
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${borderColor}`,
          flexShrink: 0
        }}>
          <h1 style={{
            fontFamily: '"Orbitron", "Rajdhani", "Arial Black", sans-serif',
            fontSize: 'clamp(18px, 5vw, 24px)',
            fontWeight: 700,
            margin: 0,
            color: isDark ? '#60A5FA' : '#3B82F6',
            letterSpacing: '1.5px',
            textShadow: isDark ? '0 0 10px rgba(96, 165, 250, 0.5)' : '0 0 6px rgba(59, 130, 246, 0.3)',
            lineHeight: 1,
            whiteSpace: 'nowrap',
            textTransform: 'uppercase'
          }}>
            TOP HOLIDAYS
          </h1>
        </div>

        {/* Scrollable Content Area */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '16px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {/* Digital Coins Explanation - Compact & Visual */}
          <div style={{
            background: isDark ? 'linear-gradient(135deg, #1E3A8A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: `1px solid ${isDark ? '#3B82F6' : '#93C5FD'}`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            boxShadow: isDark ? '0 2px 8px rgba(59, 130, 246, 0.2)' : '0 2px 8px rgba(147, 197, 253, 0.3)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
              color: textColor,
              fontWeight: 600
            }}>
              <span style={{ fontSize: 20 }}>💰</span>
              <span>Digital Wallet</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginBottom: 8
            }}>
              <div style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                padding: 8,
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 11, color: mutedColor, marginBottom: 2 }}>Coins</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B' }}>1,250</div>
              </div>
              <div style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                padding: 8,
                borderRadius: 8,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 11, color: mutedColor, marginBottom: 2 }}>Cash</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>$15.30</div>
              </div>
            </div>

            <div style={{
              fontSize: 11,
              color: mutedColor,
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'start',
              gap: 6
            }}>
              <span style={{ flexShrink: 0 }}>⭐</span>
              <span>Earn 10x coins on promoted items. Get 1 free after 10 purchases!</span>
            </div>
          </div>

          <hr style={{
            border: 0,
            height: 1,
            background: `linear-gradient(to right, transparent, ${borderColor}, transparent)`,
            margin: '16px 0'
          }} />

          {/* Navigation Links */}
          <nav style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
            <Link
              to="/products"
              onClick={onClose}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: textColor,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span>🛍️</span>
              <span>Browse Products</span>
            </Link>
            <Link
              to="/cart"
              onClick={onClose}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: textColor,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span>🛒</span>
              <span>See the Cart</span>
            </Link>
            <Link
              to="/favorites"
              onClick={onClose}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: textColor,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span>❤️</span>
              <span>Your Favorites</span>
            </Link>
            <Link
              to="/orders"
              onClick={onClose}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: textColor,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span>📦</span>
              <span>All Orders</span>
            </Link>
            <Link
              to="/customer-care"
              onClick={onClose}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: textColor,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span>💬</span>
              <span>Customer Care</span>
            </Link>
            <Link
              to="/about"
              onClick={onClose}
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                color: textColor,
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 10
              }}
            >
              <span>ℹ️</span>
              <span>About Us</span>
            </Link>
          </nav>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 8,
              border: `1px solid ${borderColor}`,
              background: isDark ? '#1E293B' : '#F7FAFC',
              color: textColor,
              fontSize: 13,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
          >
            <span>{isDark ? '☀️' : '🌙'}</span>
            <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>

        {/* Footer - Always Visible */}
        <footer style={{
          padding: 12,
          fontSize: 12,
          color: mutedColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
          borderTop: `1px solid ${borderColor}`,
          flexShrink: 0,
          background: bgColor
        }}>
          <Link
            to="/eula"
            onClick={onClose}
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            EULA
          </Link>
          <span>|</span>
          <Link
            to="/privacy"
            onClick={onClose}
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Privacy Policy
          </Link>
        </footer>
      </aside>
    </>
  )
}