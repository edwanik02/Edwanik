export default function OwnerLoading() {
  return (
    <div className="space-y-6">
      <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">{Array(4).fill(0).map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
      <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
    </div>
  )
}
