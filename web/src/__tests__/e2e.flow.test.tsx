import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'
import { AuthProvider } from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'

// Helper to render app with router and auth provider
const renderApp = (initialRoute = '/') => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('E2E Flow: Product Browse → Details → Cart → Checkout → Confirmation', () => {
  beforeEach(() => {
    localStorage.clear()
    window.dispatchEvent(new Event('cart-updated'))
  })

  it('completes full purchase flow', async () => {
    const user = userEvent.setup()

    // 1. Homepage: browse products
    renderApp('/')
    expect(screen.getByRole('heading', { name: /top holidays/i })).toBeInTheDocument()

    // Click first product card to view details
    const firstProduct = screen.getAllByRole('article')[0]
    const productName = within(firstProduct).getByRole('heading').textContent!
    const viewDetailsBtn = within(firstProduct).getByRole('link', { name: /view details/i })
    await user.click(viewDetailsBtn)

    // 2. Product Details: check reviews and add to cart
    expect(screen.getByRole('heading', { name: productName })).toBeInTheDocument()
    // Ensure reviews section is present
    expect(screen.getByRole('heading', { name: /reviews/i })).toBeInTheDocument()

    const addToCartBtn = screen.getByRole('button', { name: /add to cart/i })
    await user.click(addToCartBtn)

    // 3. Cart: verify item and proceed to checkout
    await user.click(screen.getByRole('link', { name: /cart/i }))
    expect(screen.getByRole('heading', { name: /your cart/i })).toBeInTheDocument()
    expect(screen.getByText(productName)).toBeInTheDocument()

    const checkoutBtn = screen.getByRole('button', { name: /proceed to checkout/i })
    await user.click(checkoutBtn)

    // 4. Checkout: fill billing and payment with validation
    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument()

    // Fill required fields
    await user.type(screen.getByLabelText(/full name/i), 'Ada Lovelace')
    await user.type(screen.getByLabelText(/email/i), 'ada@example.com')
    await user.type(screen.getByLabelText(/phone/i), '1234567890')
    await user.type(screen.getByLabelText(/address line 1/i), '1 Computing Way')
    await user.type(screen.getByLabelText(/city/i), 'London')
    await user.type(screen.getByLabelText(/postal code/i), 'EC1A 1BB')
    await user.type(screen.getByLabelText(/country/i), 'UK')

    // Payment details
    await user.type(screen.getByLabelText(/card number/i), '4111111111111111')
    await user.type(screen.getByLabelText(/expiry/i), '12/30')
    await user.type(screen.getByLabelText(/cvc/i), '123')

    // Submit order
    const placeOrderBtn = screen.getByRole('button', { name: /place order/i })
    await user.click(placeOrderBtn)

    // 5. Order Confirmation: verify success message and details
    expect(await screen.findByRole('heading', { name: /order confirmed/i })).toBeInTheDocument()
    expect(screen.getByText(/thank you/i)).toBeInTheDocument()
    expect(screen.getByText(productName)).toBeInTheDocument()

    // Cart should be empty now
    await user.click(screen.getByRole('link', { name: /cart/i }))
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument()
  })

  it('shows validation errors on incomplete checkout form', async () => {
    const user = userEvent.setup()

    // Add item to cart first
    localStorage.setItem('cart', JSON.stringify([{ id: '1', name: 'Test Gift', price: 50, qty: 1 }]))
    window.dispatchEvent(new Event('cart-updated'))

    renderApp('/checkout')

    // Submit empty form
    const placeOrderBtn = screen.getByRole('button', { name: /place order/i })
    await user.click(placeOrderBtn)

    // Expect validation messages
    expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/address line 1 is required/i)).toBeInTheDocument()
    expect(screen.getByText(/city is required/i)).toBeInTheDocument()
    expect(screen.getByText(/postal code is required/i)).toBeInTheDocument()
    expect(screen.getByText(/country is required/i)).toBeInTheDocument()
    expect(screen.getByText(/card number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/expiry is required/i)).toBeInTheDocument()
    expect(screen.getByText(/cvc is required/i)).toBeInTheDocument()
  })
})