import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const reqCount = await prisma.ownerRequest.count({ where: { status: 'PENDING' } })
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar reqCount={reqCount} />
      <div className="ml-56 flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
