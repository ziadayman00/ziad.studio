'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import type { Project } from '@/lib/projects'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useInView } from '@/hooks/useInView'

type WorkPreviewProps = {
  featured: Project[]
  totalCount: number
}

export default function WorkPreview({ featured, totalCount }: WorkPreviewProps) {
  const [active, setActive] = useState(featured[0]?.id ?? 0)
  const sectionRef = useScrollReveal<HTMLElement>({ threshold: 0.1 })
  const { ref: inViewRef, inView } = useInView<HTMLElement>({ threshold: 0.15, rootMargin: '0px 0px -20% 0px', once: false })
  const hostRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  const activeProject = useMemo(() => featured.find((p) => p.id === active) ?? featured[0], [active, featured])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (!inView) return

    const onMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect()
        const x = (e.clientX - r.left) / Math.max(1, r.width)
        const y = (e.clientY - r.top) / Math.max(1, r.height)
        host.style.setProperty('--pv-x', `${(x * 100).toFixed(3)}%`)
        host.style.setProperty('--pv-y', `${(y * 100).toFixed(3)}%`)
      })
    }

    host.addEventListener('mousemove', onMove, { passive: true })
    host.style.setProperty('--pv-x', '60%')
    host.style.setProperty('--pv-y', '38%')
    return () => {
      host.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [inView])

  return (
    <section
      ref={(node) => {
        sectionRef.current = node
        inViewRef.current = node
      }}
      className="relative overflow-hidden cin-section"
      style={{ background: 'var(--graphite)' }}
    >
      <div
        ref={hostRef}
        className="cin-container cin-space"
        style={
          {
            '--pv-x': '60%',
            '--pv-y': '38%',
          } as React.CSSProperties
        }
      >

        {/* Header */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-end mb-12 md:mb-14">
          <div className="xl:col-span-8 min-w-0">
            <div className="cin-kicker reveal" style={{ '--reveal-delay': '0s', color: 'rgba(255,255,255,0.32)' } as React.CSSProperties}>
              Selected work
            </div>
            <h2
              className="cin-headline mt-6 reveal"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 5.8rem)', color: 'white', '--reveal-delay': '0.08s' } as React.CSSProperties}
            >
              A few scenes
              <br />
              from the
              <span style={{ color: 'var(--coral)' }}> archive</span>.
            </h2>
          </div>
          <div className="xl:col-span-4 min-w-0 reveal" style={{ '--reveal-delay': '0.14s' } as React.CSSProperties}>
            <div className="cin-panel p-6 md:p-7" style={{ borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.03)' }}>
              <p className="font-sans text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Tap a title to enter the scene. Hover shifts the light. Each project is treated like an artifact.
              </p>
              <div className="mt-6">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 font-display font-semibold text-sm"
                  style={{ color: 'rgba(255,255,255,0.75)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--coral)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                >
                  Explore full archive <span style={{ color: 'var(--coral)' }}>↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Artifacts layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-start">
          {/* Left track */}
          <div className="xl:col-span-5 min-w-0 reveal" style={{ '--reveal-delay': '0.18s' } as React.CSSProperties}>
            <div className="rounded-3xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.02)' }}>
              {featured.length === 0 ? (
                <div className="px-6 sm:px-7 md:px-9 py-12 md:py-14">
                  <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
                    Featured projects will appear here once they are published from your studio panel.
                  </p>
                  <Link href="/work" className="mt-6 inline-flex items-center gap-2 font-display font-semibold text-sm" style={{ color: 'var(--coral)' }}>
                    Browse archive <span>↗</span>
                  </Link>
                </div>
              ) : null}
              {featured.map((project, i) => {
                const isActive = project.id === active
                return (
                  <Link key={project.id} href={`/work/${project.slug}`} className="block">
                    <div
                      className="relative px-6 sm:px-7 md:px-9 py-7 md:py-8"
                      style={{
                        borderBottom: i === featured.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.10)',
                        background: isActive ? 'rgba(255,255,255,0.03)' : 'transparent',
                        transition: 'background 0.7s var(--ease-out-expo)',
                      }}
                      onMouseEnter={() => setActive(project.id)}
                      onFocus={() => setActive(project.id)}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-display font-black text-xs tabular-nums" style={{ color: isActive ? 'var(--coral)' : 'rgba(255,255,255,0.22)', transition: 'color 0.6s var(--ease-out-expo)' }}>
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="w-2 h-2 rounded-full" style={{ background: project.color, opacity: isActive ? 1 : 0.55, transition: 'opacity 0.6s var(--ease-out-expo)' }} />
                            <span className="font-sans text-[11px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.34)' }}>
                              {project.category}
                            </span>
                            <span className="font-sans text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                              {project.year}
                            </span>
                          </div>
                          <div className="mt-3 font-display font-black" style={{ color: 'white', fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', lineHeight: 1.02 }}>
                            {project.title}
                          </div>
                          <p className="mt-3 font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.46)', maxWidth: 560 }}>
                            {project.subtitle}
                          </p>
                        </div>
                        <span className="font-display text-xl shrink-0" style={{ color: 'var(--coral)', opacity: isActive ? 1 : 0.0, transform: isActive ? 'translateY(0)' : 'translateY(6px)', transition: 'all 0.6s var(--ease-out-expo)' }}>
                          ↗
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right preview (real poster) */}
          <div className="xl:col-span-7 min-w-0 reveal" style={{ '--reveal-delay': '0.24s' } as React.CSSProperties}>
            {activeProject && (
              <div className="relative rounded-[28px] overflow-hidden border pv-artifact">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(560px 420px at var(--pv-x) var(--pv-y), ${activeProject.color}22 0%, transparent 62%), radial-gradient(720px 520px at 70% 20%, rgba(110,168,254,0.14) 0%, transparent 64%), linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(0,0,0,0.34) 100%)`,
                  }}
                />
                <img
                  src={(activeProject.images?.[0] ?? '/assets/hero-poster.jpg')}
                  alt={`${activeProject.title} preview`}
                  className="relative w-full h-[420px] md:h-[520px] lg:h-[620px] object-cover object-top"
                />
                <div className="absolute inset-0 intro-grain" style={{ opacity: 0.22 }} />

                <div className="absolute left-6 right-6 bottom-6 md:left-8 md:right-8 md:bottom-8">
                  <div
                    className="rounded-3xl border p-6 md:p-7"
                    style={{
                      borderColor: 'rgba(255,255,255,0.12)',
                      background: 'rgba(17,17,20,0.32)',
                      backdropFilter: 'blur(18px) saturate(1.2)',
                      WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
                      boxShadow: '0 24px 90px rgba(0,0,0,0.35)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            Preview
                          </span>
                          <span className="w-2 h-2 rounded-full" style={{ background: activeProject.color }} />
                          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.45)' }}>
                            {activeProject.year}
                          </span>
                        </div>
                        <div className="mt-3 font-display font-black" style={{ color: 'white', fontSize: 'clamp(2rem, 3.6vw, 3.2rem)', lineHeight: 1.02 }}>
                          {activeProject.title}
                        </div>
                        <p className="mt-3 font-sans text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)', maxWidth: 760 }}>
                          {activeProject.longDescription}
                        </p>
                      </div>
                      <Link
                        href={`/work/${activeProject.slug}`}
                        className="shrink-0 inline-flex items-center gap-2 font-display font-semibold text-sm px-6 py-3 rounded-full"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: 'white',
                          transition: 'all 0.6s var(--ease-out-expo)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
                          e.currentTarget.style.borderColor = activeProject.color
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        Enter ↗
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Total count (quiet detail) */}
        <div className="mt-16 hidden md:flex items-center gap-2 reveal-scale" style={{ '--reveal-delay': '0.45s' } as React.CSSProperties}>
          <span className="font-display font-black text-6xl md:text-8xl" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.06)' }}>
            {totalCount}
          </span>
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.18)' }}>
            total artifacts
          </span>
        </div>
      </div>
    </section>
  )
}
