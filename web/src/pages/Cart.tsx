import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../components/ThemeProvider'
import { getThemeColors } from '../lib/theme-colors'

type Item = { id: string; title: string; price: number; qty: number; image?: string }

export default function Cart() {
  const navigate = useNavigate()
  const [items, setItems] = useState<Item[]>([])
  const { theme } = useTheme()
  const colors = getThemeColors(theme)
  const isDark = theme === 'dark'

  useEffect(() => {
    const update = () => {
      try {
        const raw = JSON.parse(localStorage.getItem('cart') || '[]')
        setItems(raw)
      } catch { setItems([]) }
    }
    update()
    window.addEventListener('cart-updated', update)
    return () => window.removeEventListener('cart-updated', update)
  }, [])

  const update = (next: Item[]) => {
    setItems(next)
    localStorage.setItem('cart', JSON.stringify(next))
    window.dispatchEvent(new Event('cart-updated'))
  }

  const inc = (id: string) => update(items.map(i => i.id===id ? { ...i, qty: i.qty+1 } : i))
  const dec = (id: string) => update(items.map(i => i.id===id ? { ...i, qty: Math.max(1, i.qty-1) } : i))
  const remove = (id: string) => update(items.filter(i => i.id!==id))
  const clear = () => { if (confirm('Clear cart?')) update([]) }

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0)
  const shipping = subtotal > 0 ? 5 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  return (
    <div style={{ padding: 16, color: colors.text.primary }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ margin: 0 }}>Your Cart ({items.length})</h2>
        <button onClick={clear} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${colors.border.default}`, background: 'transparent', color: colors.text.secondary, cursor: 'pointer' }}>Clear Cart</button>
      </header>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 24, color: colors.text.secondary }}>Your cart is empty.</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {items.map(i => (
            <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 8, boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.06)', background: isDark ? 'rgba(2,6,23,0.7)' : '#FFFFFF', border: `1px solid ${colors.border.default}` }}>
              {i.image ? (
                <img src={i.image} alt={i.title} style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: 8, background: colors.bg.secondary }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{i.title}</div>
                <div style={{ color: colors.text.secondary }}>${i.price.toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => dec(i.id)} style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${colors.border.default}`, background: 'transparent', color: colors.text.primary, cursor: 'pointer' }}>-</button>
                <input value={i.qty} readOnly style={{ width: 40, textAlign: 'center', background: isDark ? '#0F172A' : '#FFFFFF', border: `1px solid ${colors.border.default}`, color: colors.text.primary, borderRadius: 6, padding: '4px 0' }} />
                <button onClick={() => inc(i.id)} style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${colors.border.default}`, background: 'transparent', color: colors.text.primary, cursor: 'pointer' }}>+</button>
              </div>
              <div style={{ width: 100, textAlign: 'right', color: colors.text.secondary }}>${(i.qty * i.price).toFixed(2)}</div>
              <button onClick={() => remove(i.id)} aria-label="Remove" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: isDark ? '#F87171' : '#EF4444' }}>🗑️</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ position: 'sticky', bottom: 0, background: isDark ? 'rgba(2,6,23,0.8)' : '#FFFFFF', padding: 12, boxShadow: isDark ? '0 -2px 8px rgba(0,0,0,0.35)' : '0 -2px 8px rgba(0,0,0,0.06)', marginTop: 16, borderTop: `1px solid ${colors.border.default}` }}>
        <div style={{ color: colors.text.secondary }}>Subtotal: ${subtotal.toFixed(2)}</div>
        <div style={{ color: colors.text.secondary }}>Estimated shipping: ${shipping.toFixed(2)}</div>
        <div style={{ color: colors.text.secondary }}>Tax: ${tax.toFixed(2)}</div>
        <div style={{ fontWeight: 700 }}>Total: ${total.toFixed(2)}</div>
        <button
          onClick={() => items.length && navigate('/checkout')}
          disabled={items.length === 0}
          style={{
            width: '100%',
            marginTop: 8,
            background: items.length === 0 ? (isDark ? '#334155' : '#A0AEC0') : '#10B981',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: 12,
            cursor: items.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
