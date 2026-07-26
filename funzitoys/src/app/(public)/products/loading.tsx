export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-16">
      <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse mb-2" />
      <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array(10).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-slate-100 animate-pulse aspect-[4/5]" />)}
      </div>
    </div>
  )
}
