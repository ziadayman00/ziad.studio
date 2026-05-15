import type { ReactNode } from 'react'

import { adminMuted } from '@/components/admin/ui-classes'

export default function AdminPageHeader({
  kicker = 'Studio panel',
  title,
  subtitle,
  actions,
}: {
  kicker?: string
  title: string
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">
          {kicker}
        </p>
        <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-[var(--foreground)] md:text-4xl">{title}</h1>
        {subtitle ? <p className={`${adminMuted} mt-3 max-w-2xl`}>{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-shrink-0 flex-wrap items-center gap-3">{actions}</div> : null}
    </header>
  )
}
