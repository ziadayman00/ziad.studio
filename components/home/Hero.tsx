'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { useInView } from '@/hooks/useInView'

export default function Hero() {
  const blobRef = useRef<HTMLDivElement>(null)
  const [entered, setEntered] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const { onMove: onMagneticMove, onLeave: onMagneticLeave } = useMagnetic({ strength: 12 })
  const { ref: inViewRef, inView } = useInView<HTMLElement>({ threshold: 0.25, rootMargin: '0px 0px -25% 0px', once: false })

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 90)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loaded) return
    const timer = setTimeout(() => setEntered(true), 120)
    return () => clearTimeout(timer)
  }, [loaded])

  // Cursor-reactive orb: runs only while hero is in-view
  useEffect(() => {
    if (!inView) return
    let animationId: number
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 28
      targetY = (e.clientY / window.innerHeight - 0.5) * 28
    }

    const animate = () => {
      currentX += (targetX - currentX) * 0.06
      currentY += (targetY - currentY) * 0.06
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`
      }
      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animationId)
    }
  }, [inView])

  const handleMagnetic = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => onMagneticMove(e), [onMagneticMove])
  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => onMagneticLeave(e), [onMagneticLeave])

  return (
    <section
      ref={inViewRef}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden"
    >
      {/* Atmospheric field */}
      <div
        ref={blobRef}
        className="absolute right-[-8%] top-1/2 pointer-events-none select-none"
        style={{
          transform: 'translate(-50%, -50%)',
          width: 'min(72vw, 920px)',
          height: 'min(86vh, 840px)',
          transition: 'none',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            background: 'linear-gradient(130deg, rgba(255,122,89,0.18) 0%, rgba(110,168,254,0.14) 48%, transparent 100%)',
            filter: 'blur(76px)',
            animation: inView ? 'morphBlob 10s ease-in-out infinite, breathe 8s ease-in-out infinite' : 'none',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 2s ease',
          }}
        />
        <div
          className="absolute bottom-[8%] right-[6%] w-[48%] h-[48%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(110,168,254,0.24) 0%, transparent 72%)',
            filter: 'blur(58px)',
            animation: inView ? 'morphBlob 8s ease-in-out infinite reverse, floatSubtle 7s ease-in-out infinite' : 'none',
            opacity: loaded ? 0.84 : 0,
            transition: 'opacity 2.5s ease 0.3s',
          }}
        />
        <div
          className="absolute bottom-[30%] left-[8%] w-[30%] h-[30%] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,122,89,0.3) 0%, transparent 72%)',
            filter: 'blur(44px)',
            animation: inView ? 'float 5s ease-in-out infinite' : 'none',
            opacity: loaded ? 0.75 : 0,
            transition: 'opacity 2s ease 0.5s',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full pt-28 pb-16 md:pb-20 relative z-10 min-w-0">
        {/* Top status */}
        <div
          className="inline-flex items-center gap-2 mb-8 md:mb-10 border rounded-full px-4 py-1.5"
          style={{
            borderColor: 'var(--border-strong)',
            background: 'var(--surface)',
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s var(--ease-out-expo) 0.2s',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--coral)', animation: 'pulseDot 2s ease-in-out infinite' }}
          />
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
            Independent creative studio
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-end">
          <div className="xl:col-span-8 min-w-0">
            <h1
              className="font-display font-black leading-[0.92] tracking-[-0.035em]"
              style={{
                fontSize: 'clamp(2.8rem, 8vw, 8.3rem)',
                color: 'var(--foreground)',
                opacity: entered ? 1 : 0,
                transform: entered ? 'translateY(0)' : 'translateY(34px)',
                transition: 'opacity 1s var(--ease-out-expo) 0.22s, transform 1s var(--ease-out-expo) 0.22s',
              }}
            >
              Digital scenes
              <br />
              built to
              <span style={{ color: 'var(--coral)' }}> stay with you</span>.
            </h1>
          </div>

          <div
            className="xl:col-span-4 min-w-0"
            style={{
              opacity: entered ? 1 : 0,
              transform: entered ? 'translateY(0)' : 'translateY(28px)',
              transition: 'opacity 1s var(--ease-out-expo) 0.34s, transform 1s var(--ease-out-expo) 0.34s',
            }}
          >
            <div
              className="rounded-3xl border p-6 md:p-7"
              style={{
                borderColor: 'var(--border)',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.66) 100%)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                  Studio note
                </span>
                <img src="/light-logo.png" alt="" aria-hidden="true" style={{ height: 26, width: 'auto', opacity: 0.95 }} />
              </div>
              <p className="font-sans text-sm md:text-base leading-relaxed mt-4" style={{ color: 'var(--lavender)' }}>
                Calm interfaces, cinematic pacing, and interactions that feel intentional from the first second.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Cinematic', 'Minimal', 'Intentional'].map((tag) => (
                  <span
                    key={tag}
                    className="font-sans text-[11px] tracking-widest uppercase rounded-full px-3 py-1 border"
                    style={{ borderColor: 'var(--border)', color: 'var(--lavender)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 md:mt-12 flex flex-wrap items-center gap-3 md:gap-4"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.95s var(--ease-out-expo) 0.45s, transform 0.95s var(--ease-out-expo) 0.45s',
          }}
        >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-display font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 active:scale-95"
              style={{
                background: 'var(--coral)',
                color: 'white',
                boxShadow: '0 4px 24px rgba(255,122,89,0.25)',
              }}
              onMouseMove={handleMagnetic}
              onMouseLeave={(e) => {
                handleMagneticLeave(e)
                e.currentTarget.style.background = 'var(--coral)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,122,89,0.25)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--coral-dark)'
                e.currentTarget.style.boxShadow = '0 8px 40px rgba(255,122,89,0.35)'
              }}
            >
              View selected work
              <span>↗</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-display font-semibold text-sm px-7 py-3.5 rounded-full border transition-all duration-300 active:scale-95"
              style={{
                borderColor: 'var(--border-strong)',
                color: 'var(--foreground)',
              }}
              onMouseMove={handleMagnetic}
              onMouseLeave={(e) => {
                handleMagneticLeave(e)
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.color = 'var(--foreground)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--coral)'
                e.currentTarget.style.color = 'var(--coral)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,122,89,0.1)'
              }}
            >
              Start a project
              <span>→</span>
            </Link>
        </div>

        <div
          className="flex items-center justify-between mt-14 md:mt-16 pt-8 border-t flex-wrap gap-4"
          style={{
            borderColor: 'var(--border)',
            opacity: entered ? 1 : 0,
            transform: entered ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.95s var(--ease-out-expo) 0.54s',
          }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            {['Atmosphere', 'Motion', 'Clarity'].map((tag, i) => (
              <span
                key={tag}
                className="font-sans text-xs tracking-widest uppercase border rounded-full px-4 py-1.5 transition-all duration-500"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--lavender)',
                  opacity: entered ? 1 : 0,
                  transform: entered ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)',
                  transition: `all 0.7s var(--ease-out-expo) ${0.62 + i * 0.08}s`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)', opacity: 0.76 }}>
              crafted by ziad
            </span>
            <img src="/light-logo.png" alt="" aria-hidden="true" style={{ height: 24, width: 'auto', opacity: 0.9 }} />
          </div>
        </div>
      </div>
    </section>
  )
}