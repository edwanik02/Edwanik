import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/components/providers/AppProviders'

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'FunziToys – Fun For Everyone', template: '%s | FunziToys' },
  description: 'Safe, fun & educational toys for every age. Shop 500+ premium toys trusted by 10,000+ families.',
  keywords: ['toys', 'educational toys', 'kids toys', 'online toy store', 'FunziToys'],
  openGraph: { type: 'website', locale: 'en_IN', siteName: 'FunziToys' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
