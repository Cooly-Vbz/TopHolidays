import { useEffect, useState } from 'react'

type Product = {
  id: string
  title: string
  price: number
  image: string
  promoted?: boolean
}

const sample: Product[] = [
  { id: 'p1', title: 'Festive Christmas Sweater', price: 39.99, image: 'https://picsum.photos/300/400?1', promoted: true },
  { id: 'p2', title: 'Halloween Bat Tee', price: 24.99, image: 'https://picsum.photos/300/400?2' },
  { id: 'p3', title: 'Valentine Heart Hoodie', price: 49.00, image: 'https://picsum.photos/300/400?3', promoted: true },
  { id: 'p4', title: 'New Year Fireworks Shirt', price: 29.00, image: 'https://picsum.photos/300/400?4' },
  { id: 'p5', title: 'Easter Bunny Tee', price: 22.00, image: 'https://picsum.photos/300/400?5' },
]

export default function Favorites() {
  const [favs, setFavs] = useState<string[]>([])
  useEffect(() => {
    const update = () => {
      try { setFavs(JSON.parse(localStorage.getItem('favorites') || '[]')) } catch { setFavs([]) }
    }
    update()
    window.addEventListener('favorites-updated', update)
    return () => window.removeEventListener('favorites-updated', update)
  }, [])

  const remove = (id: string) => {
    const next = favs.filter(f => f!==id)
    setFavs(next)
    localStorage.setItem('favorites', JSON.stringify(next))
    window.dispatchEvent(new Event('favorites-updated'))
  }

  const moveToCart = (id: string) => {
    const product = sample.find(p => p.id === id)
    if (!product) return
    const items = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = items.find((it: any) => it.id === product.id)
    if (existing) existing.qty = (existing.qty || 1) + 1
    else items.push({ id: product.id, title: product.title, price: product.price, image: product.image, qty: 1 })
    localStorage.setItem('cart', JSON.stringify(items))
    window.dispatchEvent(new Event('cart-updated'))
    remove(id)
  }
  
  const favoriteProducts = sample.filter(p => favs.includes(p.id))

  return (
    <div style={{ padding: 16 }}>
      <div style={{ textAlign: 'center', margin: '12px 0', color: '#718096' }}>━━━ Your Favorites ━━━</div>
      {favoriteProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 48 }}>❤️</div>
          No favorites yet. Browse products and save your favorites.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat( auto-fill, minmax(180px, 1fr) )' }}>
          {favoriteProducts.map(product => (
            <div key={product.id} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img alt={product.title} src={product.image} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
                {product.promoted && <div style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 16, background: '#14B8A6', color: '#fff', display: 'grid', placeItems: 'center' }}>⭐</div>}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 8, backdropFilter: 'blur(2px)' }}>
                  <span style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ padding: 8 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#2D3748', lineHeight: 1.4, marginBottom: 8 }}>{product.title}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => moveToCart(product.id)} style={{ flex: 1, background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer' }}>Move to Cart</button>
                  <button onClick={() => remove(product.id)} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer' }} aria-label="Remove">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}