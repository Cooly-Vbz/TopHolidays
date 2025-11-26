import { render, screen, fireEvent } from '@testing-library/react'
import InstallPrompt from '../components/InstallPrompt'

function triggerBeforeInstallPrompt() {
  const e: any = new Event('beforeinstallprompt')
  e.prompt = async () => {}
  window.dispatchEvent(e)
}

test('shows Install CTA when beforeinstallprompt fires', async () => {
  render(<InstallPrompt show={true} />)
  triggerBeforeInstallPrompt()
  expect(await screen.findByText(/Install Top Holidays/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /Install/i })).toBeInTheDocument()
})