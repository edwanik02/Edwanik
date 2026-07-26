import { create } from 'zustand'
import type { Notification, NotificationType } from '@/types'

interface NotifState {
  notifications: Notification[]
  unreadCount: number
  add: (n: { title: string; body: string; type: NotificationType; link?: string }) => void
  markRead: (id: string) => void
  markAllRead: () => void
  set: (notifications: Notification[]) => void
}

export const useNotifStore = create<NotifState>()((setState, get) => ({
  notifications: [],
  unreadCount: 0,
  add: (n) => {
    const notif: Notification = { ...n, id: `n${Date.now()}`, isRead: false, createdAt: new Date().toISOString() }
    setState((s) => ({ notifications: [notif, ...s.notifications], unreadCount: s.unreadCount + 1 }))
  },
  markRead: (id) => setState((s) => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, isRead: true } : n), unreadCount: Math.max(0, s.unreadCount - 1) })),
  markAllRead: () => setState((s) => ({ notifications: s.notifications.map(n => ({ ...n, isRead: true })), unreadCount: 0 })),
  set: (notifications) => setState({ notifications, unreadCount: notifications.filter(n => !n.isRead).length }),
}))
