import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotifStore } from '../store/notifStore'
import type { Notification } from '@/types'

export function useNotifications() {
  const { set, markRead, markAllRead, notifications, unreadCount } = useNotifStore()
  const qc = useQueryClient()
  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => { const res = await fetch('/api/notifications'); const json = await res.json(); const notifs: Notification[] = json.data ?? []; set(notifs); return notifs },
    staleTime: 30 * 1000, refetchInterval: 60 * 1000,
  })
  const readMut = useMutation({
    mutationFn: async (ids?: string[]) => { await fetch('/api/notifications', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }) },
    onSuccess: (_, ids) => { if (ids) ids.forEach(markRead); else markAllRead(); qc.invalidateQueries({ queryKey: ['notifications'] }) },
  })
  return { notifications, unreadCount, isLoading: query.isLoading, markOneRead: (id: string) => readMut.mutate([id]), markAllAsRead: () => readMut.mutate(undefined) }
}
