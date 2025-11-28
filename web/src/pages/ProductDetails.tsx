import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchProducts, type Product } from '../lib/products'
import { getReviews, getAverageRating, addReview } from '../lib/reviews'
import { useTheme } from '../components/ThemeProvider'
import StarRating from '../components/StarRating'
import ReviewCard from '../components/ReviewCard'
import { useAuth } from '../components/AuthProvider'

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
  const { theme } = useTheme()
  const { user } = useAuth()
  const isDark = theme === 'dark'

  const { data } = useQuery({ queryKey: ['products'], queryFn: fetchProducts, staleTime: 1000 * 60 * 5 })
  const list = (data && Array.isArray(data)) ? data : []
  const product = list.find(p => p.id === id)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [reviews, setReviews] = useState(() => id ? getReviews(id) : [])

  if (!product) return <div style={{ padding: 16 }}>Product not found.</div>

  const { rating: avgRating, count: reviewCount } = getAverageRating(product.id)

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newReview = addReview({
      productId: product.id,
      author: user.displayName || user.email.split('@')[0],
      rating,
      comment,
    })

    setReviews([newReview, ...reviews])
    setShowReviewForm(false)
    setComment('')
    setRating(5)
  }

  const textColor = isDark ? '#E5E7EB' : '#111827'
  const mutedColor = isDark ? '#9CA3AF' : '#6B7280'
  const borderColor = isDark ? '#374151' : '#E5E7EB'

  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <div className="pd-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          <img src={product.image} alt={product.title} loading="lazy" style={{ width: '100%', borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 16, overflowX: 'auto', paddingBottom: 8 }}>
            {[1, 2, 3, 4, 5].map(n => <img key={n} src={`https://picsum.photos/seed/${product.id}-${n}/120/80`} alt="thumb" loading="lazy" style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0.8'} />)}
          </div>
        </div>

        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: 32, color: textColor }}>{product.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: isDark ? '#60A5FA' : '#2563EB' }}>
              ${product.price.toFixed(2)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <StarRating rating={avgRating} size={18} />
              <span style={{ color: mutedColor, fontSize: 14 }}>({reviewCount} reviews)</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
            <button
              onClick={() => addToCart(product)}
              style={{
                width: '100%',
                background: '#10B981',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '14px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.1s',
                boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Add to Cart
            </button>
            <button
              onClick={() => toggleFavorite(product.id)}
              style={{
                width: '100%',
                border: `2px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                color: textColor,
                background: 'transparent',
                borderRadius: 12,
                padding: '14px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Save to Favorites
            </button>
          </div>

          <div style={{ color: textColor, lineHeight: 1.6 }}>
            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Description</h3>
            <p style={{ margin: '0 0 16px 0', color: mutedColor }}>Soft cotton blend with festive patterns. Machine washable. Perfect for holiday gatherings or cozy nights in.</p>

            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Details</h3>
            <ul style={{ margin: '0 0 16px 0', paddingLeft: 20, color: mutedColor }}>
              <li>Unisex fit</li>
              <li>Available in multiple sizes</li>
              <li>Premium quality fabric</li>
            </ul>

            <h3 style={{ fontSize: 18, marginBottom: 8 }}>Shipping</h3>
            <p style={{ margin: 0, color: mutedColor }}>Ships within 2 business days. Free returns within 30 days.</p>
          </div>

          <hr style={{ border: 0, height: 1, background: borderColor, margin: '32px 0' }} />

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 24, color: textColor }}>Customer Reviews</h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                style={{
                  border: `1px solid ${isDark ? '#60A5FA' : '#3B82F6'}`,
                  borderRadius: 8,
                  padding: '8px 16px',
                  background: isDark ? 'rgba(96, 165, 250, 0.1)' : '#EFF6FF',
                  color: isDark ? '#60A5FA' : '#3B82F6',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Write a review
              </button>
            </div>

            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} style={{
                marginBottom: 24,
                padding: 20,
                background: isDark ? '#1F2937' : '#F3F4F6',
                borderRadius: 12,
                animation: 'slideDown 0.2s ease-out'
              }}>
                {!user ? (
                  <div style={{ textAlign: 'center', padding: 20, color: mutedColor }}>
                    Please sign in to write a review.
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: textColor }}>Rating</label>
                      <StarRating rating={rating} interactive onChange={setRating} size={28} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', marginBottom: 8, fontWeight: 600, color: textColor }}>Review</label>
                      <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        required
                        rows={4}
                        placeholder="Share your thoughts..."
                        style={{
                          width: '100%',
                          padding: 12,
                          borderRadius: 8,
                          border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
                          background: isDark ? '#374151' : '#fff',
                          color: textColor,
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 8,
                          border: 'none',
                          background: 'transparent',
                          color: mutedColor,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: '10px 24px',
                          borderRadius: 8,
                          border: 'none',
                          background: '#3B82F6',
                          color: '#fff',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Submit Review
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}

            <div style={{ display: 'grid', gap: 16 }}>
              {reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: mutedColor, background: isDark ? 'rgba(255,255,255,0.02)' : '#F9FAFB', borderRadius: 12 }}>
                  No reviews yet. Be the first to write one!
                </div>
              ) : (
                reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { 
          .pd-grid { grid-template-columns: 1fr !important; gap: 24px !important; } 
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}