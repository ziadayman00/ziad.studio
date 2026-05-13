import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

import { getAdminSession } from '@/lib/auth/admin-session'
import { ALLOWED_IMAGE_MIME, MAX_IMAGE_BYTES, PORTFOLIO_MEDIA_BUCKET } from '@/lib/admin/upload-constants'

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  if (mime === 'image/avif') return 'avif'
  return 'bin'
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const raw = formData.getAll('files')
  const files: File[] = []
  for (const entry of raw) {
    if (entry instanceof File && entry.size > 0) files.push(entry)
  }

  if (files.length === 0) {
    return NextResponse.json({ error: 'No image files received.' }, { status: 400 })
  }

  const urls: string[] = []
  const errors: string[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const useSupabase = Boolean(supabaseUrl && serviceKey)

  const supabase = useSupabase
    ? createClient(supabaseUrl!, serviceKey!, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null

  for (const file of files) {
    if (!ALLOWED_IMAGE_MIME.has(file.type)) {
      errors.push(`${file.name}: unsupported type (${file.type || 'unknown'})`)
      continue
    }
    if (file.size > MAX_IMAGE_BYTES) {
      errors.push(`${file.name}: file too large (max ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB)`)
      continue
    }

    const buf = Buffer.from(await file.arrayBuffer())
    const ext = extFromMime(file.type)
    const key = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`

    try {
      if (supabase) {
        const objectPath = `portfolio/${key}`
        const { error: upErr } = await supabase.storage
          .from(PORTFOLIO_MEDIA_BUCKET)
          .upload(objectPath, buf, { contentType: file.type, upsert: false })

        if (upErr) {
          errors.push(`${file.name}: ${upErr.message}`)
          continue
        }

        const { data } = supabase.storage.from(PORTFOLIO_MEDIA_BUCKET).getPublicUrl(objectPath)
        urls.push(data.publicUrl)
      } else {
        const relDir = join('public', 'uploads', 'portfolio')
        const absDir = join(process.cwd(), relDir)
        await mkdir(absDir, { recursive: true })
        const diskName = key
        await writeFile(join(absDir, diskName), buf)
        urls.push(`/uploads/portfolio/${diskName}`)
      }
    } catch (e) {
      errors.push(`${file.name}: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  if (urls.length === 0 && errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 400 })
  }

  return NextResponse.json({ urls, errors: errors.length ? errors : undefined })
}
