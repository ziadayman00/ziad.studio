'use client'

import Link from 'next/link'
import { useScrollReveal, useParallaxInView } from '@/hooks/useScrollReveal'

export default function CTASection() {
  const sectionRef = useScrollReveal<HTMLElement>({ threshold: 0.15 })
  const bgTextRef = useParallaxInView<HTMLDivElement>(0.12)

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden cin-section"
      style={{ background: 'var(--background)' }}
    >
      {/* Background type layer */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-display font-black whitespace-nowrap"
          style={{
            fontSize: 'clamp(6.5rem, 18vw, 16rem)',
            color: 'transparent',
            WebkitTextStroke: '1px var(--border)',
            lineHeight: 1,
            opacity: 0.4,
          }}
        >
          next project
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 cin-container py-28 md:py-36 lg:py-40">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-end">
          <div className="xl:col-span-8 min-w-0">
            <div className="cin-kicker reveal" style={{ '--reveal-delay': '0s' } as React.CSSProperties}>
              Final scene
            </div>
            <h2
              className="cin-headline mt-6 reveal"
              style={{
                fontSize: 'clamp(2.8rem, 7vw, 6.8rem)',
                color: 'var(--foreground)',
                '--reveal-delay': '0.08s',
              } as React.CSSProperties}
            >
              If this felt
              <br />
              different,
              <span style={{ color: 'var(--coral)' }}> let’s build</span>.
            </h2>
          </div>

          <div className="xl:col-span-4 min-w-0 reveal" style={{ '--reveal-delay': '0.14s' } as React.CSSProperties}>
            <div className="cin-panel p-6 md:p-7">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                  Open for selected projects
                </span>
                <img src="/light-logo.png" alt="" aria-hidden="true" style={{ height: 28, width: 'auto', opacity: 0.96 }} />
              </div>
              <p className="font-sans text-sm md:text-base leading-relaxed mt-4" style={{ color: 'var(--lavender)' }}>
                Product websites, portfolio ecosystems, and motion-first interfaces that leave an impression.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-3 md:gap-4 reveal" style={{ '--reveal-delay': '0.22s' } as React.CSSProperties}>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-display font-semibold text-sm px-8 py-4 rounded-full active:scale-95 bg-[var(--graphite)] text-white shadow-[0_4px_24px_rgba(31,31,36,0.15)] transition-all duration-500 ease-[var(--ease-out-expo)] hover:bg-[var(--coral)] hover:shadow-[0_8px_40px_rgba(255,122,89,0.3)]"
          >
            Start a project <span>↗</span>
          </Link>

          <a
            href="mailto:ziad.ayman.dev@gmail.com"
            className="inline-flex items-center gap-2 font-display font-semibold text-sm px-8 py-4 rounded-full border border-[var(--border-strong)] text-[var(--foreground)] active:scale-95 transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-[var(--coral)] hover:text-[var(--coral)] hover:shadow-[0_4px_24px_rgba(255,122,89,0.08)]"
          >
            ziad.ayman.dev@gmail.com
          </a>
        </div>
      </div>
    </section>
  )
}
