import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from './test-utils'
import Favorites from '../pages/Favorites'

describe('Favorites Page', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('displays empty state when no favorites', () => {
    render(<Favorites />)
    expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument()
  })

  it('displays favorite products', () => {
    localStorage.setItem('favorites', JSON.stringify(['p1', 'p3']))
    render(<Favorites />)
    
    expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    expect(screen.getByText('Valentine Heart Hoodie')).toBeInTheDocument()
  })

  it('shows product images for favorites', () => {
    localStorage.setItem('favorites', JSON.stringify(['p1']))
    render(<Favorites />)
    
    const images = screen.getAllByRole('img')
    expect(images.length).toBeGreaterThan(0)
  })

  it('shows product prices for favorites', () => {
    localStorage.setItem('favorites', JSON.stringify(['p1']))
    render(<Favorites />)
    
    expect(screen.getByText('$39.99')).toBeInTheDocument()
  })

  it('removes favorite when remove button is clicked', async () => {
    localStorage.setItem('favorites', JSON.stringify(['p1', 'p2']))
    render(<Favorites />)
    
    const removeButtons = screen.getAllByLabelText('Remove')
    fireEvent.click(removeButtons[0])
    
    await waitFor(() => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      expect(favorites.length).toBe(1)
    })
  })

  it('moves favorite to cart when Move to Cart is clicked', async () => {
    localStorage.setItem('favorites', JSON.stringify(['p1']))
    localStorage.setItem('cart', JSON.stringify([]))
    render(<Favorites />)
    
    const moveToCartButtons = screen.getAllByText('Move to Cart')
    fireEvent.click(moveToCartButtons[0])
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart.length).toBe(1)
      expect(cart[0].id).toBe('p1')
      
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      expect(favorites).not.toContain('p1')
    })
  })

  it('increments quantity if product already in cart', async () => {
    localStorage.setItem('favorites', JSON.stringify(['p1']))
    localStorage.setItem('cart', JSON.stringify([{ id: 'p1', title: 'Festive Christmas Sweater', price: 39.99, qty: 1, image: 'https://picsum.photos/300/400?1' }]))
    render(<Favorites />)
    
    const moveToCartButtons = screen.getAllByText('Move to Cart')
    fireEvent.click(moveToCartButtons[0])
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart[0].qty).toBe(2)
    })
  })

  it('updates when favorites-updated event is fired', async () => {
    render(<Favorites />)
    expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument()
    
    localStorage.setItem('favorites', JSON.stringify(['p1']))
    window.dispatchEvent(new Event('favorites-updated'))
    
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
  })

  it('shows promoted badge for promoted products', () => {
    localStorage.setItem('favorites', JSON.stringify(['p1', 'p3']))
    render(<Favorites />)
    
    const promotedBadges = screen.getAllByText('⭐')
    expect(promotedBadges.length).toBeGreaterThan(0)
  })
})


