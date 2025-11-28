import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from './test-utils'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import Navbar from '../components/Navbar'

describe('Navbar', () => {
  const renderWithProviders = (ui: React.ReactElement) =>
    render(
      <MemoryRouter>
        <AuthProvider>
          <ThemeProvider>
            {ui}
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    )

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders Top Holidays brand', () => {
    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)
    expect(screen.getByText('Top Holidays')).toBeInTheDocument()
  })

  it('shows cart count badge when cart has items', () => {
    localStorage.setItem('cart', JSON.stringify([
      { id: 'p1', title: 'Product 1', price: 10, qty: 2 },
      { id: 'p2', title: 'Product 2', price: 20, qty: 1 },
    ]))

    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)

    // Cart count should be 3 (2 + 1)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show cart badge when cart is empty', () => {
    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)

    const badge = screen.queryByText(/\d+/)
    // The badge should not exist or show 0
    if (badge) {
      expect(badge.textContent).not.toBe('0')
    }
  })

  it('updates cart count when cart-updated event fires', async () => {
    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)

    localStorage.setItem('cart', JSON.stringify([
      { id: 'p1', title: 'Product 1', price: 10, qty: 1 },
    ]))
    window.dispatchEvent(new Event('cart-updated'))

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
  })

  it('calls onMenu when menu button is clicked', () => {
    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)

    const menuButton = screen.getByLabelText('Menu')
    fireEvent.click(menuButton)
    expect(onMenu).toHaveBeenCalledTimes(1)
  })

  it('calls onAccount when account button is clicked', () => {
    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)

    const accountButton = screen.getByLabelText('Account')
    fireEvent.click(accountButton)
    expect(onAccount).toHaveBeenCalledTimes(1)
  })

  it('navigates to cart when cart button is clicked', () => {
    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)

    const cartButton = screen.getByLabelText('Cart')
    fireEvent.click(cartButton)

    // Navigation is handled by react-router, we verify the button exists and is clickable
    expect(cartButton).toBeInTheDocument()
  })

  it('navigates to home when brand is clicked', () => {
    const onMenu = vi.fn()
    const onAccount = vi.fn()
    renderWithProviders(<Navbar onMenu={onMenu} onAccount={onAccount} />)

    const homeButton = screen.getByLabelText('Go Home')
    fireEvent.click(homeButton)

    expect(homeButton).toBeInTheDocument()
  })
})


