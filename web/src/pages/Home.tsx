import { Link } from 'react-router-dom'

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
  return (
    <div style={{ padding: 24 }}>
      <div style={{ fontSize: 24, fontWeight: 700 }}>Welcome, {name}!</div>
      <div style={{ fontSize: 18 }}>{holidayMessage()}</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        <Link to="/favorites" style={{ display: 'grid', placeItems: 'center', background: '#FFF1F2', borderRadius: 16, height: 140, textDecoration: 'none', color: '#2D3748' }}>
          <div style={{ fontSize: 48 }}>❤️</div>
          <div style={{ fontSize: 14 }}>My Favorites</div>
        </Link>
        <Link to="/cart" style={{ display: 'grid', placeItems: 'center', background: '#065F46', borderRadius: 16, height: 140, textDecoration: 'none', color: '#fff' }}>
          <div style={{ fontSize: 48 }}>🛒</div>
          <div style={{ fontSize: 14 }}>Cart</div>
        </Link>
        <Link to="/products" style={{ display: 'grid', placeItems: 'center', background: '#1E3A8A', borderRadius: 16, height: 140, textDecoration: 'none', color: '#fff' }}>
          <div style={{ fontSize: 48 }}>👕</div>
          <div style={{ fontSize: 14 }}>Browse Products</div>
        </Link>
        <Link to="/orders" style={{ display: 'grid', placeItems: 'center', background: '#DBEAFE', borderRadius: 16, height: 140, textDecoration: 'none', color: '#2D3748' }}>
          <div style={{ fontSize: 48 }}>🕒</div>
          <div style={{ fontSize: 14 }}>Orders</div>
        </Link>
      </div>
    </div>
  )
}

export default Home