import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from './test-utils'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '../components/ThemeProvider'
import ProductDetails from '../pages/ProductDetails'

const mockProducts = [
  { id: 'p1', title: 'Festive Christmas Sweater', price: 39.99, image: 'https://picsum.photos/300/400?1', promoted: true },
  { id: 'p2', title: 'Halloween Bat Tee', price: 24.99, image: 'https://picsum.photos/300/400?2' },
]

const renderWithRouter = (initialEntries: string[]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('ProductDetails Page', () => {
  beforeEach(() => {
    localStorage.clear()
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      } as Response)
    )
  })

  it('displays product not found for invalid ID', async () => {
    renderWithRouter(['/products/invalid'])
    
    await waitFor(() => {
      expect(screen.getByText(/Product not found/i)).toBeInTheDocument()
    })
  })

  it('displays product details for valid ID', async () => {
    renderWithRouter(['/products/p1'])
    
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
      expect(screen.getByText('$39.99')).toBeInTheDocument()
    })
  })

  it('displays product image', async () => {
    renderWithRouter(['/products/p1'])
    
    await waitFor(() => {
      const images = screen.getAllByRole('img')
      expect(images.length).toBeGreaterThan(0)
    })
  })

  it('adds product to cart when Add to Cart is clicked', async () => {
    renderWithRouter(['/products/p1'])
    
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
    
    const addToCartButton = screen.getByText('Add to Cart')
    fireEvent.click(addToCartButton)
    
    await waitFor(() => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      expect(cart.length).toBe(1)
      expect(cart[0].id).toBe('p1')
    })
  })

  it('toggles favorite when Save to Favorites is clicked', async () => {
    renderWithRouter(['/products/p1'])
    
    await waitFor(() => {
      expect(screen.getByText('Festive Christmas Sweater')).toBeInTheDocument()
    })
    
    const favoriteButton = screen.getByText('Save to Favorites')
    fireEvent.click(favoriteButton)
    
    await waitFor(() => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
      expect(favorites).toContain('p1')
    })
  })

  it('displays product description and details', async () => {
    renderWithRouter(['/products/p1'])
    
    await waitFor(() => {
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Details')).toBeInTheDocument()
      expect(screen.getByText('Shipping')).toBeInTheDocument()
    })
  })

  it('displays reviews section', async () => {
    renderWithRouter(['/products/p1'])
    
    await waitFor(() => {
      expect(screen.getByText('Reviews')).toBeInTheDocument()
      expect(screen.getByText('Write a review')).toBeInTheDocument()
    })
  })
})
