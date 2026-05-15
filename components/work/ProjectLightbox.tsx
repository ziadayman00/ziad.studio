'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type ProjectLightboxProps = {
  images: string[]
  title: string
  /** Project accent for hover / focus rings */
  accentColor?: string
}

export default function ProjectLightbox({ images, title, accentColor = 'var(--coral)' }: ProjectLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  const safeImages = useMemo(() => images.filter(Boolean), [images])
  const isOpen = openIndex !== null
  const current = openIndex === null ? null : safeImages[openIndex]

  const open = useCallback((idx: number) => setOpenIndex(idx), [])
  const close = useCallback(() => setOpenIndex(null), [])

  const prev = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return i
      return (i - 1 + safeImages.length) % safeImages.length
    })
  }, [safeImages.length])

  const next = useCallback(() => {
    setOpenIndex((i) => {
      if (i === null) return i
      return (i + 1) % safeImages.length
    })
  }, [safeImages.length])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    setTimeout(() => closeBtnRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [close, isOpen, next, prev])

  if (safeImages.length === 0) return null

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
        {safeImages.map((img, i) => (
          <button
            key={`${img}-${i}`}
            type="button"
            className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] text-left shadow-[0_12px_40px_rgba(12,12,18,0.05)] transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-[color-mix(in_srgb,var(--border-strong)_70%,var(--coral))] hover:shadow-[0_22px_60px_rgba(12,12,18,0.1)]"
            onClick={() => open(i)}
            aria-label={`Open image ${i + 1} of ${safeImages.length}`}
          >
            <div
              className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${accentColor} 22%, black) 100%)`,
              }}
            />
            <img
              src={img}
              alt={`${title} image ${i + 1}`}
              className="relative z-0 aspect-[4/3] w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 z-[1] intro-grain opacity-0 transition-opacity duration-500 group-hover:opacity-[0.18]" />
            <span className="absolute bottom-3 left-3 z-[3] rounded-full border border-white/25 bg-black/45 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-white/90 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
              Open
            </span>
          </button>
        ))}
      </div>

      {isOpen && current && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
          style={{
            background: 'color-mix(in srgb, var(--graphite) 78%, transparent)',
            backdropFilter: 'blur(12px) saturate(1.15)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.15)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 intro-grain opacity-[0.22]" />

          <div className="absolute left-5 right-5 top-5 z-10 flex items-center justify-between gap-4">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--inverse-muted)]">
              {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(safeImages.length).padStart(2, '0')}
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              className="rounded-full border border-[var(--inverse-border)] bg-[var(--inverse-surface)] px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--inverse-fg)] transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--coral)_45%,var(--inverse-border))] hover:text-[var(--coral)]"
            >
              Close
            </button>
          </div>

          <button
            type="button"
            onClick={prev}
            className="absolute left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--inverse-border)] bg-[var(--inverse-surface)] text-[var(--inverse-fg)] transition-colors duration-300 hover:border-[var(--coral)] hover:text-[var(--coral)] md:flex"
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            type="button"
            onClick={next}
            className="absolute right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--inverse-border)] bg-[var(--inverse-surface)] text-[var(--inverse-fg)] transition-colors duration-300 hover:border-[var(--coral)] hover:text-[var(--coral)] md:flex"
            aria-label="Next image"
          >
            →
          </button>

          <div
            className="relative z-[5] w-full max-w-6xl overflow-hidden rounded-[1.35rem] border border-[var(--inverse-border-strong)] bg-[var(--inverse-glass)]"
            style={{
              boxShadow: `0 40px 120px rgba(0,0,0,0.45), 0 0 0 1px color-mix(in srgb, ${accentColor} 25%, transparent)`,
            }}
          >
            <img
              src={current}
              alt={`${title} full image ${(openIndex ?? 0) + 1}`}
              className="max-h-[78vh] w-full object-contain"
              draggable={false}
            />
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={prev}
              className="rounded-full border border-[var(--inverse-border)] bg-[var(--inverse-surface)] px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--inverse-fg)]"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={next}
              className="rounded-full border border-[var(--inverse-border)] bg-[var(--inverse-surface)] px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--inverse-fg)]"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}
