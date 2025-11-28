import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../contexts/NotificationsContext'
import { useTheme } from '../components/ThemeProvider'
import { getThemeColors } from '../lib/theme-colors'

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, clearNotification, markAllAsRead, clearAll, addNotification } = useNotifications()
  const { theme } = useTheme()
  const colors = getThemeColors(theme)

  const addSamples = () => {
    addNotification({ title: 'Order Shipped', message: 'Your order #1234 is on the way!', type: 'success', actionUrl: '/orders' })
    addNotification({ title: 'Limited Offer', message: 'Holiday sale ends tonight. Grab your favorites!', type: 'info', actionUrl: '/products' })
    addNotification({ title: 'Payment Issue', message: 'We could not process your last payment.', type: 'warning', actionUrl: '/orders' })
  }

  const typeColor = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success': return '#10B981'
      case 'warning': return '#F59E0B'
      case 'error': return '#EF4444'
      default: return '#3B82F6'
    }
  }

  return (
    <div style={{ padding: 16, color: colors.text.primary }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Notifications</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={addSamples} style={{ padding: '8px 12px', borderRadius: 8, border: `1px dashed ${colors.border.default}`, background: 'transparent', color: colors.text.secondary, cursor: 'pointer' }}>Add samples</button>
          <button onClick={markAllAsRead} disabled={unreadCount === 0} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border.light}`, background: colors.bg.secondary, color: colors.text.primary, cursor: unreadCount === 0 ? 'not-allowed' : 'pointer', opacity: unreadCount === 0 ? 0.6 : 1 }}>Mark all read</button>
          <button onClick={clearAll} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border.default}`, background: 'transparent', color: '#EF4444', cursor: 'pointer' }}>Clear all</button>
        </div>
      </header>
      {notifications.length === 0 ? (
        <div style={{ padding: 16, borderRadius: 8, border: `1px dashed ${colors.border.default}`, color: colors.text.secondary }}>No notifications yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
          {notifications.map(n => (
            <li key={n.id} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center', padding: 12, borderRadius: 10, border: `1px solid ${colors.border.default}`, background: theme === 'dark' ? 'rgba(2,6,23,0.6)' : '#FFFFFF', boxShadow: theme === 'dark' ? '0 1px 2px rgba(0,0,0,0.35)' : '0 1px 2px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 9999, background: typeColor(n.type) }} />
              <div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <strong style={{ fontSize: 15 }}>{n.title}</strong>
                  {!n.read && <span style={{ fontSize: 12, color: typeColor(n.type) }}>• Unread</span>}
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: colors.text.tertiary }}>{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <div style={{ fontSize: 14, color: colors.text.secondary }}>{n.message}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {n.actionUrl && (
                  <button onClick={() => navigate(n.actionUrl!)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${colors.border.light}`, background: colors.bg.secondary, color: colors.text.primary, cursor: 'pointer' }}>Open</button>
                )}
                {!n.read && (
                  <button onClick={() => markAsRead(n.id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${colors.border.light}`, background: 'transparent', color: colors.text.primary, cursor: 'pointer' }}>Mark read</button>
                )}
                <button onClick={() => clearNotification(n.id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${colors.border.default}`, background: 'transparent', color: '#EF4444', cursor: 'pointer' }}>Dismiss</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}