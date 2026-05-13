'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'

import { useHtmlAttrEquals } from '@/hooks/useIntroAttr'

const links = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [compress, setCompress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  /** Matches Tailwind `lg` — mobile nav + overlay only exist below this width. */
  const [isNarrowViewport, setIsNarrowViewport] = useState(false)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<boolean>(false)
  const compressRef = useRef<number>(0)

  /** Dark chrome (logo, hamburger): scrolled header, or mobile menu open over dark overlay before scroll. */
  const darkChrome = scrolled || (menuOpen && isNarrowViewport)

  const introActive = useHtmlAttrEquals('data-intro', 'true')
  const chromeVisible = mounted && !introActive

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const sync = () => setIsNarrowViewport(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const read = () => {
      const y = window.scrollY
      const next = y > 48
      if (next !== lastRef.current) {
        lastRef.current = next
        setScrolled(next)
      }

      // Smooth compression from 0 -> 1 between 0px and 140px scroll.
      const raw = Math.max(0, Math.min(1, y / 140))
      const eased = 1 - Math.pow(1 - raw, 2.3)
      if (Math.abs(eased - compressRef.current) > 0.015) {
        compressRef.current = eased
        setCompress(eased)
      }
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        read()
      })
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [pathname])

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? 'hidden' : ''
      return !prev
    })
  }

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 pointer-events-none pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]"
        style={{
          opacity: chromeVisible ? 1 : 0,
          transform: chromeVisible ? 'translateY(0)' : 'translateY(-14px)',
          transition:
            'opacity 0.75s cubic-bezier(0.16, 1, 0.32, 1), transform 0.75s cubic-bezier(0.16, 1, 0.32, 1)',
        }}
      >
        <nav
          className="pointer-events-auto w-full"
          style={{
            maxWidth: `min(${1280 - compress * 320}px, calc(100vw - 1.2rem))`,
          }}
        >
          <div
            className={`flex items-center justify-between gap-6 lg:gap-8 px-0 lg:px-[clamp(12px,2.2vw,40px)] py-2.5 transition-all duration-700 ease-[var(--ease-out-expo)] ${
              scrolled
                ? 'rounded-full border border-white/10 bg-[rgba(31,31,36,0.82)] shadow-[0_10px_40px_rgba(0,0,0,0.24)] backdrop-blur-xl'
                : 'rounded-2xl border border-transparent bg-transparent shadow-none backdrop-blur-0'
            }`}
            style={{
              // Continuous minimization while scrolling
              paddingTop: `${10 - compress * 3.5}px`,
              paddingBottom: `${10 - compress * 3.5}px`,
              transform: `translateY(${-compress * 2.2}px)`,
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              className="block shrink-0 transition-transform duration-700 ease-[var(--ease-out-expo)]"
              style={{ transform: `scale(${1 - compress * 0.15})` }}
            >
              <span
                className="relative block"
                style={{
                  width: `${214 - compress * 46}px`,
                  height: `${66 - compress * 14}px`,
                }}
              >
                {/* Light background logo */}
                <img
                  src="/light-logo.png"
                  alt="Ziad"
                  className="absolute inset-0 h-full w-full object-contain object-left"
                  style={{
                    opacity: darkChrome ? 0 : 1,
                    transition: 'opacity 0.6s var(--ease-out-expo)',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.14))',
                  }}
                />
                {/* Dark background logo */}
                <img
                  src="/dark-logo.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-contain object-left"
                  style={{
                    opacity: darkChrome ? 1 : 0,
                    transition: 'opacity 0.6s var(--ease-out-expo)',
                    filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))',
                  }}
                />
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-7">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-sm relative group"
                  style={{
                    color: scrolled
                      ? pathname === link.href ? 'white' : 'rgba(255,255,255,0.45)'
                      : pathname === link.href ? 'var(--foreground)' : 'var(--lavender)',
                    transition: 'color 0.4s var(--ease-out-expo)',
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-0.5 left-0 h-px group-hover:w-full"
                    style={{
                      background: 'var(--coral)',
                      width: pathname === link.href ? '100%' : '0%',
                      transition: 'width 0.5s var(--ease-out-expo)',
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
              {!scrolled && (
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--coral)', animation: 'pulseDot 2s ease-in-out infinite' }}
                  />
                  <span className="font-sans text-xs" style={{ color: 'var(--lavender)' }}>
                    Available
                  </span>
                </div>
              )}
              <Link
                href="/contact"
                className={`font-display font-semibold text-sm px-5 py-2 rounded-full active:scale-95 transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  scrolled
                    ? 'bg-[var(--coral)] text-white shadow-[0_2px_16px_rgba(255,122,89,0.2)] hover:bg-white hover:text-[var(--graphite)] hover:shadow-[0_4px_24px_rgba(255,122,89,0.25)]'
                    : 'bg-[var(--graphite)] text-white hover:bg-[var(--coral)] hover:shadow-[0_4px_24px_rgba(255,122,89,0.25)]'
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={toggleMenu}
              className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center"
              aria-label="Toggle menu"
            >
              <span className="flex flex-col items-center justify-center gap-[5px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-px origin-center"
                    style={{
                      background: darkChrome ? 'white' : 'var(--foreground)',
                      width: i === 1 ? (menuOpen ? '0px' : '16px') : '20px',
                      opacity: i === 1 && menuOpen ? 0 : 1,
                      transform:
                        i === 0 && menuOpen
                          ? 'rotate(45deg) translateY(7px)'
                          : i === 2 && menuOpen
                          ? 'rotate(-45deg) translateY(-7px)'
                          : 'none',
                      transition: 'all 0.4s var(--ease-out-expo)',
                    }}
                  />
                ))}
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className="fixed inset-0 z-40 flex flex-col justify-center px-8 sm:px-10 lg:hidden"
        style={{
          background: 'var(--graphite)',
          opacity: menuOpen && chromeVisible ? 1 : 0,
          pointerEvents: menuOpen && chromeVisible ? 'auto' : 'none',
          transition: 'opacity 0.5s var(--ease-out-expo)',
        }}
      >
        <div className="flex flex-col gap-1">
          {[...links, { href: '/contact', label: 'Contact' }].map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-display font-black py-4 border-b flex items-center justify-between group"
              style={{
                fontSize: 'clamp(2.2rem, 9vw, 3.5rem)',
                color: pathname === link.href ? 'var(--coral)' : 'white',
                borderColor: 'rgba(255,255,255,0.08)',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(-24px)',
                transition: `all 0.5s var(--ease-out-expo) ${i * 60}ms`,
              }}
            >
              {link.label}
              <span
                className="text-2xl"
                style={{
                  color: 'var(--coral)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                ↗
              </span>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-10 left-10 flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: 'var(--coral)', animation: 'pulseDot 2s ease-in-out infinite' }}
          />
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Available for new projects
          </span>
        </div>
      </div>
    </>
  )
}