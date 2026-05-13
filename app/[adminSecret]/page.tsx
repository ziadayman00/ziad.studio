import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import Link from 'next/link'
import { asc } from 'drizzle-orm'

import CopySqlBlock from '@/components/admin/CopySqlBlock'
import PanelChrome from '@/components/admin/PanelChrome'
import DeleteProjectButton from '@/components/admin/DeleteProjectButton'
import { requireAdmin } from '@/lib/admin/panel'
import { formatDbError } from '@/lib/db/format-error'
import { ensureProjectsSchemaIfNeeded } from '@/lib/db/ensure-schema'
import { getDb } from '@/lib/db'
import type { ProjectRow } from '@/lib/db/schema'
import { projects as projectsTable } from '@/lib/db/schema'

type Props = {
  params: Promise<{ adminSecret: string }>
}

export default async function AdminDashboardPage({ params }: Props) {
  const { adminSecret } = await params
  await requireAdmin(adminSecret)

  await ensureProjectsSchemaIfNeeded()
  const db = getDb()
  let rows: ProjectRow[] = []
  let dbError: string | null = null

  if (db) {
    try {
      rows = await db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder), asc(projectsTable.id))
    } catch (e) {
      console.error('[admin] projects query failed', e)
      dbError = formatDbError(e)
    }
  }

  const missingProjectsTable =
    !!dbError &&
    (dbError.includes('42P01') ||
      (dbError.toLowerCase().includes('relation') && dbError.toLowerCase().includes('does not exist')))

  let initProjectsSql = ''
  if (missingProjectsTable) {
    try {
      initProjectsSql = readFileSync(join(process.cwd(), 'lib/db/init-projects.sql'), 'utf8')
    } catch {
      initProjectsSql = ''
    }
  }

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <PanelChrome
          secret={adminSecret}
          title="Projects"
          subtitle="Manage case studies synced from Supabase Postgres via Drizzle. Changes apply to the live site immediately after save."
        />

        {dbError ? (
          <div className="mt-12 rounded-[24px] border border-red-400/30 bg-red-500/10 p-6 md:p-8">
            <p className="font-display font-semibold text-lg text-red-100">Could not load projects</p>
            <p className="mt-3 font-mono text-xs leading-relaxed text-red-100/85 break-words">{dbError}</p>
            <p className="mt-5 font-sans text-sm leading-relaxed text-red-100/80">
              This is error <span className="font-mono text-[13px]">42P01</span>: the <span className="font-mono text-[13px]">projects</span> table has not been created in this database yet.
            </p>
            {initProjectsSql ? <CopySqlBlock sql={initProjectsSql} /> : null}
            <p className="mt-5 font-sans text-sm leading-relaxed text-red-100/70">
              Alternative from your machine: <code className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-[13px]">npm run db:init</code> then{' '}
              <code className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-[13px]">npm run db:seed</code> (needs a working <code className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-[13px]">DATABASE_URL</code>).
            </p>
          </div>
        ) : !db ? (
          <div className="mt-12 rounded-[24px] border border-amber-400/25 bg-amber-500/10 p-6 md:p-8">
            <p className="font-display font-semibold text-lg text-amber-100">Database not configured</p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-amber-100/75">
              Add <code className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-[13px]">DATABASE_URL</code> from your Supabase project (Settings → Database → Connection string → URI). Then run{' '}
              <code className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-[13px]">npm run db:push</code> and{' '}
              <code className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-[13px]">npm run db:seed</code>.
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-14 rounded-[24px] border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="font-display text-xl font-semibold text-white">No projects yet</p>
            <p className="mt-3 font-sans text-sm text-white/45">Seed from your JSON archive or create the first entry.</p>
            <Link
              href={`/${adminSecret}/projects/new`}
              className="mt-8 inline-flex rounded-full bg-[var(--coral)] px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_16px_50px_rgba(255,122,89,0.22)]"
            >
              Create project
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-4">
            {rows.map((row) => (
              <div
                key={row.id}
                className="flex flex-col gap-6 rounded-[22px] border border-white/10 bg-white/[0.03] p-6 md:flex-row md:items-center md:justify-between md:p-7"
              >
                <div className="min-w-0 flex items-start gap-5">
                  <span className="mt-1 size-3 shrink-0 rounded-full" style={{ background: row.color }} aria-hidden />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-xl font-bold tracking-tight text-white">{row.title}</span>
                      {row.featured ? (
                        <span className="rounded-full border border-white/14 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-white/55">
                          Featured
                        </span>
                      ) : null}
                      {row.inProgress ? (
                        <span className="rounded-full border border-[var(--blue)]/35 bg-[var(--blue)]/10 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-[var(--blue-muted)]">
                          In progress
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 font-sans text-sm text-white/45">
                      <span className="text-white/60">{row.slug}</span>
                      <span className="mx-2 text-white/25">·</span>
                      {row.category}
                      <span className="mx-2 text-white/25">·</span>
                      {row.year}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <Link
                    href={`/work/${row.slug}`}
                    className="rounded-full border border-white/14 px-5 py-2.5 font-sans text-xs uppercase tracking-[0.14em] text-white/65 transition-colors hover:border-white/25 hover:text-white"
                  >
                    View live
                  </Link>
                  <Link
                    href={`/${adminSecret}/projects/${row.id}/edit`}
                    className="rounded-full bg-white/[0.06] px-6 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/[0.10]"
                  >
                    Edit
                  </Link>
                  <DeleteProjectButton secret={adminSecret} id={row.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
