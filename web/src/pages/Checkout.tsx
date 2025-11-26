import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { OrderAddress, OrderItem, Order } from '../lib/orders'
import { generateOrderId, getOrders, saveOrders } from '../lib/orders'

type CartItem = OrderItem

type CheckoutForm = OrderAddress & {
  cardNumber: string
  expiry: string
  cvc: string
  saveInfo: boolean
  deliveryDate: string
}

type FormErrors = Partial<Record<keyof CheckoutForm, string>>

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('cart')
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function clearCart() {
  localStorage.setItem('cart', JSON.stringify([]))
  window.dispatchEvent(new Event('cart-updated'))
}

function validateEmail(value: string) {
  if (!value.trim()) return 'Email is required'
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(value.trim())) return 'Enter a valid email address'
  return ''
}

function validateRequired(value: string, label: string) {
  if (!value.trim()) return `${label} is required`
  return ''
}

function validatePostalCode(value: string) {
  if (!value.trim()) return 'Postal code is required'
  if (value.length < 3 || value.length > 10) return 'Postal code looks invalid'
  return ''
}

function validateCardNumber(value: string) {
  const digits = value.replace(/\s+/g, '')
  if (!digits) return 'Card number is required'
  if (!/^\d{16}$/.test(digits)) return 'Card number must be 16 digits'
  return ''
}

function validateExpiry(value: string) {
  if (!value.trim()) return 'Expiry is required'
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim())
  if (!match) return 'Use MM/YY format'
  const month = Number(match[1])
  const year = Number(match[2])
  if (month < 1 || month > 12) return 'Enter a valid month'
  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card is expired'
  }
  return ''
}

function validateCvc(value: string) {
  if (!value.trim()) return 'CVC is required'
  if (!/^\d{3,4}$/.test(value.trim())) return 'CVC must be 3 or 4 digits'
  return ''
}

function maskCardNumber(value: string) {
  const digits = value.replace(/\s+/g, '')
  if (digits.length < 4) return 'Card ending in ****'
  const last4 = digits.slice(-4)
  return `Card ending in ${last4}`
}

