import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from './test-utils'
import { MemoryRouter } from 'react-router-dom'
import Checkout from '../pages/Checkout'

function renderWithRouter(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  )
}

describe('Checkout Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  function seedCart() {
    localStorage.setItem('cart', JSON.stringify([
      { id: 'p1', title: 'Festive Christmas Sweater', price: 39.99, qty: 1 },
    ]))
  }

  it('shows empty cart message when no items', () => {
    renderWithRouter(<Checkout />)
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument()
  })

  it('validates required fields on submit', async () => {
    seedCart()
    renderWithRouter(<Checkout />)

    const button = screen.getByText(/Place order/i)
    fireEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Address line 1 is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Postal code is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Card number is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Expiry is required/i)).toBeInTheDocument()
      expect(screen.getByText(/CVC is required/i)).toBeInTheDocument()
    })
  })

  it('creates an order when form is valid', async () => {
    seedCart()
    renderWithRouter(<Checkout />)

    fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/^Email$/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/Address line 1/i), { target: { value: '123 Street' } })
    fireEvent.change(screen.getByLabelText(/^City$/i), { target: { value: 'Town' } })
    fireEvent.change(screen.getByLabelText(/^Postal code$/i), { target: { value: '12345' } })
    fireEvent.change(screen.getByLabelText(/^Country$/i), { target: { value: 'Country' } })
    fireEvent.change(screen.getByPlaceholderText(/1234 5678/i), { target: { value: '4242 4242 4242 4242' } })
    fireEvent.change(screen.getByPlaceholderText(/08\/28/i), { target: { value: '12/99' } })
    // Find CVC field - use more specific selector
    const cvcField = screen.getByPlaceholderText('123')
    fireEvent.change(cvcField, { target: { value: '123' } })

    const button = screen.getByText(/Place order/i)
    fireEvent.click(button)

    await waitFor(() => {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      expect(orders.length).toBe(1)
      expect(orders[0].items[0].id).toBe('p1')
    })
  })
})


