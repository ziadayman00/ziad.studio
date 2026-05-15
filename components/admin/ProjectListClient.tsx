'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import DeleteProjectButton from '@/components/admin/DeleteProjectButton'
import type { ProjectRow } from '@/lib/db/schema'

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="cin-panel relative overflow-hidden rounded-[20px] p-5 md:p-6">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-50 blur-2xl"
        style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--coral) 35%, transparent), transparent 70%)' }}
      />
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">
        {label}
      </p>
      <p className="mt-3 font-display text-3xl font-black tracking-tight text-[var(--foreground)] md:text-4xl">{value}</p>
      {hint ? <p className="mt-2 font-sans text-xs text-[color-mix(in_srgb,var(--foreground)_45%,var(--lavender))]">{hint}</p> : null}
    </div>
  )
}

export default function ProjectListClient({ secret, rows }: { secret: string; rows: ProjectRow[] }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return rows
    return rows.filter((r) => {
      const blob = [r.title, r.slug, r.category, r.year, ...(r.tags ?? [])].join(' ').toLowerCase()
      return blob.includes(t)
    })
  }, [q, rows])

  const featured = rows.filter((r) => r.featured).length
  const inProgress = rows.filter((r) => r.inProgress).length

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total" value={rows.length} hint="Artifacts in database" />
        <StatCard label="Featured" value={featured} hint="Surfaced on homepage" />
        <StatCard label="In progress" value={inProgress} hint="Visible on /work" />
      </div>

      <div className="mt-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--foreground)] md:text-2xl">Portfolio</h2>
            <p className="mt-1 font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))]">
              Search by title, slug, category, or tag.
            </p>
          </div>
          <label className="block w-full sm:max-w-xs">
            <span className="sr-only">Filter projects</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter…"
              className="w-full rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 font-sans text-sm text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-[color-mix(in_srgb,var(--lavender)_65%,transparent)] focus:border-[color-mix(in_srgb,var(--coral)_45%,var(--border-strong))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--coral)_18%,transparent)]"
            />
          </label>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[22px] border border-dashed border-[var(--border-strong)] bg-[var(--surface-secondary)]/60 px-6 py-12 text-center">
            <p className="font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))]">No projects match this filter.</p>
          </div>
        ) : (
          <ul className="mt-6 space-y-3">
            {filtered.map((row) => {
              const thumb = row.images?.[0]
              return (
                <li
                  key={row.id}
                  className="cin-panel flex flex-col gap-5 rounded-[20px] p-4 transition-[border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:border-[color-mix(in_srgb,var(--coral)_22%,var(--border))] hover:shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:flex-row md:items-center md:justify-between md:p-5"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div
                      className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] md:size-16"
                      style={{ boxShadow: `inset 0 0 0 2px color-mix(in srgb, ${row.color} 35%, transparent)` }}
                    >
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element -- dynamic admin thumbs
                        <img src={thumb} alt="" className="size-full object-cover object-top" loading="lazy" />
                      ) : (
                        <div className="flex size-full items-center justify-center font-mono text-[10px] text-[var(--lavender)]">—</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-lg font-bold tracking-tight text-[var(--foreground)] md:text-xl">{row.title}</span>
                        {row.featured ? (
                          <span className="rounded-full bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--coral-dark)]">
                            Featured
                          </span>
                        ) : null}
                        {row.inProgress ? (
                          <span className="rounded-full bg-[color-mix(in_srgb,var(--blue)_12%,transparent)] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--blue)]">
                            In progress
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1.5 font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))]">
                        <span className="font-mono text-[13px] text-[var(--foreground)]">{row.slug}</span>
                        <span className="mx-2 text-[var(--border-strong)]">·</span>
                        {row.category}
                        <span className="mx-2 text-[var(--border-strong)]">·</span>
                        {row.year}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Link
                      href={`/work/${row.slug}`}
                      className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
                    >
                      View live
                    </Link>
                    <Link
                      href={`/${secret}/projects/${row.id}/edit`}
                      className="rounded-full bg-[var(--graphite)] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white transition-[filter] hover:brightness-110"
                    >
                      Edit
                    </Link>
                    <DeleteProjectButton secret={secret} id={row.id} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
