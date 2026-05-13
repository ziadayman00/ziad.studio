'use client'

import Link from 'next/link'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const services = [
  {
    number: '01',
    title: 'Design',
    description:
      'Interfaces that feel inevitable. From wireframe to pixel-perfect — every decision is intentional, every interaction considered.',
    tags: ['UI/UX', 'Branding', 'Systems', 'Motion'],
  },
  {
    number: '02',
    title: 'Development',
    description:
      'Clean code that performs. React, Next.js, TypeScript — built to last, built to scale, built to impress.',
    tags: ['React', 'Next.js', 'TypeScript', 'Node.js'],
  },
  {
    number: '03',
    title: 'Storytelling',
    description:
      'Every product has a story. I find it, shape it, and make it impossible to ignore.',
    tags: ['Motion', 'Narrative', 'Identity', 'Cinematic'],
  },
]

export default function ServicesStrip() {
  const sectionRef = useScrollReveal<HTMLElement>({ threshold: 0.1 })

  return (
    <section ref={sectionRef} className="cin-section" style={{ background: 'var(--graphite)' }}>
      <div className="cin-container cin-space">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-start">
          {/* Left: headline + control */}
          <div className="xl:col-span-5 min-w-0">
            <div className="cin-kicker reveal" style={{ '--reveal-delay': '0s', color: 'rgba(255,255,255,0.32)' } as React.CSSProperties}>
              Capabilities
            </div>
            <h2
              className="cin-headline reveal mt-7"
              style={{
                fontSize: 'clamp(2.6rem, 5.4vw, 4.6rem)',
                color: 'white',
                '--reveal-delay': '0.08s',
              } as React.CSSProperties}
            >
              A studio
              <br />
              inside a
              <span style={{ color: 'var(--coral)' }}> browser</span>.
            </h2>
            <p className="mt-8 font-sans text-base leading-relaxed reveal" style={{ color: 'rgba(255,255,255,0.42)', '--reveal-delay': '0.16s' } as React.CSSProperties}>
              Design, engineering, and storytelling as one discipline. The output should feel like an identity system — not a landing page.
            </p>

            <Link
              href="/services"
              className="inline-flex items-center gap-3 font-display font-semibold text-sm mt-10 reveal"
              style={{
                color: 'rgba(255,255,255,0.68)',
                '--reveal-delay': '0.22s',
                transition: 'transform 0.7s var(--ease-out-expo), color 0.7s var(--ease-out-expo)',
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--coral)'
                e.currentTarget.style.transform = 'translateX(6px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.68)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              Full services index <span style={{ color: 'var(--coral)' }}>→</span>
            </Link>
          </div>

          {/* Right: service “stacks” (CSS hover, no state) */}
          <div className="xl:col-span-7 min-w-0">
            <div className="rounded-3xl overflow-hidden border reveal" style={{ borderColor: 'rgba(255,255,255,0.10)', '--reveal-delay': '0.1s' } as React.CSSProperties}>
              {services.map((s, i) => (
                <div
                  key={s.number}
                  className="service-stack group relative px-6 sm:px-7 md:px-9 py-8 md:py-10"
                  style={{
                    borderBottom: i === services.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.10)',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'background 0.8s var(--ease-out-expo)',
                  }}
                >
                  {/* Hover lighting */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(620px 420px at 20% 30%, rgba(255,122,89,0.10) 0%, transparent 60%), radial-gradient(720px 520px at 80% 70%, rgba(110,168,254,0.08) 0%, transparent 65%)',
                      opacity: 0,
                      transition: 'opacity 0.8s var(--ease-out-expo)',
                    }}
                  />

                  <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
                    <div className="lg:col-span-4 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.28)' }}>
                          {s.number}
                        </span>
                        <span className="hidden md:block w-2 h-2 rounded-full" style={{ background: 'var(--coral)', opacity: 0.5 }} />
                      </div>
                      <div
                        className="mt-3 font-display font-black"
                        style={{
                          color: 'white',
                          fontSize: 'clamp(1.6rem, 2.2vw, 2.15rem)',
                          lineHeight: 1.04,
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {s.title}
                      </div>
                    </div>

                    <div className="lg:col-span-8 min-w-0">
                      <p className="font-sans text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.46)' }}>
                        {s.description}
                      </p>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {s.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-sans text-[11px] tracking-widest uppercase rounded-full px-3 py-1 border"
                            style={{
                              borderColor: 'rgba(255,255,255,0.10)',
                              color: 'rgba(255,255,255,0.34)',
                              background: 'rgba(255,255,255,0.02)',
                              transition: 'all 0.7s var(--ease-out-expo)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* group hover effects (CSS only) */}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between reveal" style={{ '--reveal-delay': '0.18s' } as React.CSSProperties}>
              <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.26)' }}>
                calm but powerful
              </span>
              <img src="/dark-logo.png" alt="" aria-hidden="true" style={{ height: 40, width: 'auto', opacity: 0.95 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
