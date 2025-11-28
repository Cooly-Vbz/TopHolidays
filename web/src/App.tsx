import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import { NotificationsProvider } from './contexts/NotificationsContext'
import { LocaleProvider } from './contexts/LocaleContext'
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
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))

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
    <LocaleProvider>
      <div>
        {loading && <LoadingScreen />}
        <NotificationsProvider>
          <Navbar onMenu={() => setSidebarOpen(true)} onAccount={() => setAccountOpen(true)} isSidebarOpen={sidebarOpen} />
          <ConnectionBanner />
          {location.pathname === '/' && <PWAInstallButton />}
          <AccountOverlay open={accountOpen} onClose={() => setAccountOpen(false)} />
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main style={{ paddingTop: 64, paddingBottom: 96 }}>
            <Suspense fallback={<div style={{ padding: 16 }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
              <Route path="/products/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
              <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/order-confirmation/:id" element={<PageTransition><OrderConfirmation /></PageTransition>} />
              <Route path="/favorites" element={<PageTransition><Favorites /></PageTransition>} />
              <Route path="/orders" element={<PageTransition><Orders /></PageTransition>} />
              <Route path="/customer-care" element={<PageTransition><CustomerCare /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/eula" element={<PageTransition><Eula /></PageTransition>} />
              <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
              <Route path="/notifications" element={<PageTransition><NotificationsPage /></PageTransition>} />
              <Route path="*" element={<PageTransition><div style={{ padding: 16 }}>Not Found. <Link to="/">Go Home</Link></div></PageTransition>} />
            </Routes>
            </Suspense>
            <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>
          </main>
        </NotificationsProvider>
      </div>
    </LocaleProvider>
  )
}

export default App
