import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, type Product } from '../lib/products'

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

export default function ProductDetails() {
  const { id } = useParams()
  const { data } = useQuery({ queryKey: ['products'], queryFn: fetchProducts, staleTime: 1000 * 60 * 5 })
  const list = (data && Array.isArray(data)) ? data : []
  const product = list.find(p => p.id === id)
  if (!product) return <div style={{ padding: 16 }}>Product not found.</div>

  return (
    <div style={{ padding: 16 }}>
      <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <img src={product.image} alt={product.title} loading="lazy" style={{ width: '100%', borderRadius: 12 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto' }}>
            {[1,2,3,4,5].map(n => <img key={n} src={`https://picsum.photos/seed/${product.id}-${n}/120/80`} alt="thumb" loading="lazy" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }} />)}
          </div>
        </div>
        <div>
          <h2 style={{ margin: 0 }}>{product.title}</h2>
          <div style={{ fontSize: 24, fontWeight: 700 }}>${product.price.toFixed(2)}</div>
          <div style={{ marginTop: 8 }}>★ ★ ★ ★ ☆ (23 ratings)</div>
          <button onClick={() => addToCart(product)} style={{ width: '100%', marginTop: 12, background: '#3B82F6', color: '#fff', border: 'none', borderRadius: 8, padding: 12 }}>Add to Cart</button>
          <button onClick={() => toggleFavorite(product.id)} style={{ width: '100%', marginTop: 8, border: '1px solid #3B82F6', color: '#3B82F6', background: '#fff', borderRadius: 8, padding: 12 }}>Save to Favorites</button>
          <div style={{ marginTop: 16 }}>
            <div><strong>Description</strong></div>
            <p>Soft cotton blend with festive patterns. Machine washable.</p>
            <div><strong>Details</strong></div>
            <p>Unisex fit, available in multiple sizes.</p>
            <div><strong>Shipping</strong></div>
            <p>Ships within 2 business days. Free returns within 30 days.</p>
          </div>
          <hr style={{ border: 0, height: 1, background: '#E5E7EB', margin: '16px 0' }} />
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Reviews</strong>
              <button style={{ border: '1px solid #D1D5DB', borderRadius: 8, padding: '6px 10px', background: '#fff' }}>Write a review</button>
            </div>
            <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
              {[
                { user: 'Alex M.', rating: 5, comment: 'Super comfy and perfect for the holidays!' },
                { user: 'Jordan K.', rating: 4, comment: 'Nice quality, sizing runs a bit large.' },
                { user: 'Sam T.', rating: 5, comment: 'Colors are vibrant, shipped quickly.' }
              ].map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600 }}>{r.user}</div>
                    <div style={{ color: '#F59E0B' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  </div>
                  <div style={{ color: '#4B5563', marginTop: 6 }}>{r.comment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .pd-grid { grid-template-columns: 1fr } }`}</style>
    </div>
  )
}