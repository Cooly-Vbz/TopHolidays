import { describe, it, expect } from 'vitest'
import { render, screen } from './test-utils'
import { Home } from '../pages/Home'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />)
    expect(screen.getByText(/Welcome, Guest!/i)).toBeInTheDocument()
  })

  it('displays holiday message', () => {
    render(<Home />)
    const holidayMsg = screen.getByText(/Happy shopping!|Christmas is coming|Happy New Year|Valentine|Halloween/i)
    expect(holidayMsg).toBeInTheDocument()
  })

  it('has navigation links to all main pages', () => {
    render(<Home />)
    expect(screen.getByText(/My Favorites/i)).toBeInTheDocument()
    expect(screen.getByText(/Cart/i)).toBeInTheDocument()
    expect(screen.getByText(/Browse Products/i)).toBeInTheDocument()
    expect(screen.getByText(/Orders/i)).toBeInTheDocument()
  })

  it('favorites link navigates to /favorites', () => {
    render(<Home />)
    const link = screen.getByText(/My Favorites/i).closest('a')
    expect(link).toHaveAttribute('href', '/favorites')
  })

  it('cart link navigates to /cart', () => {
    render(<Home />)
    const link = screen.getByText(/Cart/i).closest('a')
    expect(link).toHaveAttribute('href', '/cart')
  })

  it('products link navigates to /products', () => {
    render(<Home />)
    const link = screen.getByText(/Browse Products/i).closest('a')
    expect(link).toHaveAttribute('href', '/products')
  })
})

