'use client'
import { useNotifications } from '@/features/notifications/hooks/useNotifications'
import { formatRelativeTime } from '@/utils'
import { Bell, CheckCheck } from 'lucide-react'

const TYPE_COLORS: Record<string, string> = { ORDER: 'bg-green-100 text-green-700', PRODUCT: 'bg-blue-100 text-blue-700', CUSTOMER: 'bg-purple-100 text-purple-700', SYSTEM: 'bg-slate-100 text-slate-600', PAYMENT: 'bg-yellow-100 text-yellow-700', ALERT: 'bg-red-100 text-red-700' }

export default function AdminNotificationsPage() {
  const { notifications, unreadCount, isLoading, markOneRead, markAllAsRead } = useNotifications()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3"><Bell className="w-6 h-6 text-brand" /><h1 className="font-serif text-2xl font-bold">Notifications</h1>{unreadCount > 0 && <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full">{unreadCount} unread</span>}</div>
        {unreadCount > 0 && <button onClick={markAllAsRead} className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:underline"><CheckCheck className="w-4 h-4" />Mark all as read</button>}
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3 animate-pulse">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 text-slate-400"><Bell className="w-12 h-12 mx-auto mb-3 text-slate-200" /><p className="font-semibold">No notifications yet</p></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(n => (
              <button key={n.id} onClick={() => !n.isRead && markOneRead(n.id)} className={`w-full text-left p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-orange-50/40' : ''}`}>
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${TYPE_COLORS[n.type] ?? 'bg-slate-100 text-slate-600'}`}>{n.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{n.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{n.body}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
                {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1.5" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
