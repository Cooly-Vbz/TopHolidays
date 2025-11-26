import type { Product } from '../lib/products'
import { fetchProducts } from '../lib/products'
import { useQuery } from '@tanstack/react-query'

function addToCart(prod: Product) {
  const items = JSON.parse(localStorage.getItem('cart') || '[]')
  const existing = items.find((it: any) => it.id === prod.id)
  if (existing) existing.qty = (existing.qty || 1) + 1
  else items.push({ id: prod.id, title: prod.title, price: prod.price, image: prod.image, qty: 1 })
  localStorage.setItem('cart', JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

function toggleFavorite(id: string) {
  const favsArray = JSON.parse(localStorage.getItem('favorites') || '[]')
  const favs = new Set(Array.isArray(favsArray) ? favsArray : [])
  if (favs.has(id)) favs.delete(id); else favs.add(id)
  localStorage.setItem('favorites', JSON.stringify(Array.from(favs)))
  window.dispatchEvent(new Event('favorites-updated'))
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Products() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const { data, isLoading, isError } = useQuery({ queryKey: ['products'], queryFn: fetchProducts, staleTime: 1000 * 60 * 5 })

  useEffect(() => {
    const updateFavorites = () => {
      try {
        const favsArray = JSON.parse(localStorage.getItem('favorites') || '[]')
        setFavorites(new Set(Array.isArray(favsArray) ? favsArray : []))
      } catch {
        setFavorites(new Set())
      }
    }
    updateFavorites()
    window.addEventListener('favorites-updated', updateFavorites)
    return () => window.removeEventListener('favorites-updated', updateFavorites)
  }, [])
  const products: Product[] = (data && Array.isArray(data)) ? data : []
  return (
    <div style={{ padding: 16 }}>
      {isLoading && <div>Loading products...</div>}
      {isError && <div style={{ color: '#EF4444' }}>Failed to load products.</div>}
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat( auto-fill, minmax(180px, 1fr) )' }}>
        {products.map(p => (
          <div key={p.id} style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }} onClick={() => navigate(`/products/${p.id}`)}>
            <div style={{ position: 'relative' }}>
              <img alt={p.title} src={p.image} loading="lazy" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
              <button aria-label="Toggle Favorite" onClick={(e) => { e.stopPropagation(); toggleFavorite(p.id) }} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: 16, border: 'none', background: favorites.has(p.id) ? '#EF4444' : '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, lineHeight: 1, transition: 'background 200ms' }}>❤️</button>
              {p.promoted && <div style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: 16, background: '#14B8A6', color: '#fff', display: 'grid', placeItems: 'center' }}>⭐</div>}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: 8, backdropFilter: 'blur(2px)' }}>
                <span style={{ fontWeight: 700 }}>${p.price.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ padding: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#2D3748', lineHeight: 1.4 }}>{p.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                <span style={{ color: '#F59E0B' }}>★ ★ ★</span>
                <span style={{ color: '#718096', fontSize: 14 }}>(12 ratings)</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); addToCart(p) }} style={{ marginTop: 8, width: '100%', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: 10 }}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}