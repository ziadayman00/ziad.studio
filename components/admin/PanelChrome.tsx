import Link from 'next/link'

import { logoutAction } from '@/lib/admin/actions'

export default function PanelChrome({
  secret,
  title,
  subtitle,
}: {
  secret: string
  title: string
  subtitle?: string
}) {
  return (
    <header className="flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-white/40">Studio panel</p>
        <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight text-white mt-2">{title}</h1>
        {subtitle ? (
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-white/45">{subtitle}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-white/14 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/25 hover:text-white"
        >
          View site
        </Link>
        <Link
          href={`/${secret}/projects/new`}
          className="rounded-full bg-[var(--coral)] px-6 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_40px_rgba(255,122,89,0.18)] transition-[filter] hover:brightness-105"
        >
          New project
        </Link>
        <form action={logoutAction.bind(null, secret)}>
          <button
            type="submit"
            className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 font-sans text-xs uppercase tracking-[0.16em] text-white/55 transition-colors hover:border-white/22 hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  )
}
