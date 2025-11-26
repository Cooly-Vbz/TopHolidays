import { useEffect, useState } from 'react'

type Product = {
  id: string
  title: string
  price: number
  image: string
  promoted?: boolean
}

interface ProductOverlayProps {
  open: boolean
  onClose: () => void
  product?: Product
  onAddToCart?: (product: Product) => void
  onToggleFavorite?: (id: string) => void
}

export default function ProductOverlay({ open, onClose, product, onAddToCart, onToggleFavorite }: ProductOverlayProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  
  useEffect(() => {
    if (product) {
      try {
        const favsArray = JSON.parse(localStorage.getItem('favorites') || '[]')
        const favs = new Set(Array.isArray(favsArray) ? favsArray : [])
        setIsFavorited(favs.has(product.id))
      } catch {
        setIsFavorited(false)
      }
    }
  }, [product])
  
  useEffect(() => {
    const updateFavorites = () => {
      if (product) {
        try {
          const favsArray = JSON.parse(localStorage.getItem('favorites') || '[]')
          const favs = new Set(Array.isArray(favsArray) ? favsArray : [])
          setIsFavorited(favs.has(product.id))
        } catch {
          setIsFavorited(false)
        }
      }
    }
    updateFavorites()
    window.addEventListener('favorites-updated', updateFavorites)
    return () => window.removeEventListener('favorites-updated', updateFavorites)
  }, [product])
  
  if (!open || !product) return null
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product)
    }
  }
  
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(product.id)
    }
  }
  return (
    <div role="dialog" aria-modal style={{ position: 'fixed', inset: 0, zIndex: 1100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', transition: 'opacity 400ms' }} />
      <div style={{ position: 'absolute', inset: '5% 5% 10% 5%', background: '#fff', borderRadius: 12, overflow: 'hidden', transformOrigin: 'center', animation: 'scaleUp 400ms ease-out', maxHeight: '90vh' }}>
        <style>{`@keyframes scaleUp { from { transform: scale(0.1) } to { transform: scale(1) } }
        @media (max-width: 768px) { .po-grid { grid-template-columns: 1fr } }`}</style>
        <header style={{ padding: 12, borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{product.title}</div>
            <div>★ ★ ★ (23 ratings)</div>
          </div>
          <div style={{ fontSize: 32, fontWeight: 700 }}>${product.price?.toFixed(2)}</div>
        </header>
        <div className="po-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 'calc(100% - 56px)' }}>
          <section style={{ padding: 12, overflow: 'auto' }}>
            <img src={product.image} alt={product.title} style={{ width: '100%', borderRadius: 8 }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
              {[1,2,3,4,5].map(n => <img key={n} src={`https://picsum.photos/120/80?${n}`} alt="thumb" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />)}
            </div>
          </section>
          <section style={{ padding: 12, overflow: 'auto' }}>
            <div style={{ position: 'sticky', top: 0, background: '#fff', paddingBottom: 8 }}>
              <button onClick={handleAddToCart} style={{ width: '100%', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: 12, cursor: 'pointer' }}>Add to Cart</button>
              <button onClick={handleToggleFavorite} style={{ width: '100%', marginTop: 8, border: '1px solid #3B82F6', color: isFavorited ? '#fff' : '#3B82F6', background: isFavorited ? '#EF4444' : '#fff', borderRadius: 8, padding: 12, cursor: 'pointer', transition: 'all 200ms' }}>{isFavorited ? '❤️ Remove from Favorites' : 'Save to Favorites'}</button>
            </div>
            <div style={{ marginTop: 12 }}>
              <div>Description</div>
              <div>Details</div>
              <div>Shipping</div>
              <div>Reviews</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}