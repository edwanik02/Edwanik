import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Product, ApiResponse } from '@/types'

interface Filters { page?: number; limit?: number; search?: string; category?: string; categoryId?: string; ownerId?: string; sortBy?: string; sortOrder?: string }

async function apiFetch<T>(url: string, opts?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(url, opts)
  return res.json()
}

export function useProducts(filters: Filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => { if (v !== undefined) params.set(k, String(v)) })
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const json = await apiFetch<Product[]>(`/api/products?${params}`)
      return { data: json.data ?? [], total: json.pagination?.total ?? 0, totalPages: json.pagination?.totalPages ?? 1 }
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => { const json = await apiFetch<Product>(`/api/products/${slug}`); return json.data ?? null },
    enabled: !!slug, staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (dto: Record<string, unknown>) => {
      const json = await apiFetch<Product>('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
      if (!json.success) throw new Error(json.error)
      return json.data!
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, dto }: { id: string; dto: Record<string, unknown> }) => {
      const json = await apiFetch<Product>(`/api/products/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dto) })
      if (!json.success) throw new Error(json.error)
      return json.data!
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['product'] }) },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => { const json = await apiFetch(`/api/products/${id}`, { method: 'DELETE' }); if (!json.success) throw new Error(json.error) },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}
