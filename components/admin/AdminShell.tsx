'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { logoutAction } from '@/lib/admin/actions'

type NavItem = { href: string; label: string; match: (path: string) => boolean }

function navItems(secret: string): NavItem[] {
  const base = `/${secret}`
  return [
    {
      href: base,
      label: 'Overview',
      match: (p) => {
        if (p === base || p === `${base}/`) return true
        return /\/projects\/\d+\/edit$/.test(p)
      },
    },
    {
      href: `${base}/projects/new`,
      label: 'New project',
      match: (p) => p.startsWith(`${base}/projects/new`),
    },
    {
      href: `${base}/blog`,
      label: 'Blog',
      match: (p) => p.startsWith(`${base}/blog`),
    },
    {
      href: `${base}/settings`,
      label: 'Settings',
      match: (p) => p.startsWith(`${base}/settings`),
    },
  ]
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string
  label: string
  active: boolean
  onNavigate: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-medium transition-colors duration-300 ease-[var(--ease-out-expo)] ${
        active
          ? 'bg-[color-mix(in_srgb,var(--coral)_10%,transparent)] text-[var(--foreground)]'
          : 'text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]'
      }`}
    >
      {active ? (
        <span
          className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full"
          style={{ background: 'var(--coral)' }}
          aria-hidden
        />
      ) : null}
      <span className="pl-1.5">{label}</span>
    </Link>
  )
}

export default function AdminShell({ secret, children }: { secret: string; children: ReactNode }) {
  const pathname = usePathname() ?? ''
  const items = navItems(secret)
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  useEffect(() => {
    closeMobile()
  }, [pathname, closeMobile])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35] mix-blend-multiply"
        style={{
          backgroundImage: `radial-gradient(ellipse 120% 80% at 10% -10%, color-mix(in srgb, var(--coral) 14%, transparent), transparent 55%),
            radial-gradient(ellipse 90% 60% at 100% 0%, color-mix(in srgb, var(--blue) 10%, transparent), transparent 50%)`,
        }}
        aria-hidden
      />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href={`/${secret}`} className="font-display text-lg font-black tracking-tight">
          ziad<span className="text-[var(--coral)]">.</span>studio
        </Link>
        <button
          type="button"
          className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-nav"
          onClick={() => setMobileOpen((o) => !o)}
        >
          Menu
        </button>
      </header>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--graphite)_35%,transparent)] backdrop-blur-sm lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <div className="relative z-10 flex min-h-[calc(100vh-52px)] lg:min-h-screen">
        {/* Sidebar — desktop */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-4 py-8 backdrop-blur-sm lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="px-2">
            <Link href={`/${secret}`} className="block font-display text-xl font-black tracking-tight">
              ziad<span className="text-[var(--coral)]">.</span>studio
            </Link>
            <p className="mt-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_90%,transparent)]">
              Control room
            </p>
          </div>

          <nav className="mt-10 flex flex-col gap-1 px-1" aria-label="Panel sections">
            {items.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={item.match(pathname)}
                onNavigate={() => {}}
              />
            ))}
          </nav>

          <div className="mt-auto space-y-2 border-t border-[var(--border)] pt-8">
            <Link
              href="/"
              className="flex w-full items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
            >
              View site
            </Link>
            <form action={logoutAction.bind(null, secret)}>
              <button
                type="submit"
                className="w-full rounded-xl border border-transparent bg-[var(--surface-secondary)] px-3 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--foreground)_65%,var(--lavender))] transition-colors hover:text-[var(--foreground)]"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>

        {/* Mobile drawer */}
        <aside
          id="admin-mobile-nav"
          className={`fixed inset-y-0 left-0 z-50 w-[min(20rem,88vw)] border-r border-[var(--border)] bg-[var(--surface)] px-4 py-8 shadow-[12px_0_48px_rgba(0,0,0,0.08)] transition-transform duration-500 ease-[var(--ease-out-expo)] lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
          }`}
          aria-hidden={!mobileOpen}
        >
          <div className="px-2">
            <p className="font-display text-xl font-black tracking-tight">
              ziad<span className="text-[var(--coral)]">.</span>studio
            </p>
          </div>
          <nav className="mt-8 flex flex-col gap-1 px-1" aria-label="Panel sections">
            {items.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={item.match(pathname)}
                onNavigate={closeMobile}
              />
            ))}
          </nav>
          <div className="mt-10 space-y-2 border-t border-[var(--border)] pt-8">
            <Link
              href="/"
              onClick={closeMobile}
              className="flex w-full items-center justify-center rounded-xl border border-[var(--border-strong)] px-3 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em]"
            >
              View site
            </Link>
            <form action={logoutAction.bind(null, secret)}>
              <button type="submit" className="w-full rounded-xl bg-[var(--surface-secondary)] px-3 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em]">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">{children}</main>
        </div>
      </div>
    </div>
  )
}
