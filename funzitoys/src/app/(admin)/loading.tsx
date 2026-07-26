export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">{Array(6).fill(0).map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
      <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
    </div>
  )
}
