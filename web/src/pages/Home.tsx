import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HeartIcon, ShoppingCartIcon, ShirtIcon, ClockIcon } from '../components/icons'

function holidayMessage(date = new Date()) {
  const m = date.getMonth()+1; const d = date.getDate()
  if ((m===12 && d<=26)) return 'Christmas is coming.'
  if ((m===12 && d>=27) || (m===1 && d<=2)) return 'Happy New Year is near.'
  if (m===2 && d<=15) return "Valentine's Day is coming."
  if (m===10 && d>=15 && d<=31) return 'Halloween is coming.'
  return 'Happy shopping!'
}

export function Home() {
  const name = 'Guest'
  const [gridColumns, setGridColumns] = useState('repeat(2, 1fr)')

  useEffect(() => {
    const updateGrid = () => {
      const width = window.innerWidth
      if (width < 640) {
        setGridColumns('1fr') // Mobile: 1 column
      } else if (width < 1024) {
        setGridColumns('repeat(2, 1fr)') // Tablet: 2 columns
      } else {
        setGridColumns('repeat(4, 1fr)') // Desktop: 4 columns
      }
    }

    updateGrid()
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>Welcome, {name}!</div>
      <div style={{ fontSize: 18 }}>{holidayMessage()}</div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gap: 16,
        marginTop: 24,
        maxWidth: 1200,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <Link
          to="/favorites"
          style={{ display: 'grid', placeItems: 'center', background: '#C2185B', borderRadius: 16, height: 140, textDecoration: 'none', color: '#FFFFFF' }}
          aria-label="View your favorite products"
        >
          <HeartIcon size={96} filled aria-hidden="true" />
          <div style={{ fontSize: 16, fontWeight: 600 }}>My Favorites</div>
        </Link>
        <Link
          to="/cart"
          style={{ display: 'grid', placeItems: 'center', background: '#065F46', borderRadius: 16, height: 140, textDecoration: 'none', color: '#fff' }}
          aria-label="View your shopping cart"
        >
          <ShoppingCartIcon size={64} aria-hidden="true" />
          <div style={{ fontSize: 16, fontWeight: 600 }}>Cart</div>
        </Link>
        <Link
          to="/products"
          style={{ display: 'grid', placeItems: 'center', background: '#1E3A8A', borderRadius: 16, height: 140, textDecoration: 'none', color: '#fff' }}
          aria-label="Browse all products"
        >
          <ShirtIcon size={64} aria-hidden="true" />
          <div style={{ fontSize: 16, fontWeight: 600 }}>Browse Products</div>
        </Link>
        <Link
          to="/orders"
          style={{ display: 'grid', placeItems: 'center', background: '#DBEAFE', borderRadius: 16, height: 140, textDecoration: 'none', color: '#2D3748' }}
          aria-label="View your order history"
        >
          <ClockIcon size={64} aria-hidden="true" />
          <div style={{ fontSize: 16, fontWeight: 600 }}>Orders</div>
        </Link>
      </div>
    </div>
  )
}

export default Home