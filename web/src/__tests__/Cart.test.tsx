import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from './test-utils'
import Cart from '../pages/Cart'

const mockCartItems = [
  { id: 'p1', title: 'Festive Christmas Sweater', price: 39.99, qty: 2, image: 'https://picsum.photos/300/400?1' },
  { id: 'p2', title: 'Halloween Bat Tee', price: 24.99, qty: 1, image: 'https://picsum.photos/300/400?2' },
]

describe('Cart Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('displays empty cart message when cart is empty', () => {
    render(<Cart />)
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument()
  })

  it('displays cart items when cart has items', () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    expect(screen.getByText('Halloween Bat Tee')).toBeInTheDocument()
  })

  it('displays correct item quantities', () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    const quantityInputs = screen.getAllByDisplayValue(/[12]/)
    expect(quantityInputs.length).toBeGreaterThan(0)
  })

  it('increases item quantity when + button is clicked', async () => {
    localStorage.setItem('cart', JSON.stringify([mockCartItems[0]]))
    render(<Cart />)
    
    const plusButtons = screen.getAllByText('+')
    fireEvent.click(plusButtons[0])
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart[0].qty).toBe(3)
    })
  })

  it('decreases item quantity when - button is clicked', async () => {
    localStorage.setItem('cart', JSON.stringify([mockCartItems[0]]))
    render(<Cart />)
    
    const minusButtons = screen.getAllByText('-')
    fireEvent.click(minusButtons[0])
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart[0].qty).toBe(1)
    })
  })

  it('does not decrease quantity below 1', async () => {
    const singleItem = [{ ...mockCartItems[0], qty: 1 }]
    localStorage.setItem('cart', JSON.stringify(singleItem))
    render(<Cart />)
    
    const minusButtons = screen.getAllByText('-')
    fireEvent.click(minusButtons[0])
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart[0].qty).toBe(1)
    })
  })

  it('removes item when remove button is clicked', async () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    const removeButtons = screen.getAllByLabelText('Remove')
    fireEvent.click(removeButtons[0])
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart.length).toBe(1)
      expect(cart[0].id).toBe('p2')
    })
  })

  it('calculates subtotal correctly', () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    // Subtotal: (39.99 * 2) + (24.99 * 1) = 104.97
    expect(screen.getByText(/Subtotal: \$104\.97/i)).toBeInTheDocument()
  })

  it('calculates shipping correctly', () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    expect(screen.getByText(/Estimated shipping: \$5\.00/i)).toBeInTheDocument()
  })

  it('calculates tax correctly', () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    // Tax: 104.97 * 0.08 = 8.40
    expect(screen.getByText(/Tax: \$8\.40/i)).toBeInTheDocument()
  })

  it('calculates total correctly', () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    // Total: 104.97 + 5.00 + 8.40 = 118.37
    expect(screen.getByText(/Total: \$118\.37/i)).toBeInTheDocument()
  })

  it('shows no shipping when cart is empty', () => {
    render(<Cart />)
    expect(screen.getByText(/Estimated shipping: \$0\.00/i)).toBeInTheDocument()
  })

  it('displays product images in cart', () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    render(<Cart />)
    
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('updates when cart-updated event is fired', async () => {
    render(<Cart />)
    expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument()
    
    localStorage.setItem('cart', JSON.stringify([mockCartItems[0]]))
    window.dispatchEvent(new Event('cart-updated'))
    
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
  })

  it('clears cart when clear button is clicked', async () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems))
    
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)
    
    render(<Cart />)
    const clearButton = screen.getByText('Clear Cart')
    fireEvent.click(clearButton)
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart.length).toBe(0)
    })
    
    confirmSpy.mockRestore()
  })
})

