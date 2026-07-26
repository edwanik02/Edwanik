'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { MonthlyStat } from '@/types'

export function SalesChart({ data }: { data: MonthlyStat[] }) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `₹${Number(v ?? 0) >= 1000 ? `${(Number(v) / 1000).toFixed(0)}k` : v}`} />
        <Tooltip formatter={(v: any) => [`₹${Number(v ?? 0).toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
        <Bar dataKey="revenue" fill="#FF6B35" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
