'use client'
import { useState } from 'react'
import { ImageUpload } from '@/components/common/ImageUpload'
import { Check } from 'lucide-react'

export default function OwnerBrandingPage() {
  const [logoUrls, setLogoUrls] = useState<string[]>([])
  const [bannerUrls, setBannerUrls] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  return (
    <div className="max-w-3xl space-y-6">
      <div><h1 className="font-serif text-2xl font-bold">🖼️ Branding</h1><p className="text-sm text-slate-500">Upload your logo and banners from gallery or desktop</p></div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold mb-1">Brand Logo</h3>
          <p className="text-sm text-slate-500 mb-4">Upload your official brand logo. PNG/JPG, square format recommended. Max 5MB.</p>
          <ImageUpload value={logoUrls} onChange={(urls) => setLogoUrls(urls)} maxFiles={1} label="Upload Brand Logo" />
          {logoUrls.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-sm text-green-700">
              <Check className="w-4 h-4 flex-shrink-0" /> Logo uploaded — will be applied across your store
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold mb-1">Hero Banner</h3>
          <p className="text-sm text-slate-500 mb-4">Homepage hero image. Landscape format, 800×400px recommended. Max 5MB.</p>
          <ImageUpload value={bannerUrls} onChange={(urls) => setBannerUrls(urls)} maxFiles={1} label="Upload Hero Banner" />
          {bannerUrls.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-sm text-green-700">
              <Check className="w-4 h-4 flex-shrink-0" /> Banner uploaded — will appear on homepage
            </div>
          )}
        </div>

        {saved && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2"><Check className="w-4 h-4" />Branding saved successfully!</div>}
        <button onClick={handleSave} className="w-full py-3 rounded-full bg-brand text-white font-bold hover:bg-[var(--pd)] transition-colors">Save Branding</button>
      </div>
    </div>
  )
}
