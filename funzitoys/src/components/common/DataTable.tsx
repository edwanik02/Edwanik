import { ReactNode } from 'react'
interface Column<T> { key: string; label: string; render?: (row: T) => ReactNode; className?: string }
interface Props<T> { columns: Column<T>[]; data: T[]; keyField: keyof T; emptyMessage?: string; isLoading?: boolean }

export function DataTable<T>({ columns, data, keyField, emptyMessage = 'No data found', isLoading }: Props<T>) {
  if (isLoading) return <div className="animate-pulse space-y-2 p-4">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-xl" />)}</div>
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead><tr className="bg-slate-50">{columns.map(c => <th key={c.key} className={`text-left py-2.5 px-4 text-xs font-bold text-slate-500 uppercase tracking-wide border-b border-slate-200 whitespace-nowrap ${c.className ?? ''}`}>{c.label}</th>)}</tr></thead>
        <tbody>
          {!data.length ? <tr><td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">{emptyMessage}</td></tr>
            : data.map(row => (
              <tr key={String(row[keyField])} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {columns.map(c => <td key={c.key} className={`py-3 px-4 text-sm text-slate-700 ${c.className ?? ''}`}>{c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
