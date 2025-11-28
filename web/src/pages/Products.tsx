import type { Product } from '../lib/products'
import { fetchProducts } from '../lib/products'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type HolidayType = 'all' | 'christmas' | 'newyear' | 'valentine' | 'easter' | 'halloween'
type ProductCategory = 'all' | 'promo' | 'ordered' | 'shirts' | 'hoodies' | 'pants' | 'accessories'

const HOLIDAYS: Record<HolidayType, { name: string; emoji: string; fontFamily: string }> = {
  all: { name: 'All Holidays', emoji: '🎉', fontFamily: 'Inter' },
  christmas: { name: 'Christmas', emoji: '🎄', fontFamily: '"Caveat", cursive' },
  newyear: { name: 'New Year', emoji: '🎆', fontFamily: '"Caveat", cursive' },
  valentine: { name: 'Valentine\'s Day', emoji: '❤️', fontFamily: '"Caveat", cursive' },
  easter: { name: 'Easter', emoji: '🐰', fontFamily: '"Caveat", cursive' },
  halloween: { name: 'Halloween', emoji: '🎃', fontFamily: 'Inter' }
}

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

export default function Products() {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayType>('all')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all')
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

  // Auto-select nearest holiday
  useEffect(() => {
    const now = new Date()
    const m = now.getMonth() + 1
    const d = now.getDate()

    if (m === 12 && d <= 26) setSelectedHoliday('christmas')
    else if ((m === 12 && d >= 27) || (m === 1 && d <= 2)) setSelectedHoliday('newyear')
    else if (m === 2 && d <= 15) setSelectedHoliday('valentine')
    else if (m === 10 && d >= 15 && d <= 31) setSelectedHoliday('halloween')
    else if (m === 4 && d >= 1 && d <= 30) setSelectedHoliday('easter') // Approximate Easter
  }, [])

  const products: Product[] = (data && Array.isArray(data)) ? data : []

  // Filter products based on holiday and category
  const filteredProducts = products.filter(product => {
    if (selectedHoliday !== 'all' && product.holiday !== selectedHoliday) return false
    if (selectedCategory === 'promo' && !product.promoted) return false
    if (selectedCategory === 'ordered') {
      // Check if user has ordered this product
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      return orders.some((order: any) => order.items?.some((item: any) => item.id === product.id))
    }
    if (['shirts', 'hoodies', 'pants', 'accessories'].includes(selectedCategory)) {
      return product.category === selectedCategory
    }
    return true
  })
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Main Content */}
      <div style={{ flex: 1, padding: 16 }}>
        {/* Holiday Selector */}
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <select
            value={selectedHoliday}
            onChange={(e) => setSelectedHoliday(e.target.value as HolidayType)}
            style={{
              padding: '12px 16px',
              borderRadius: 12,
              border: '2px solid #E5E7EB',
              background: '#FFFFFF',
              fontSize: 18,
              fontFamily: HOLIDAYS[selectedHoliday].fontFamily,
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: 200
            }}
          >
            {Object.entries(HOLIDAYS).map(([key, holiday]) => (
              <option key={key} value={key} style={{ fontFamily: holiday.fontFamily }}>
                {holiday.emoji} {holiday.name}
              </option>
            ))}
          </select>
        </div>

      {isLoading && <div>Loading products...</div>}
      {isError && <div style={{ color: '#EF4444' }}>Failed to load products.</div>}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat( auto-fill, minmax(180px, 1fr) )' }}>
          {filteredProducts.map(p => (
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

      {/* Category Sidebar */}
      <div style={{
        width: 80,
        background: '#F9FAFB',
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0'
      }}>
        {/* Product Categories */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button
            onClick={() => setSelectedCategory('shirts')}
            style={{
              width: 48, height: 48, borderRadius: 12,
              border: selectedCategory === 'shirts' ? '2px solid #3B82F6' : 'none',
              background: selectedCategory === 'shirts' ? '#EBF4FF' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24
            }}
            title="Shirts"
          >
            👕
          </button>
          <button
            onClick={() => setSelectedCategory('hoodies')}
            style={{
              width: 48, height: 48, borderRadius: 12,
              border: selectedCategory === 'hoodies' ? '2px solid #3B82F6' : 'none',
              background: selectedCategory === 'hoodies' ? '#EBF4FF' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24
            }}
            title="Hoodies"
          >
            🧥
          </button>
          <button
            onClick={() => setSelectedCategory('pants')}
            style={{
              width: 48, height: 48, borderRadius: 12,
              border: selectedCategory === 'pants' ? '2px solid #3B82F6' : 'none',
              background: selectedCategory === 'pants' ? '#EBF4FF' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24
            }}
            title="Pants"
          >
            👖
          </button>
          <button
            onClick={() => setSelectedCategory('accessories')}
            style={{
              width: 48, height: 48, borderRadius: 12,
              border: selectedCategory === 'accessories' ? '2px solid #3B82F6' : 'none',
              background: selectedCategory === 'accessories' ? '#EBF4FF' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24
            }}
            title="Accessories"
          >
            🧢
          </button>
        </div>

        {/* Fixed Bottom Icons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              width: 48, height: 48, borderRadius: 12,
              border: selectedCategory === 'all' ? '2px solid #3B82F6' : 'none',
              background: selectedCategory === 'all' ? '#EBF4FF' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 'bold'
            }}
            title="All"
          >
            ALL
          </button>
          <button
            onClick={() => setSelectedCategory('promo')}
            style={{
              width: 48, height: 48, borderRadius: 12,
              border: selectedCategory === 'promo' ? '2px solid #3B82F6' : 'none',
              background: selectedCategory === 'promo' ? '#EBF4FF' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#F59E0B'
            }}
            title="Promoted"
          >
            ⭐
          </button>
          <button
            onClick={() => setSelectedCategory('ordered')}
            style={{
              width: 48, height: 48, borderRadius: 12,
              border: selectedCategory === 'ordered' ? '2px solid #3B82F6' : 'none',
              background: selectedCategory === 'ordered' ? '#EBF4FF' : 'transparent',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20
            }}
            title="Ordered"
          >
            📦
          </button>
        </div>
      </div>
    </div>
  )
}