import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import ConnectionBanner from './components/ConnectionBanner'
import AccountOverlay from './components/AccountOverlay'
import Sidebar from './components/Sidebar'
import LoadingScreen from './components/LoadingScreen'
import PWAInstallButton from './components/PWAInstallButton'
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Orders = lazy(() => import('./pages/Orders'))
const CustomerCare = lazy(() => import('./pages/CustomerCare'))
const About = lazy(() => import('./pages/About'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Eula = lazy(() => import('./pages/Eula'))
const Privacy = lazy(() => import('./pages/Privacy'))

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div>
      {loading && <LoadingScreen />}
      <Navbar onMenu={() => setSidebarOpen(true)} onAccount={() => setAccountOpen(true)} />
      <ConnectionBanner />
      {location.pathname === '/' && <PWAInstallButton />}
      <AccountOverlay open={accountOpen} onClose={() => setAccountOpen(false)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main style={{ paddingTop: 64, paddingBottom: 96 }}>
        <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Home /></div>} />
            <Route path="/products" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Products /></div>} />
            <Route path="/products/:id" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><ProductDetails /></div>} />
            <Route path="/cart" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Cart /></div>} />
            <Route path="/checkout" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Checkout /></div>} />
            <Route path="/order-confirmation/:id" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><OrderConfirmation /></div>} />
            <Route path="/favorites" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Favorites /></div>} />
            <Route path="/orders" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Orders /></div>} />
            <Route path="/customer-care" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><CustomerCare /></div>} />
            <Route path="/about" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><About /></div>} />
            <Route path="/eula" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Eula /></div>} />
            <Route path="/privacy" element={<div style={{ animation: 'fadeIn 250ms ease-out' }}><Privacy /></div>} />
            <Route path="*" element={<div style={{ padding: 16 }}>Not Found. <Link to="/">Go Home</Link></div>} />
          </Routes>
        </Suspense>
        <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
      </main>
    </div>
  )
}

export default App
