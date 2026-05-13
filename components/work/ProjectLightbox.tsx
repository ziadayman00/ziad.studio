'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type ProjectLightboxProps = {
  images: string[]
  title: string
}

export default function ProjectLightbox({ images, title }: ProjectLightboxProps) {
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

    // focus close button for quick escape
    setTimeout(() => closeBtnRef.current?.focus(), 0)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [close, isOpen, next, prev])

  if (safeImages.length === 0) return null

  return (
    <>
      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {safeImages.map((img, i) => (
          <button
            key={`${img}-${i}`}
            type="button"
            className="group rounded-3xl overflow-hidden border cin-hoverlift text-left"
            style={{ borderColor: 'var(--border)', background: 'var(--surface-secondary)' }}
            onClick={() => open(i)}
            aria-label={`Open image ${i + 1} of ${safeImages.length}`}
          >
            <img
              src={img}
              alt={`${title} image ${i + 1}`}
              className="w-full h-[260px] md:h-[300px] object-cover object-top"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.18) 100%)',
                opacity: 0,
                transition: 'opacity 0.6s var(--ease-out-expo)',
              }}
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && current && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-10"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onMouseDown={(e) => {
            // close only when clicking backdrop
            if (e.target === e.currentTarget) close()
          }}
          style={{
            background: 'rgba(17,17,20,0.82)',
            backdropFilter: 'blur(18px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
          }}
        >
          <div className="absolute inset-0 intro-grain" style={{ opacity: 0.25 }} />

          {/* Controls */}
          <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-4">
            <div className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {String((openIndex ?? 0) + 1).padStart(2, '0')} / {String(safeImages.length).padStart(2, '0')}
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={close}
              className="px-4 py-2 rounded-full border font-sans text-xs tracking-widest uppercase"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.04)' }}
            >
              Close
            </button>
          </div>

          <button
            type="button"
            onClick={prev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full border"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'white', background: 'rgba(255,255,255,0.05)' }}
            aria-label="Previous image"
          >
            ←
          </button>

          <button
            type="button"
            onClick={next}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center w-11 h-11 rounded-full border"
            style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'white', background: 'rgba(255,255,255,0.05)' }}
            aria-label="Next image"
          >
            →
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-6xl"
            style={{
              borderRadius: 28,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 40px 160px rgba(0,0,0,0.55)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <img
              src={current}
              alt={`${title} full image ${(openIndex ?? 0) + 1}`}
              className="w-full max-h-[78vh] object-contain"
              draggable={false}
            />
          </div>

          {/* Mobile hint */}
          <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="px-4 py-2 rounded-full border font-sans text-xs tracking-widest uppercase"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.04)' }}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={next}
              className="px-4 py-2 rounded-full border font-sans text-xs tracking-widest uppercase"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.04)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}

