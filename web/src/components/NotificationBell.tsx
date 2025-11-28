import { useTheme } from './ThemeProvider'
import { useNotifications } from '../contexts/NotificationsContext'

export default function NotificationBell({ onClick }: { onClick?: () => void }) {
  const { theme } = useTheme()
  const { unreadCount } = useNotifications()
  const isDark = theme === 'dark'
  const bg = isDark ? '#1E293B' : '#F7FAFC'
  const color = isDark ? '#E5E7EB' : '#2D3748'

  return (
    <button
      onClick={onClick}
      aria-label="Notifications"
      style={{ position: 'relative', width: 40, height: 40, borderRadius: 20, border: 'none', cursor: 'pointer', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseOver={(e) => e.currentTarget.style.background = isDark ? '#334155' : '#EDF2F7'}
      onMouseOut={(e) => e.currentTarget.style.background = bg}
    >
      {/* Simple bell glyph */}
      <span style={{ fontSize: 18 }}>🔔</span>
      {unreadCount > 0 && (
        <span style={{ position: 'absolute', top: -4, right: -4, background: '#EF4444', color: '#fff', borderRadius: 9999, padding: '2px 6px', fontSize: 12 }}>
          {unreadCount}
        </span>
      )}
    </button>
  )
}