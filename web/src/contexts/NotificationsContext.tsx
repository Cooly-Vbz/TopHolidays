import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export type Notification = {
  id: string
  title: string
  message: string
  type: NotificationType
  createdAt: number
  read: boolean
  actionUrl?: string
}

export type NotificationsContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  clearNotification: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  requestPermission: () => Promise<NotificationPermission>
}

const STORAGE_KEY = 'app:notifications'

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

function loadFromStorage(): Notification[] {
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

function saveToStorage(list: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => loadFromStorage())

  useEffect(() => {
    saveToStorage(notifications)
  }, [notifications])

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  const showBrowserNotification = (n: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(n.title, { body: n.message })
      } catch {}
    }
  }

  const addNotification: NotificationsContextType['addNotification'] = (n) => {
    const full: Notification = {
      id: crypto.randomUUID(),
      title: n.title,
      message: n.message,
      type: n.type,
      actionUrl: n.actionUrl,
      createdAt: Date.now(),
      read: false,
    }
    setNotifications(prev => [full, ...prev])
    showBrowserNotification(full)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const requestPermission = async () => {
    if (!('Notification' in window)) return 'denied'
    if (Notification.permission !== 'granted') {
      try {
        return await Notification.requestPermission()
      } catch {
        return Notification.permission
      }
    }
    return Notification.permission
  }

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearNotification,
    markAllAsRead,
    clearAll,
    requestPermission,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications(): NotificationsContextType {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}