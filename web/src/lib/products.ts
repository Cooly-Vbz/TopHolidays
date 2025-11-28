export type Product = {
  id: string
  title: string
  price: number
  image: string
  promoted?: boolean
  holiday?: string
  category?: string
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/products.json')
  if (!res.ok) throw new Error('Failed to load products')
  // Cache is automatically handled by the service worker for static assets
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  const list = await fetchProducts()
  return list.find(p => p.id === id)
}