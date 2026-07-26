'use client'
import { useCallback, useState } from 'react'
import Image from 'next/image'
import { X, Upload } from 'lucide-react'

interface Props { value?: string[]; onChange: (urls: string[], publicIds: string[]) => void; maxFiles?: number; label?: string }

export function ImageUpload({ value = [], onChange, maxFiles = 4, label = 'Upload Images' }: Props) {
  const [uploading, setUploading] = useState(false)
  const [pids, setPids] = useState<string[]>([])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files) return
    setUploading(true)
    const newUrls: string[] = []
    const newPids: string[] = []
    const allowed = Math.min(files.length, maxFiles - value.length)
    for (let i = 0; i < allowed; i++) {
      const fd = new FormData(); fd.append('file', files[i])
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) { newUrls.push(data.data.url); newPids.push(data.data.publicId) }
    }
    onChange([...value, ...newUrls], [...pids, ...newPids])
    setPids(p => [...p, ...newPids])
    setUploading(false)
  }, [value, onChange, maxFiles, pids])

  const remove = (i: number) => { onChange(value.filter((_, idx) => idx !== i), pids.filter((_, idx) => idx !== i)); setPids(p => p.filter((_, idx) => idx !== i)) }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</label>
      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {value.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-slate-200">
              <Image src={url} alt={`img-${i}`} fill className="object-cover" />
              <button onClick={() => remove(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
      {value.length < maxFiles && (
        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-brand hover:bg-orange-50 transition-all">
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} disabled={uploading} />
          <Upload className="w-7 h-7 text-slate-400" />
          <p className="text-sm text-slate-500">{uploading ? 'Uploading…' : 'Click or tap to upload from gallery'}</p>
          <p className="text-xs text-brand font-semibold">PNG, JPG · Max {maxFiles} images · 5MB each</p>
        </label>
      )}
    </div>
  )
}
