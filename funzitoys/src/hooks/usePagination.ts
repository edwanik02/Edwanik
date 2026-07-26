import { useState, useMemo } from 'react'
interface Options { total: number; limit?: number; initialPage?: number }
export function usePagination({ total, limit = 20, initialPage = 1 }: Options) {
  const [page, setPage] = useState(initialPage)
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit])
  const canPrev = page > 1
  const canNext = page < totalPages
  const skip = (page - 1) * limit
  const prev = () => setPage(p => (p > 1 ? p - 1 : p))
  const next = () => setPage(p => (p < totalPages ? p + 1 : p))
  const goTo = (target: number) => { if (target >= 1 && target <= totalPages) setPage(target) }
  return { page, totalPages, canPrev, canNext, prev, next, goTo, skip, limit }
}
