export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}
export function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
export function formatRelativeTime(d: string | Date): string {
  const diff = Date.now() - new Date(d).getTime()
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}
export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
export function generateOrderNumber(): string {
  return `ORD${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
}
export function buildWhatsAppURL(waNumber: string, message: string): string {
  const num = waNumber.replace(/\D/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}
export function buildOrderWhatsAppMessage(items: Array<{ name: string; qty: number; price: number }>, total: number, customerName?: string): string {
  const lines = items.map(i => `• ${i.name} ×${i.qty} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('\n')
  return `Hi FunziToys! I'd like to order:\n\n${lines}\n\nTotal: ₹${total.toLocaleString('en-IN')}${customerName ? `\nCustomer: ${customerName}` : ''}\n\nPlease confirm availability & delivery. Thank you!`
}
