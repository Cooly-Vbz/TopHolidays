import { Link } from 'react-router-dom'
import { useTheme } from './ThemeProvider'

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, toggleTheme } = useTheme()
  return (
    <>
      <div aria-hidden={!open} onClick={onClose} style={{
        position: 'fixed', inset: 0, background: open ? 'rgba(0,0,0,0.8)' : 'transparent', backdropFilter: open ? 'blur(2px)' : 'none',
        transition: 'background 350ms', zIndex: 999, pointerEvents: open ? 'auto' : 'none'
      }} />
      <aside role="dialog" aria-modal={open} style={{
        position: 'fixed', top: 0, left: 0, height: '100vh', width: '75vw', maxWidth: 320,
        background: theme === 'dark' ? '#020617' : '#fff', boxShadow: '2px 0 12px rgba(0,0,0,0.2)', zIndex: 1000,
        transform: open ? 'translateX(0%)' : 'translateX(-105%)', transition: 'transform 350ms ease-out',
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ padding: 16, flex: 1 }}>
          <div style={{
            border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, marginBottom: 12
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>💰 Your Digital Wallet</div>
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 8, marginTop: 4 }}>
              <div>TopHolidays Coins: <strong>1,250</strong></div>
              <div>Cash Balance: <strong>$15.30</strong></div>
            </div>
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 8, marginTop: 8, fontSize: 12, color: '#718096' }}>
              ℹ️ How Coins Work: Earn 10x coins on ⭐ promoted products. Buy any promoted product 10 times to get one free with coins!
            </div>
          </div>

          <hr style={{ border: 0, height: 1, background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)', margin: '12px 0' }} />

          <nav style={{ display: 'grid', gap: 8 }}>
            <Link to="/products">🛍️ Browse Products</Link>
            <Link to="/cart">🛒 See the Cart</Link>
            <Link to="/favorites">❤️ Your Favorites</Link>
            <Link to="/orders">📦 All Orders</Link>
            <Link to="/customer-care">💬 Customer Care</Link>
            <Link to="/about">ℹ️ About Us</Link>
          </nav>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              marginTop: 16,
              padding: '8px 12px',
              borderRadius: 9999,
              border: '1px solid #CBD5E0',
              background: theme === 'dark' ? '#0F172A' : '#F9FAFB',
              color: theme === 'dark' ? '#E5E7EB' : '#111827',
              fontSize: 13,
            }}
          >
            Switch to {theme === 'light' ? 'dark' : 'light'} theme
          </button>
        </div>
        <footer style={{ padding: 12, fontSize: 12, color: '#718096', display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <Link to="/eula" style={{ color: 'inherit', textDecoration: 'underline' }}>EULA</Link>
          <span>|</span>
          <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'underline' }}>Privacy Policy</Link>
        </footer>
      </aside>
    </>
  )
}