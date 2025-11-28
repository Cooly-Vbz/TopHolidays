import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from './test-utils'
import Sidebar from '../components/Sidebar'

describe('Sidebar', () => {
  it('shows links and theme toggle', async () => {
    render(<Sidebar open={true} onClose={() => { }} />)
    await waitFor(() => {
      expect(screen.getByText(/Browse Products/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/Toggle theme/i)).toBeInTheDocument()
    })
  })

  it('links to EULA and Privacy pages', async () => {
    render(<Sidebar open={true} onClose={() => { }} />)
    await waitFor(() => {
      const eulaLink = screen.getByText(/EULA/i).closest('a')
      const privacyLink = screen.getByText(/Privacy Policy/i).closest('a')
      expect(eulaLink).toHaveAttribute('href', '/eula')
      expect(privacyLink).toHaveAttribute('href', '/privacy')
    })
  })

  it('toggles theme label when clicked', async () => {
    render(<Sidebar open={true} onClose={() => { }} />)
    await waitFor(() => {
      const btn = screen.getByLabelText(/Toggle theme/i)
      const before = btn.textContent
      fireEvent.click(btn)
      const after = btn.textContent
      expect(before).not.toEqual(after)
    })
  })
})


