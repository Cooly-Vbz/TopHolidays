import { useMemo, useState } from 'react'
import type { Order, OrderStatus } from '../lib/orders'
import { getOrders, saveOrders } from '../lib/orders'

function badgeColor(status: OrderStatus) {
  switch (status) {
    case 'Pending': return '#F59E0B'
    case 'Processing': return '#3B82F6'
    case 'Shipped': return '#8B5CF6'
    case 'Delivered': return '#10B981'
    case 'RefundRequested': return '#EC4899'
    case 'Cancelled': return '#EF4444'
  }
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(() => getOrders())

  const sorted = useMemo(
    () => [...orders].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [orders],
  )

  const updateOrder = (id: string, updater: (order: Order) => Order) => {
    setOrders((prev) => {
      const next = prev.map((o) => (o.id === id ? updater(o) : o))
      saveOrders(next)
      return next
    })
  }

  const cancelOrder = (id: string) => {
    const target = orders.find((o) => o.id === id)
    if (!target) return
    if (target.status === 'Shipped' || target.status === 'Delivered' || target.status === 'RefundRequested') {
      return
    }
    if (!confirm('Cancel this order?')) return
    updateOrder(id, (order) => ({ ...order, status: 'Cancelled' }))
  }

  const requestRefund = (id: string) => {
    const target = orders.find((o) => o.id === id)
    if (!target || target.status !== 'Delivered') return
    if (!confirm('Request a refund for this order?')) return
    updateOrder(id, (order) => ({ ...order, status: 'RefundRequested' }))
  }

  const removeItem = (orderId: string, itemId: string) => {
    const target = orders.find((o) => o.id === orderId)
    if (!target) return
    if (target.status === 'Cancelled' || target.status === 'RefundRequested') return
    if (!confirm('Remove this item from your order?')) return
    updateOrder(orderId, (order) => {
      const remaining = order.items.filter((i) => i.id !== itemId)
      const subtotal = remaining.reduce((n, i) => n + i.price * i.qty, 0)
      const shipping = subtotal > 0 ? order.shipping : 0
      const tax = subtotal * 0.08
      return {
        ...order,
        items: remaining,
        subtotal,
        tax,
        shipping,
        total: subtotal + tax + shipping,
      }
    })
  }

  const updateDeliveryDate = (orderId: string, date: string) => {
    if (!date) return
    updateOrder(orderId, (order) => ({ ...order, deliveryDate: date }))
  }

  const updateAddressLine1 = (orderId: string, line1: string) => {
    updateOrder(orderId, (order) => ({
      ...order,
      deliveryAddress: { ...order.deliveryAddress, line1 },
    }))
  }

  if (!sorted.length) {
    return (
      <div style={{ padding: 16 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Your orders</h2>
        <p style={{ color: '#718096' }}>You don’t have any orders yet.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 20, marginBottom: 8 }}>Your orders</h2>
      {sorted.map((o) => (
        <details key={o.id} style={{ marginBottom: 12, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <summary style={{ listStyle: 'none', padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>Order {o.id}</div>
              <div style={{ fontSize: 12, color: '#718096' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
            </div>
            <span style={{ background: badgeColor(o.status), color: '#fff', padding: '4px 8px', borderRadius: 9999 }}>{o.status}</span>
            <div>${o.total.toFixed(2)} • {o.items.reduce((n, i) => n + i.qty, 0)} items</div>
          </summary>
          <div style={{ padding: 12, display: 'grid', gap: 12 }}>
            <section>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Items</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {o.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, alignItems: 'center' }}>
                    <div>
                      <div>{item.title}</div>
                      <div style={{ color: '#718096' }}>Qty {item.qty}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                    <button
                      onClick={() => removeItem(o.id, item.id)}
                      disabled={o.status === 'Cancelled' || o.status === 'RefundRequested'}
                      style={{
                        marginLeft: 8,
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: 'none',
                        background: '#F97373',
                        color: '#fff',
                        cursor: o.status === 'Cancelled' || o.status === 'RefundRequested' ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Delivery</div>
              <div style={{ fontSize: 14, marginBottom: 8 }}>
                <div>{o.deliveryAddress.fullName}</div>
                <div>{o.deliveryAddress.line1}</div>
                {o.deliveryAddress.line2 && <div>{o.deliveryAddress.line2}</div>}
                <div>{o.deliveryAddress.city}, {o.deliveryAddress.postalCode}</div>
                <div>{o.deliveryAddress.country}</div>
              </div>
              <label style={{ fontSize: 14 }}>
                Delivery date
                <input
                  type="date"
                  value={o.deliveryDate}
                  onChange={(e) => updateDeliveryDate(o.id, e.target.value)}
                  style={{ display: 'block', marginTop: 4, padding: 6, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
              <label style={{ fontSize: 14, display: 'block', marginTop: 8 }}>
                Address line 1
                <input
                  type="text"
                  value={o.deliveryAddress.line1}
                  onChange={(e) => updateAddressLine1(o.id, e.target.value)}
                  style={{ display: 'block', marginTop: 4, padding: 6, borderRadius: 6, border: '1px solid #CBD5E0', width: '100%' }}
                />
              </label>
            </section>

            <section>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Payment & totals</div>
              <div style={{ fontSize: 14 }}>
                <div>{o.paymentSummary}</div>
                <div>Subtotal: ${o.subtotal.toFixed(2)}</div>
                <div>Shipping: ${o.shipping.toFixed(2)}</div>
                <div>Tax: ${o.tax.toFixed(2)}</div>
                <div style={{ fontWeight: 600 }}>Total: ${o.total.toFixed(2)}</div>
              </div>
            </section>

            <section style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <button
                onClick={() => cancelOrder(o.id)}
                disabled={o.status === 'Cancelled' || o.status === 'Delivered' || o.status === 'RefundRequested'}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#F97373',
                  color: '#fff',
                  cursor: o.status === 'Cancelled' || o.status === 'Delivered' || o.status === 'RefundRequested' ? 'not-allowed' : 'pointer',
                }}
              >
                Cancel order
              </button>
              <button
                onClick={() => requestRefund(o.id)}
                disabled={o.status !== 'Delivered'}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#EC4899',
                  color: '#fff',
                  cursor: o.status === 'Delivered' ? 'pointer' : 'not-allowed',
                }}
              >
                Request refund
              </button>
              <button
                onClick={() => (window.location.href = '/customer-care')}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E0',
                  background: '#fff',
                  color: '#1F2933',
                }}
              >
                Contact customer care
              </button>
            </section>
          </div>
        </details>
      ))}
    </div>
  )
}