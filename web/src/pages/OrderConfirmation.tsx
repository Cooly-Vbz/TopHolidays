import { useNavigate, useParams } from 'react-router-dom'
import { getOrders } from '../lib/orders'

export default function OrderConfirmation() {
  const { id } = useParams()
  const navigate = useNavigate()
  const orders = getOrders()
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Order not found</h1>
        <p style={{ marginBottom: 12 }}>We could not find that order. It may have been cleared.</p>
        <button
          onClick={() => navigate('/orders')}
          style={{ padding: 10, borderRadius: 8, border: 'none', background: '#3B82F6', color: '#fff' }}
        >
          View all orders
        </button>
      </div>
    )
  }

  const createdDate = new Date(order.createdAt)
  const formattedDate = createdDate.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Thank you for your order!</h1>
      <p style={{ color: '#718096', marginBottom: 12 }}>
        Your order <strong>{order.id}</strong> is currently <strong>{order.status}</strong>.
      </p>
      <div style={{ marginBottom: 12 }}>
        <div>Placed on {formattedDate}</div>
        <div>Estimated delivery by {order.deliveryDate}</div>
        <div style={{ marginTop: 4 }}>Total paid: <strong>${order.total.toFixed(2)}</strong></div>
      </div>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Delivery to</h2>
        <div style={{ fontSize: 14 }}>
          <div>{order.deliveryAddress.fullName}</div>
          <div>{order.deliveryAddress.line1}</div>
          {order.deliveryAddress.line2 && <div>{order.deliveryAddress.line2}</div>}
          <div>
            {order.deliveryAddress.city}, {order.deliveryAddress.postalCode}
          </div>
          <div>{order.deliveryAddress.country}</div>
        </div>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Items</h2>
        <div style={{ display: 'grid', gap: 8 }}>
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ color: '#718096' }}>Qty {item.qty}</div>
              </div>
              <div>${(item.price * item.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Payment</h2>
        <div style={{ fontSize: 14 }}>
          <div>{order.paymentSummary}</div>
          <div>Subtotal: ${order.subtotal.toFixed(2)}</div>
          <div>Shipping: ${order.shipping.toFixed(2)}</div>
          <div>Tax: ${order.tax.toFixed(2)}</div>
          <div style={{ fontWeight: 600 }}>Total: ${order.total.toFixed(2)}</div>
        </div>
      </section>

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={() => navigate('/orders')}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#E5E7EB', color: '#1F2933' }}
        >
          View all orders
        </button>
        <button
          onClick={() => navigate('/products')}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: 'none', background: '#3B82F6', color: '#fff' }}
        >
          Continue shopping
        </button>
      </div>
    </div>
  )
}


