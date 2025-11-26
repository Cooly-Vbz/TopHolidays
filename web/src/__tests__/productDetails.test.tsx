import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProductDetails from '../pages/ProductDetails'

test('renders product details skeleton when no data yet', async () => {
  // Debug: ensure the component is imported correctly
  // eslint-disable-next-line no-console
  console.log('ProductDetails typeof:', typeof ProductDetails)
  const queryClient = new QueryClient()
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/products/p1"]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
  expect(await screen.findByText(/Product not found/i)).toBeInTheDocument()
})