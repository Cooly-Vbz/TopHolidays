import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from './test-utils'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'
import { saveOrders } from '../lib/orders'
import { AuthProvider } from '../components/AuthProvider'
import { ThemeProvider } from '../components/ThemeProvider'

const renderApp = (initialRoute = '/') => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <ThemeProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('E2E Flow: Orders Management → Cancel / Refund / Modify / Contact Care', () => {
  beforeEach(() => {
    localStorage.clear()
    window.dispatchEvent(new Event('cart-updated'))
  })

  function seedOrders() {
    const orders = [
      {
        id: 'ORD-123',
        status: 'confirmed' as const,
        createdAt: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        address: {
          fullName: 'Alan Turing',
          email: 'alan@example.com',
          phone: '1234567890',
          line1: '1 Enigma St',
          line2: '',
          city: 'London',
          postalCode: 'EC1A 1BB',
          country: 'UK',
        },
        items: [
          { id: '1', name: 'Enigma Gift Box', price: 99, qty: 1 },
          { id: '2', name: 'Codebreaker Candle', price: 25, qty: 2 },
        ],
        subtotal: 149,
        shipping: 5,
        tax: 12,
        total: 166,
      },
      {
        id: 'ORD-456',
        status: 'delivered' as const,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        address: {
          fullName: 'Grace Hopper',
          email: 'grace@example.com',
          phone: '5551234567',
          line1: '1 Cobol Ln',
          line2: '',
          city: 'Boston',
          postalCode: '02101',
          country: 'USA',
        },
        items: [{ id: '3', name: 'Compiler Coffee Mug', price: 15, qty: 1 }],
        subtotal: 15,
        shipping: 5,
        tax: 1.2,
        total: 21.2,
      },
    ]
    saveOrders(orders)
  }

  it('lists orders and allows cancel, refund, modify, contact', async () => {
    const user = userEvent.setup()
    seedOrders()

    renderApp('/')

    // 1. Navigate to Orders
    await user.click(screen.getByRole('link', { name: /orders/i }))
    expect(screen.getByRole('heading', { name: /your orders/i })).toBeInTheDocument()

    // Confirm both orders appear
    expect(screen.getByText(/ORD-123/)).toBeInTheDocument()
    expect(screen.getByText(/ORD-456/)).toBeInTheDocument()

    // 2. View order details for confirmed order
    const confirmedOrderCard = screen.getByRole('article', { name: /ORD-123/ })
    const viewDetailsBtn = within(confirmedOrderCard).getByRole('link', { name: /view details/i })
    await user.click(viewDetailsBtn)

    // Ensure details visible
    expect(screen.getByRole('heading', { name: /order details/i })).toBeInTheDocument()
    expect(screen.getByText(/Enigma Gift Box/)).toBeInTheDocument()
    expect(screen.getByText(/Codebreaker Candle/)).toBeInTheDocument()

    // 3. Cancel current order
    const cancelBtn = screen.getByRole('button', { name: /cancel order/i })
    await user.click(cancelBtn)

    // Confirm cancellation dialog
    const confirmDialog = screen.getByRole('dialog')
    const confirmBtn = within(confirmDialog).getByRole('button', { name: /confirm/i })
    await user.click(confirmBtn)

    // Verify status updated
    expect(await screen.findByText(/status: cancelled/i)).toBeInTheDocument()

    // 4. Back to orders list
    await user.click(screen.getByRole('link', { name: /orders/i }))

    // 5. Request refund for delivered order
    const deliveredOrderCard = screen.getByRole('article', { name: /ORD-456/ })
    const refundBtn = within(deliveredOrderCard).getByRole('button', { name: /request refund/i })
    await user.click(refundBtn)

    const refundDialog = screen.getByRole('dialog')
    await user.type(within(refundDialog).getByLabelText(/reason/i), 'Item arrived damaged')
    const submitRefundBtn = within(refundDialog).getByRole('button', { name: /submit/i })
    await user.click(submitRefundBtn)

    expect(await screen.findByText(/refund requested/i)).toBeInTheDocument()

    // 6. Modify delivery address for confirmed order (re-seed to get non-cancelled)
    seedOrders()
    await user.click(screen.getByRole('link', { name: /orders/i }))
    const newConfirmedCard = screen.getByRole('article', { name: /ORD-123/ })
    const newViewBtn = within(newConfirmedCard).getByRole('link', { name: /view details/i })
    await user.click(newViewBtn)

    const modifyAddressBtn = screen.getByRole('button', { name: /modify delivery address/i })
    await user.click(modifyAddressBtn)

    const addressDialog = screen.getByRole('dialog')
    const line1Input = within(addressDialog).getByLabelText(/address line 1/i)
    await user.clear(line1Input)
    await user.type(line1Input, '2 Bletchley Park')
    const saveAddressBtn = within(addressDialog).getByRole('button', { name: /save/i })
    await user.click(saveAddressBtn)

    expect(await screen.findByText(/2 Bletchley Park/)).toBeInTheDocument()

    // 7. Contact customer care
    const contactBtn = screen.getByRole('button', { name: /contact customer care/i })
    await user.click(contactBtn)

    // Should navigate to customer care page
    expect(await screen.findByRole('heading', { name: /customer care/i })).toBeInTheDocument()
    expect(screen.getByText(/how can we help/i)).toBeInTheDocument()
  })
})