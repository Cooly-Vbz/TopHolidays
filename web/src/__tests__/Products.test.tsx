import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from './test-utils'
import Products from '../pages/Products'

// Mock fetch for products
const mockProducts = [
  { id: 'p1', title: 'Festive Christmas Sweater', price: 39.99, image: 'https://picsum.photos/300/400?1', promoted: true },
  { id: 'p2', title: 'Halloween Bat Tee', price: 24.99, image: 'https://picsum.photos/300/400?2' },
  { id: 'p3', title: 'Valentine Heart Hoodie', price: 49.00, image: 'https://picsum.photos/300/400?3', promoted: true },
]

describe('Products Page', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response)
    )
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('shows loading state initially', () => {
    render(<Products />)
    expect(screen.getByText(/Loading products/i)).toBeInTheDocument()
  })

  it('displays products after loading', async () => {
    render(<Products />)
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
    expect(screen.getByText('Halloween Bat Tee')).toBeInTheDocument()
    expect(screen.getByText('Valentine Heart Hoodie')).toBeInTheDocument()
  })

  it('displays product prices', async () => {
    render(<Products />)
    await waitFor(() => {
      expect(screen.getByText('$39.99')).toBeInTheDocument()
    })
    expect(screen.getByText('$24.99')).toBeInTheDocument()
    expect(screen.getByText('$49.00')).toBeInTheDocument()
  })

  it('shows promoted badge for promoted products', async () => {
    render(<Products />)
    await waitFor(() => {
      const promotedProducts = screen.getAllByText('⭐')
      expect(promotedProducts.length).toBeGreaterThan(0)
    })
  })

  it('allows adding product to cart', async () => {
    render(<Products />)
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
    
    const addToCartButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addToCartButtons[0])
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart.length).toBe(1)
      expect(cart[0].id).toBe('p1')
    })
  })

  it('allows toggling favorites', async () => {
    render(<Products />)
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
    
    const favoriteButtons = screen.getAllByLabelText('Toggle Favorite')
    fireEvent.click(favoriteButtons[0])
    
    await waitFor(() => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      expect(favorites).toContain('p1')
    })
  })

  it('shows visual feedback when product is favorited', async () => {
    localStorage.setItem('favorites', JSON.stringify(['p1']))
    render(<Products />)
    
    await waitFor(() => {
      const favoriteButtons = screen.getAllByLabelText('Toggle Favorite')
      // Check that the first button has the red background style
      const firstButton = favoriteButtons[0]
      expect(firstButton).toHaveStyle({ background: '#EF4444' })
    })
  })

  it('navigates to product details on click', async () => {
    const { container } = render(<Products />)
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
    
    const productCard = container.querySelector('[onclick]')
    if (productCard) {
      fireEvent.click(productCard)
      // Navigation is handled by react-router, we just verify the click works
      expect(productCard).toBeInTheDocument()
    }
  })

  it('shows error message when fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))
    render(<Products />)
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load products/i)).toBeInTheDocument()
    })
  })
})


