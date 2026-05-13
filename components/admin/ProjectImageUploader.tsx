'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

function splitImageLines(s: string) {
  return s
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
}

type Props = {
  /** Newline-separated image URLs/paths (submitted with the form). */
  initialValue: string
}

export default function ProjectImageUploader({ initialValue }: Props) {
  const [urls, setUrls] = useState<string[]>(() => splitImageLines(initialValue))
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUrls(splitImageLines(initialValue))
  }, [initialValue])

  const uploadFiles = useCallback(async (fileList: File[]) => {
    const images = fileList.filter((f) => f.type.startsWith('image/'))
    if (images.length === 0) {
      setMessage('Choose image files only (JPEG, PNG, WebP, GIF, AVIF).')
      return
    }

    setBusy(true)
    setMessage(null)

    const fd = new FormData()
    for (const f of images) {
      fd.append('files', f, f.name)
    }

    try {
      const res = await fetch('/api/admin/upload-images', {
        method: 'POST',
        body: fd,
      })
      const data = (await res.json()) as { urls?: string[]; error?: string; errors?: string[] }

      if (!res.ok) {
        setMessage(data.error ?? 'Upload failed.')
        return
      }

      if (data.urls?.length) {
        setUrls((prev) => [...prev, ...data.urls!])
      }
      if (data.errors?.length) {
        setMessage(data.errors.join(' '))
      } else if (data.urls?.length) {
        setMessage(null)
      }
    } catch {
      setMessage('Network error while uploading.')
    } finally {
      setBusy(false)
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const files = Array.from(e.dataTransfer.files || [])
      void uploadFiles(files)
    },
    [uploadFiles]
  )

  const onPick = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      e.target.value = ''
      void uploadFiles(files)
    },
    [uploadFiles]
  )

  const move = (from: number, to: number) => {
    setUrls((prev) => {
      if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev
      const next = [...prev]
      const [row] = next.splice(from, 1)
      next.splice(to, 0, row)
      return next
    })
  }

  const removeAt = (i: number) => {
    setUrls((prev) => prev.filter((_, idx) => idx !== i))
  }

  const fieldShell =
    'rounded-2xl border border-dashed px-4 py-8 text-center transition-[border-color,background-color] duration-300'

  return (
    <div className="space-y-4">
      <input type="hidden" name="images" value={urls.join('\n')} readOnly aria-hidden />

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (e.currentTarget === e.target) setDragOver(false)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          e.dataTransfer.dropEffect = 'copy'
        }}
        onDrop={onDrop}
        className={`${fieldShell} cursor-pointer select-none ${
          dragOver ? 'border-[var(--coral)] bg-[var(--coral)]/10' : 'border-white/18 bg-black/20 hover:border-white/28'
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="sr-only"
          onChange={onPick}
          disabled={busy}
        />
        <p className="font-sans text-sm text-white/80">
          {busy ? 'Uploading…' : 'Drop images here or click to browse'}
        </p>
        <p className="mt-2 font-sans text-xs text-white/40">Several files at once · JPEG, PNG, WebP, GIF, AVIF · max 12 MB each</p>
        <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.16em] text-[var(--coral)]">First image = hero</p>
      </div>

      {message ? <p className="font-sans text-sm text-amber-200/90">{message}</p> : null}

      {urls.length > 0 ? (
        <ul className="space-y-2">
          {urls.map((url, i) => (
            <li
              key={`${url}-${i}`}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex === null || dragIndex === i) {
                  setDragIndex(null)
                  return
                }
                move(dragIndex, i)
                setDragIndex(null)
              }}
              onDragEnd={() => setDragIndex(null)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 p-2 pr-3"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element -- dynamic admin preview URLs */}
                <img src={url} alt="" className="size-full object-cover" loading="lazy" />
                {i === 0 ? (
                  <span className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 text-center font-sans text-[9px] uppercase tracking-wider text-white">
                    Hero
                  </span>
                ) : null}
              </div>
              <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-white/50" title={url}>
                {url}
              </p>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                  className="rounded-lg border border-white/15 px-2 py-1 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === urls.length - 1}
                  onClick={() => move(i, i + 1)}
                  className="rounded-lg border border-white/15 px-2 py-1 text-xs text-white/70 hover:bg-white/10 disabled:opacity-30"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="rounded-lg border border-red-400/30 px-2 py-1 text-xs text-red-200/90 hover:bg-red-500/15"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-sans text-xs text-white/35">No images yet — upload at least one for the gallery and hero.</p>
      )}
    </div>
  )
}
