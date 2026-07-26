import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface Props { products: Product[]; className?: string; emptyMessage?: string }

export function ProductGrid({ products, className = '', emptyMessage = 'No products found' }: Props) {
  if (!products.length) return <div className="text-center py-16 text-slate-400"><div className="text-5xl mb-3">🔍</div><p className="font-semibold">{emptyMessage}</p></div>
  return <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 ${className}`}>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
}
