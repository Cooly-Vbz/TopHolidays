import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from './test-utils'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import AccountOverlay from '../components/AccountOverlay'

describe('AccountOverlay', () => {
  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <ThemeProvider>
            {ui}
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    )
  }

  it('shows sign in form for guest users', () => {
    renderWithProviders(<AccountOverlay open={true} onClose={() => { }} />)
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
  })

  it('allows switching between sign in and sign up modes', () => {
    renderWithProviders(<AccountOverlay open={true} onClose={() => { }} />)
    const toggle = screen.getByText(/Don't have an account/i)
    fireEvent.click(toggle)
    expect(screen.getByText(/Create account/i)).toBeInTheDocument()
  })
})


