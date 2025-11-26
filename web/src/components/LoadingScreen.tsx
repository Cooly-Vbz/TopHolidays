export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'grid', placeItems: 'center',
      background: 'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)',
      animation: 'gradient 3s linear infinite'
    }}>
      <div style={{ textAlign: 'center', color: '#fff' }}>
        <div style={{ fontFamily: 'Pacifico, cursive', fontSize: 32, marginBottom: 16 }}>Top Holidays</div>
        <div style={{ width: 48, height: 48, borderRadius: 9999, border: '4px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', margin: '0 auto', animation: 'spin 1s linear infinite' }} />
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes gradient { 0% { filter: hue-rotate(0deg) } 100% { filter: hue-rotate(360deg) } }
      `}</style>
    </div>
  )
}