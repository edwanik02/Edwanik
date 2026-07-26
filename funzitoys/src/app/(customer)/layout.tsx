import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  let settings = null
  try {
    settings = await prisma.siteSettings.findFirst()
  } catch (err) {
    console.error('Failed to fetch site settings:', err)
  }
  return (
    <>
      <Navbar siteName={settings?.siteName ?? 'FunziToys'} logoUrl={settings?.logoUrl ?? undefined} />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer settings={settings ? { id: settings.id, siteName: settings.siteName, tagline: settings.tagline ?? undefined, logoUrl: settings.logoUrl ?? undefined, primaryColor: settings.primaryColor, whatsappNum: settings.whatsappNum ?? undefined, supportEmail: settings.supportEmail ?? undefined } : null} />
    </>
  )
}
