import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let reqCount = 0
  try {
    reqCount = await prisma.ownerRequest.count({ where: { status: 'PENDING' } })
  } catch (err) {
    console.error('Failed to query pending requests count:', err)
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar reqCount={reqCount} />
      <div className="ml-56 flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
