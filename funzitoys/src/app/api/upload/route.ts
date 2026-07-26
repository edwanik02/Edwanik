import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 })
    const bytes = await file.arrayBuffer()
    const base64 = `data:${file.type};base64,${Buffer.from(bytes).toString('base64')}`
    const folder = `${user.role.toLowerCase()}/${user.id}`
    const result = await uploadImage(base64, folder)
    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    console.error('[UPLOAD]', e)
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
  }
}