export default function Checkout() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<CheckoutForm>(() => {
    const today = new Date()
    const defaultDelivery = new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)
    const yyyy = defaultDelivery.getFullYear()
    const mm = String(defaultDelivery.getMonth() + 1).padStart(2, '0')
    const dd = String(defaultDelivery.getDate()).padStart(2, '0')
    return {
      fullName: '',
      email: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      postalCode: '',
      country: '',
      cardNumber: '',
      expiry: '',
      cvc: '',
      saveInfo: true,
      deliveryDate: `${yyyy}-${mm}-${dd}`,
    }
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({})

  useEffect(() => {
    setCartItems(readCart())
  }, [])

  const { subtotal, shipping, tax, total } = useMemo(() => {
    const subtotalValue = cartItems.reduce((n, i) => n + i.price * i.qty, 0)
    const shippingValue = subtotalValue > 0 ? 5 : 0
    const taxValue = subtotalValue * 0.08
    return {
      subtotal: subtotalValue,
      shipping: shippingValue,
      tax: taxValue,
      total: subtotalValue + shippingValue + taxValue,
    }
  }, [cartItems])

  function runValidation(nextForm: CheckoutForm): FormErrors {
    const nextErrors: FormErrors = {}

    nextErrors.fullName = validateRequired(nextForm.fullName, 'Full name')
    nextErrors.email = validateEmail(nextForm.email)
    nextErrors.line1 = validateRequired(nextForm.line1, 'Address line 1')
    nextErrors.city = validateRequired(nextForm.city, 'City')
    nextErrors.country = validateRequired(nextForm.country, 'Country')
    nextErrors.postalCode = validatePostalCode(nextForm.postalCode)
    nextErrors.cardNumber = validateCardNumber(nextForm.cardNumber)
    nextErrors.expiry = validateExpiry(nextForm.expiry)
    nextErrors.cvc = validateCvc(nextForm.cvc)

    const deliveryDateError = (() => {
      if (!nextForm.deliveryDate) return 'Delivery date is required'
      const date = new Date(nextForm.deliveryDate)
      const today = new Date()
      const min = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      if (Number.isNaN(date.getTime())) return 'Delivery date is invalid'
      if (date < min) return 'Choose a delivery date from tomorrow onward'
      return ''
    })()
    if (deliveryDateError) nextErrors.deliveryDate = deliveryDateError

    Object.keys(nextErrors).forEach((key) => {
      const k = key as keyof FormErrors
      if (!nextErrors[k]) delete nextErrors[k]
    })

    return nextErrors
  }

  function handleChange<K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) {
    const nextForm = { ...form, [field]: value }
    setForm(nextForm)
    if (touched[field]) {
      const fieldErrors = runValidation(nextForm)
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
    }
  }

  function handleBlur<K extends keyof CheckoutForm>(field: K) {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const fieldErrors = runValidation(form)
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!cartItems.length) {
      navigate('/cart')
      return
    }
    const nextErrors = runValidation(form)
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      line1: true,
      line2: true,
      city: true,
      postalCode: true,
      country: true,
      cardNumber: true,
      expiry: true,
      cvc: true,
      saveInfo: true,
      deliveryDate: true,
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    const orderId = generateOrderId()
    const address: OrderAddress = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      line1: form.line1.trim(),
      line2: form.line2.trim() || undefined,
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: form.country.trim(),
    }

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'Processing',
      subtotal,
      tax,
      shipping,
      total,
      items: cartItems,
      deliveryAddress: address,
      deliveryDate: form.deliveryDate,
      paymentSummary: maskCardNumber(form.cardNumber),
    }

    const existing = getOrders()
    saveOrders([newOrder, ...existing])
    clearCart()
    setSubmitting(false)
    navigate(`/order-confirmation/${orderId}`)
  }

  const disabled = submitting || !cartItems.length

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Checkout</h1>
      {!cartItems.length && (
        <p style={{ color: '#EF4444', marginBottom: 16 }}>
          Your cart is empty. Add items before checking out.
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <section style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Billing details</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <div>
              <label>
                Full name
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  aria-invalid={!!errors.fullName}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
              {errors.fullName && (
                <div id="fullName-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.fullName}</div>
              )}
            </div>
            <div>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
              {errors.email && (
                <div id="email-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.email}</div>
              )}
            </div>
            <div>
              <label>
                Phone (optional)
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Shipping address</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <div>
              <label>
                Address line 1
                <input
                  type="text"
                  value={form.line1}
                  onChange={(e) => handleChange('line1', e.target.value)}
                  onBlur={() => handleBlur('line1')}
                  aria-invalid={!!errors.line1}
                  aria-describedby={errors.line1 ? 'line1-error' : undefined}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
              {errors.line1 && (
                <div id="line1-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.line1}</div>
              )}
            </div>
            <div>
              <label>
                Address line 2 (optional)
                <input
                  type="text"
                  value={form.line2}
                  onChange={(e) => handleChange('line2', e.target.value)}
                  onBlur={() => handleBlur('line2')}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8 }}>
              <div>
                <label>
                  City
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    aria-invalid={!!errors.city}
                    aria-describedby={errors.city ? 'city-error' : undefined}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                  />
                </label>
                {errors.city && (
                  <div id="city-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.city}</div>
                )}
              </div>
              <div>
                <label>
                  Postal code
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    onBlur={() => handleBlur('postalCode')}
                    aria-invalid={!!errors.postalCode}
                    aria-describedby={errors.postalCode ? 'postal-error' : undefined}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                  />
                </label>
                {errors.postalCode && (
                  <div id="postal-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.postalCode}</div>
                )}
              </div>
            </div>
            <div>
              <label>
                Country
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  onBlur={() => handleBlur('country')}
                  aria-invalid={!!errors.country}
                  aria-describedby={errors.country ? 'country-error' : undefined}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
              {errors.country && (
                <div id="country-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.country}</div>
              )}
            </div>
            <div>
              <label>
                Preferred delivery date
                <input
                  type="date"
                  value={form.deliveryDate}
                  onChange={(e) => handleChange('deliveryDate', e.target.value)}
                  onBlur={() => handleBlur('deliveryDate')}
                  aria-invalid={!!errors.deliveryDate}
                  aria-describedby={errors.deliveryDate ? 'delivery-error' : undefined}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
              {errors.deliveryDate && (
                <div id="delivery-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.deliveryDate}</div>
              )}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Payment</h2>
          <div style={{ display: 'grid', gap: 8 }}>
            <div>
              <label>
                Card number
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.cardNumber}
                  onChange={(e) => handleChange('cardNumber', e.target.value)}
                  onBlur={() => handleBlur('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  aria-invalid={!!errors.cardNumber}
                  aria-describedby={errors.cardNumber ? 'card-error' : undefined}
                  style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                />
              </label>
              {errors.cardNumber && (
                <div id="card-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.cardNumber}</div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label>
                  Expiry (MM/YY)
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.expiry}
                    onChange={(e) => handleChange('expiry', e.target.value)}
                    onBlur={() => handleBlur('expiry')}
                    placeholder="08/28"
                    aria-invalid={!!errors.expiry}
                    aria-describedby={errors.expiry ? 'expiry-error' : undefined}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                  />
                </label>
                {errors.expiry && (
                  <div id="expiry-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.expiry}</div>
                )}
              </div>
              <div>
                <label>
                  CVC
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.cvc}
                    onChange={(e) => handleChange('cvc', e.target.value)}
                    onBlur={() => handleBlur('cvc')}
                    placeholder="123"
                    aria-invalid={!!errors.cvc}
                    aria-describedby={errors.cvc ? 'cvc-error' : undefined}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                  />
                </label>
                {errors.cvc && (
                  <div id="cvc-error" style={{ color: '#EF4444', fontSize: 12 }}>{errors.cvc}</div>
                )}
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={form.saveInfo}
                onChange={(e) => handleChange('saveInfo', e.target.checked)}
              />
              Save this information for next time
            </label>
          </div>
        </section>

        <section style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Order summary</h2>
          {cartItems.length === 0 ? (
            <p style={{ color: '#718096' }}>No items in your cart.</p>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.title}</div>
                    <div style={{ color: '#718096' }}>Qty {item.qty}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
              <hr style={{ border: 0, height: 1, background: '#E5E7EB', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </section>

        <button
          type="submit"
          disabled={disabled}
          style={{
            width: '100%',
            marginTop: 8,
            background: disabled ? '#A0AEC0' : '#10B981',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: 12,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </div>
  )
}


