export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'RefundRequested'

export type OrderItem = {
  id: string
  title: string
  price: number
  qty: number
  image?: string
}

export type OrderAddress = {
  fullName: string
  email: string
  phone?: string
  line1: string
  line2?: string
  city: string
  postalCode: string
  country: string
}

export type Order = {
  id: string
  createdAt: string
  status: OrderStatus
  subtotal: number
  tax: number
  shipping: number
  total: number
  items: OrderItem[]
  deliveryAddress: OrderAddress
  deliveryDate: string
  paymentSummary: string
}

const STORAGE_KEY = 'orders'

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function generateOrderId() {
  const ts = Date.now().toString()
  return `TH-${ts.slice(-8)}`
}


