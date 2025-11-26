import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from './test-utils'
import AccountOverlay from '../components/AccountOverlay'

describe('AccountOverlay', () => {
  it('shows sign in form for guest users', () => {
    render(<AccountOverlay open={true} onClose={() => {}} />)
    expect(screen.getByText(/Sign in/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
  })

  it('allows switching between sign in and sign up modes', () => {
    render(<AccountOverlay open={true} onClose={() => {}} />)
    const toggle = screen.getByText(/Don't have an account/i)
    fireEvent.click(toggle)
    expect(screen.getByText(/Create account/i)).toBeInTheDocument()
  })
})


