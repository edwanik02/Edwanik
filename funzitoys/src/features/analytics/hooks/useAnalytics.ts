import { useQuery } from '@tanstack/react-query'
import type { AnalyticsSummary } from '@/types'

async function fetchOwnerAnalytics(): Promise<AnalyticsSummary> { const res = await fetch('/api/owner/analytics'); const json = await res.json(); return json.data }
async function fetchAdminAnalytics(): Promise<AnalyticsSummary> { const res = await fetch('/api/admin/analytics'); const json = await res.json(); return json.data }

export function useOwnerAnalytics() { return useQuery({ queryKey: ['owner-analytics'], queryFn: fetchOwnerAnalytics, staleTime: 5 * 60 * 1000 }) }
export function useAdminAnalytics() { return useQuery({ queryKey: ['admin-analytics'], queryFn: fetchAdminAnalytics, staleTime: 5 * 60 * 1000 }) }
