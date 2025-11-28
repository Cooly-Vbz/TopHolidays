import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from './test-utils'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import App from '../App'

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

describe('E2E Flow: Favorites Management → Add to Cart → Checkout', () => {
  beforeEach(() => {
    localStorage.clear()
    window.dispatchEvent(new Event('cart-updated'))
    window.dispatchEvent(new Event('favorites-updated'))
  })

  it('manages favorites list and proceeds to checkout', async () => {
    const user = userEvent.setup()

    // 1. Homepage: browse and add to favorites
    renderApp('/')
    expect(screen.getByRole('heading', { name: /top holidays/i })).toBeInTheDocument()

    const firstProduct = screen.getAllByRole('article')[0]
    const productName = within(firstProduct).getByRole('heading').textContent!

    // Toggle favorite (heart icon)
    const favButton = within(firstProduct).getByRole('button', { name: /favorite/i })
    await user.click(favButton)

    // 2. Favorites: view list overview
    await user.click(screen.getByRole('link', { name: /favorites/i }))
    expect(screen.getByRole('heading', { name: /your favorites/i })).toBeInTheDocument()
    expect(screen.getByText(productName)).toBeInTheDocument()

    // Remove from list
    const favItem = screen.getByRole('article', { name: new RegExp(productName!, 'i') })
    const removeBtn = within(favItem).getByRole('button', { name: /remove/i })
    await user.click(removeBtn)
    expect(screen.queryByText(productName)).not.toBeInTheDocument()

    // Re-add via product details
    await user.click(screen.getByRole('link', { name: /products/i }))
    const secondProduct = screen.getAllByRole('article')[1]
    const secondName = within(secondProduct).getByRole('heading').textContent!
    const viewDetailsBtn = within(secondProduct).getByRole('link', { name: /view details/i })
    await user.click(viewDetailsBtn)

    // Add to favorites from details
    const detailsFavBtn = screen.getByRole('button', { name: /add to favorites/i })
    await user.click(detailsFavBtn)

    // Back to favorites
    await user.click(screen.getByRole('link', { name: /favorites/i }))
    expect(screen.getByText(secondName)).toBeInTheDocument()

    // Add favorites to cart
    const favItem2 = screen.getByRole('article', { name: new RegExp(secondName!, 'i') })
    const addToCartBtn = within(favItem2).getByRole('button', { name: /add to cart/i })
    await user.click(addToCartBtn)

    // 3. Cart: verify and proceed to checkout
    await user.click(screen.getByRole('link', { name: /cart/i }))
    expect(screen.getByRole('heading', { name: /your cart/i })).toBeInTheDocument()
    expect(screen.getByText(secondName)).toBeInTheDocument()

    const checkoutBtn = screen.getByRole('button', { name: /proceed to checkout/i })
    await user.click(checkoutBtn)

    // 4. Checkout: fill form and place order
    expect(screen.getByRole('heading', { name: /checkout/i })).toBeInTheDocument()

    await user.type(screen.getByLabelText(/full name/i), 'Grace Hopper')
    await user.type(screen.getByLabelText(/email/i), 'grace@example.com')
    await user.type(screen.getByLabelText(/phone/i), '5551234567')
    await user.type(screen.getByLabelText(/address line 1/i), '1 Algorithm Ave')
    await user.type(screen.getByLabelText(/city/i), 'Boston')
    await user.type(screen.getByLabelText(/postal code/i), '02101')
    await user.type(screen.getByLabelText(/country/i), 'USA')

    await user.type(screen.getByLabelText(/card number/i), '5555555555554444')
    await user.type(screen.getByLabelText(/expiry/i), '12/30')
    await user.type(screen.getByLabelText(/cvc/i), '123')

    const placeOrderBtn = screen.getByRole('button', { name: /place order/i })
    await user.click(placeOrderBtn)

    // 5. Confirmation
    expect(await screen.findByRole('heading', { name: /order confirmed/i })).toBeInTheDocument()
    expect(screen.getByText(secondName)).toBeInTheDocument()
  })
})