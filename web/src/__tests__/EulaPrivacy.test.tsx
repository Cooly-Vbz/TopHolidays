import { describe, it, expect } from 'vitest'
import { render, screen } from './test-utils'
import Eula from '../pages/Eula'
import Privacy from '../pages/Privacy'

describe('Legal pages', () => {
  it('renders EULA content', () => {
    render(<Eula />)
    expect(screen.getByText(/End User License Agreement/i)).toBeInTheDocument()
  })

  it('renders Privacy Policy content', () => {
    render(<Privacy />)
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument()
  })
})


