import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Order, ApiResponse } from '@/types'

async function apiFetch<T>(url: string, opts?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, opts)
  return res.json()
}

export function useMyOrders() {
  return useQuery({ queryKey: ['my-orders'], queryFn: async () => { const json = await apiFetch<Order[]>('/api/orders/my'); return json.data ?? [] }, staleTime: 2 * 60 * 1000 })
}

export function useAllOrders(filters: { ownerId?: string; status?: string; page?: number } = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)) })
  return useQuery({
    queryKey: ['all-orders', filters],
    queryFn: async () => { const json = await apiFetch<Order[]>(`/api/orders?${params}`); return { data: json.data ?? [], total: json.pagination?.total ?? 0 } },
    staleTime: 2 * 60 * 1000,
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const json = await apiFetch<Order>(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      if (!json.success) throw new Error(json.error)
      return json.data!
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['all-orders'] }); qc.invalidateQueries({ queryKey: ['my-orders'] }) },
  })
}
