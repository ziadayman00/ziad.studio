'use client'

import Link from 'next/link'
import { useScrollReveal, useParallaxInView } from '@/hooks/useScrollReveal'
import { useHtmlAttrEquals } from '@/hooks/useIntroAttr'

const exploreLinks = [
  { href: '/work', label: 'Selected work' },
  { href: '/about', label: 'Studio' },
  { href: '/services', label: 'Capabilities' },
  { href: '/blog', label: 'Writing' },
]

const socialLinks = [
  { href: 'https://twitter.com/ziad.studio', label: 'Twitter' },
  { href: 'https://instagram.com/ziad.studio', label: 'Instagram' },
  { href: 'https://github.com', label: 'GitHub' },
]

export default function Footer() {
  const rootRef = useScrollReveal<HTMLElement>({ threshold: 0.12 })
  const watermarkRef = useParallaxInView<HTMLDivElement>(0.08)
  const introActive = useHtmlAttrEquals('data-intro', 'true')
  const footerVisible = !introActive

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden cin-section"
      aria-label="Site footer"
      style={{
        background:
          'linear-gradient(180deg, var(--background) 0%, color-mix(in srgb, var(--surface-secondary) 55%, var(--background)) 100%)',
        opacity: footerVisible ? 1 : 0,
        transform: footerVisible ? 'translateY(0)' : 'translateY(14px)',
        transition:
          'opacity 0.75s cubic-bezier(0.16, 1, 0.32, 1), transform 0.75s cubic-bezier(0.16, 1, 0.32, 1)',
      }}
    >
      {/* Atmospheric watermark */}
      <div
        ref={watermarkRef}
        className="pointer-events-none absolute inset-x-0 top-[10%] flex justify-center select-none"
        aria-hidden
      >
        <span
          className="font-display font-black whitespace-nowrap"
          style={{
            fontSize: 'clamp(4rem, 14vw, 11rem)',
            color: 'transparent',
            WebkitTextStroke: '1px color-mix(in srgb, var(--foreground) 12%, transparent)',
            lineHeight: 1,
            opacity: 0.35,
          }}
        >
          ziad studio
        </span>
      </div>

      {/* Soft horizon glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%]"
        aria-hidden
        style={{
          background:
            'radial-gradient(70% 55% at 50% 100%, color-mix(in srgb, var(--coral) 14%, transparent) 0%, transparent 72%)',
        }}
      />

      <div className="relative z-10 cin-container pb-14 pt-24 md:pb-16 md:pt-28 lg:pt-32">
        <div className="grid grid-cols-1 gap-14 xl:grid-cols-12 xl:gap-12 xl:items-end">
          {/* Identity column */}
          <div className="min-w-0 xl:col-span-5">
            <div className="cin-kicker reveal" style={{ '--reveal-delay': '0s' } as React.CSSProperties}>
              Closing scene
            </div>

            <h2
              className="cin-headline reveal mt-6"
              style={
                {
                  fontSize: 'clamp(2.1rem, 4.8vw, 3.75rem)',
                  color: 'var(--foreground)',
                  lineHeight: 1.02,
                  '--reveal-delay': '0.06s',
                } as React.CSSProperties
              }
            >
              Quiet<br />
              doesn&apos;t mean <span style={{ color: 'var(--coral)' }}>done</span>.
            </h2>

            <p
              className="cin-body reveal mt-6 max-w-md text-sm md:text-[15px]"
              style={{ '--reveal-delay': '0.12s' } as React.CSSProperties}
            >
              If something here lingered, we should talk. Send a note — short or cinematic — and we&apos;ll shape the next scene together.
            </p>

            <div className="reveal mt-8 flex flex-wrap items-center gap-6" style={{ '--reveal-delay': '0.18s' } as React.CSSProperties}>
              <Link href="/" className="inline-flex shrink-0 transition-opacity duration-500 ease-[var(--ease-out-expo)] hover:opacity-85">
                <img src="/light-logo.png" alt="Ziad Studio" style={{ height: 46, width: 'auto' }} />
              </Link>

              <div className="flex items-center gap-2 rounded-full border px-4 py-2" style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--surface) 88%, transparent)' }}>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--coral)] opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--coral)]" />
                </span>
                <span className="font-sans text-[11px] uppercase tracking-[0.18em]" style={{ color: 'var(--lavender)' }}>
                  Open for selected work
                </span>
              </div>
            </div>
          </div>

          {/* Panels column */}
          <div className="min-w-0 xl:col-span-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
              <div className="cin-panel reveal p-6 md:p-7" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
                <span className="font-sans text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--lavender)' }}>
                  Explore
                </span>
                <ul className="mt-6 space-y-3">
                  {exploreLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 font-sans text-sm transition-colors duration-500 ease-[var(--ease-out-expo)]"
                        style={{ color: 'var(--foreground)' }}
                      >
                        <span className="transition-colors duration-500 group-hover:text-[var(--coral)]">{link.label}</span>
                        <span className="text-[var(--coral)] opacity-0 transition-opacity duration-500 group-hover:opacity-100">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cin-panel reveal p-6 md:p-7" style={{ '--reveal-delay': '0.14s' } as React.CSSProperties}>
                <span className="font-sans text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--lavender)' }}>
                  Elsewhere
                </span>
                <ul className="mt-6 space-y-3">
                  {socialLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 font-sans text-sm transition-colors duration-500 ease-[var(--ease-out-expo)]"
                        style={{ color: 'var(--foreground)' }}
                      >
                        <span className="transition-colors duration-500 group-hover:text-[var(--coral)]">{link.label}</span>
                        <span className="text-[11px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ color: 'var(--lavender)' }}>
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full border px-5 py-3 font-display text-sm font-semibold transition-all duration-500 ease-[var(--ease-out-expo)] active:scale-[0.98]"
                  style={{
                    borderColor: 'var(--border-strong)',
                    background: 'color-mix(in srgb, var(--graphite) 94%, transparent)',
                    color: '#fff',
                  }}
                >
                  Open conversation <span className="ml-2 opacity-70">↗</span>
                </Link>
              </div>
            </div>

            <div className="cin-panel reveal mt-5 p-6 md:p-7 lg:mt-6" style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-8">
                <div>
                  <span className="font-sans text-[11px] uppercase tracking-[0.22em]" style={{ color: 'var(--lavender)' }}>
                    Direct line
                  </span>
                  <a
                    href="mailto:ziad.ayman.dev@gmail.com"
                    className="group mt-3 block font-display text-lg font-semibold tracking-tight transition-colors duration-500 ease-[var(--ease-out-expo)] md:text-xl"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <span className="transition-colors duration-500 group-hover:text-[var(--coral)]">ziad.ayman.dev@gmail.com</span>
                  </a>
                </div>
                <p className="cin-body max-w-sm text-xs md:text-sm md:text-right">
                  Prefer brevity? One sentence about the feeling you want is enough to start.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          className="reveal mt-16 flex flex-col gap-5 border-t pt-10 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: 'var(--border)', '--reveal-delay': '0.26s' } as React.CSSProperties}
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.18em]" style={{ color: 'color-mix(in srgb, var(--lavender) 82%, transparent)' }}>
            © {new Date().getFullYear()} Ziad Ayman · ziad.studio
          </p>
          <p className="max-w-xl font-sans text-xs leading-relaxed md:text-right" style={{ color: 'var(--lavender)' }}>
            Crafted as a cinematic identity — calm pacing, tactile contrast, motion that earns its moments.
          </p>
        </div>
      </div>
    </footer>
  )
}
