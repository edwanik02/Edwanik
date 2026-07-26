import { LucideIcon } from 'lucide-react'
const colors = {
  primary: { bar: 'bg-brand', val: 'text-brand' }, green: { bar: 'bg-emerald-500', val: 'text-emerald-600' },
  blue: { bar: 'bg-blue-500', val: 'text-blue-600' }, yellow: { bar: 'bg-amber-500', val: 'text-amber-600' }, purple: { bar: 'bg-violet-500', val: 'text-violet-600' },
}
interface Props { title: string; value: string | number; delta?: string; deltaType?: 'up' | 'down'; icon?: LucideIcon; color?: keyof typeof colors }

export function StatCard({ title, value, delta, deltaType = 'up', icon: Icon, color = 'primary' }: Props) {
  const c = colors[color]
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />
      <div className="flex items-start justify-between mt-1">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{title}</p>
          <p className={`text-3xl font-bold font-serif mt-1 ${c.val}`}>{value}</p>
          {delta && <span className={`inline-flex items-center gap-1 text-xs font-bold mt-2 px-2 py-0.5 rounded-full ${deltaType === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{deltaType === 'up' ? '↑' : '↓'} {delta}</span>}
        </div>
        {Icon && <div className={`w-10 h-10 rounded-xl flex items-center justify-center opacity-10 ${c.bar}`}><Icon className="w-5 h-5 text-white" /></div>}
      </div>
    </div>
  )
}
