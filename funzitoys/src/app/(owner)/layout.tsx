import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

export const dynamic = 'force-dynamic'

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="ml-56 flex-1 min-h-screen">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
