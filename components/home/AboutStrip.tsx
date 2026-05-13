'use client'

import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function AboutStrip() {
  const sectionRef = useScrollReveal<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="cin-section">
      <div className="cin-container cin-space">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-start">
          {/* Left: statement */}
          <div className="xl:col-span-7 min-w-0">
            <div className="cin-kicker reveal" style={{ '--reveal-delay': '0s' } as React.CSSProperties}>
              Studio note
            </div>

            <h2
              className="cin-headline reveal mt-7"
              style={{
                fontSize: 'clamp(3rem, 6vw, 5.2rem)',
                color: 'var(--foreground)',
                '--reveal-delay': '0.08s',
              } as React.CSSProperties}
            >
              I don’t build
              <br />
              interfaces.
              <br />
              I build
              <span style={{ color: 'var(--coral)' }}> atmospheres</span>.
            </h2>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
              <p className="cin-body md:col-span-7 reveal" style={{ '--reveal-delay': '0.16s' } as React.CSSProperties}>
                I’m Ziad — a creative developer/designer focused on cinematic pacing, intentional systems, and the kind
                of calm interaction that feels expensive without being loud.
              </p>

              <div className="md:col-span-5 reveal min-w-0" style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}>
                <div className="cin-panel cin-hoverlift p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                      Identity
                    </span>
                    <span className="w-2 h-2 rounded-full" style={{ background: 'var(--coral)' }} />
                  </div>
                  <div className="mt-5 flex flex-col gap-3">
                    {[
                      { k: 'Role', v: 'Creative Developer' },
                      { k: 'Focus', v: 'Motion systems + design engineering' },
                      { k: 'Goal', v: 'Memorable product experiences' },
                    ].map((row) => (
                      <div key={row.k} className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                        <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                          {row.k}
                        </span>
                        <span className="font-display font-bold text-sm" style={{ color: 'var(--foreground)', textAlign: 'left' }}>
                          {row.v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-3 font-display font-semibold text-sm mt-12 reveal"
              style={{ color: 'var(--foreground)', '--reveal-delay': '0.24s', transition: 'transform 0.6s var(--ease-out-expo), color 0.6s var(--ease-out-expo)' } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--coral)'
                e.currentTarget.style.transform = 'translateX(6px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--foreground)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              Read the manifesto <span style={{ color: 'var(--coral)' }}>→</span>
            </Link>
          </div>

          {/* Right: quiet artifacts */}
          <div className="xl:col-span-5 xl:pt-20 min-w-0">
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: 'Calm motion',
                  desc: 'Inertia, softness, and physically believable transitions.',
                },
                {
                  title: 'System thinking',
                  desc: 'Design language that stays coherent across pages and products.',
                },
                {
                  title: 'Emotional pacing',
                  desc: 'Silence, focus, and contrast — like film, not UI noise.',
                },
              ].map((a, i) => (
                <div
                  key={a.title}
                  className="cin-panel cin-hoverlift p-6 reveal"
                  style={{ '--reveal-delay': `${0.14 + i * 0.08}s` } as React.CSSProperties}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black" style={{ color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                      {a.title}
                    </span>
                    <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                      0{i + 1}
                    </span>
                  </div>
                  <p className="cin-body mt-3 text-sm" style={{ maxWidth: 440 }}>
                    {a.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 reveal" style={{ '--reveal-delay': '0.34s' } as React.CSSProperties}>
              <div
                className="rounded-3xl overflow-hidden border"
                style={{
                  borderColor: 'var(--border)',
                  background:
                    'radial-gradient(720px 520px at 55% 35%, rgba(255,122,89,0.10) 0%, transparent 60%), radial-gradient(720px 520px at 35% 70%, rgba(110,168,254,0.08) 0%, transparent 65%), linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.50) 100%)',
                }}
              >
                <div className="p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                      Signature
                    </span>
                    <img src="/light-logo.png" alt="" aria-hidden="true" style={{ height: 40, width: 'auto', opacity: 0.96 }} />
                  </div>
                  <p className="mt-5 font-display font-black" style={{ color: 'var(--foreground)', fontSize: 24, lineHeight: 1.15 }}>
                    “Calm, but powerful.”
                  </p>
                  <p className="cin-body mt-3 text-sm">
                    The site should feel like a studio atmosphere — not a template.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
