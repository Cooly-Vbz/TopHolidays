export default function CustomerCare() {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Customer Care</h1>
      <p style={{ color: '#718096', marginBottom: 16 }}>We’re here to help with orders, returns, and account issues.</p>
      <div style={{ display: 'grid', gap: 12 }}>
        <div>
          <strong>Live Chat</strong>
          <div>Coming soon. For now, email us.</div>
        </div>
        <div>
          <strong>Email</strong>
          <div>support@topholidays.example</div>
        </div>
        <div>
          <strong>Phone</strong>
          <div>+1 (555) 123-4567</div>
        </div>
        <div>
          <strong>FAQ</strong>
          <div>Shipping, returns, payments, and warranty info.</div>
        </div>
      </div>
    </div>
  )
}