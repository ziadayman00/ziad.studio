import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import Link from 'next/link'
import { asc } from 'drizzle-orm'

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import CopySqlBlock from '@/components/admin/CopySqlBlock'
import ProjectListClient from '@/components/admin/ProjectListClient'
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
    <>
      <AdminPageHeader
        title="Overview"
        subtitle="Manage portfolio case studies, media, and flags. Changes apply to the live site after save — backed by Postgres via Drizzle."
        actions={
          <Link
            href={`/${adminSecret}/projects/new`}
            className="inline-flex items-center justify-center rounded-full bg-[var(--coral)] px-6 py-3 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_14px_44px_rgba(255,122,89,0.22)] transition-[filter,transform] duration-500 ease-[var(--ease-out-expo)] hover:brightness-105 active:scale-[0.98]"
          >
            New project
          </Link>
        }
      />

      {dbError ? (
        <div className="mt-10 rounded-[22px] border border-red-200 bg-[color-mix(in_srgb,#fecaca_22%,var(--surface))] p-6 md:p-8">
          <p className="font-display text-lg font-semibold text-red-900">Could not load projects</p>
          <p className="mt-3 break-words font-mono text-xs leading-relaxed text-red-800/90">{dbError}</p>
          <p className="mt-5 font-sans text-sm leading-relaxed text-red-900/85">
            If you see <span className="font-mono text-[13px]">42P01</span>, the <span className="font-mono text-[13px]">projects</span> table is missing in this database.
          </p>
          {initProjectsSql ? <CopySqlBlock sql={initProjectsSql} /> : null}
          <p className="mt-5 font-sans text-sm leading-relaxed text-red-900/75">
            From your machine: <code className="rounded-md bg-red-100/80 px-2 py-0.5 font-mono text-[13px]">npm run db:init</code> then{' '}
            <code className="rounded-md bg-red-100/80 px-2 py-0.5 font-mono text-[13px]">npm run db:seed</code> (requires <code className="rounded-md bg-red-100/80 px-2 py-0.5 font-mono text-[13px]">DATABASE_URL</code>).
          </p>
        </div>
      ) : !db ? (
        <div className="mt-10 rounded-[22px] border border-amber-200 bg-[color-mix(in_srgb,#fde68a_25%,var(--surface))] p-6 md:p-8">
          <p className="font-display text-lg font-semibold text-amber-950">Database not configured</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-amber-950/85">
            Add <code className="rounded-md bg-amber-100/90 px-2 py-0.5 font-mono text-[13px]">DATABASE_URL</code> from Supabase (Settings → Database → URI). Then run{' '}
            <code className="rounded-md bg-amber-100/90 px-2 py-0.5 font-mono text-[13px]">npm run db:push</code> and{' '}
            <code className="rounded-md bg-amber-100/90 px-2 py-0.5 font-mono text-[13px]">npm run db:seed</code>.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="mt-12 cin-panel rounded-[22px] p-10 text-center">
          <p className="font-display text-xl font-semibold text-[var(--foreground)]">No projects yet</p>
          <p className="mt-3 font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))]">
            Seed from your archive or create the first entry.
          </p>
          <Link
            href={`/${adminSecret}/projects/new`}
            className="mt-8 inline-flex rounded-full bg-[var(--coral)] px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_16px_50px_rgba(255,122,89,0.22)] transition-[filter] hover:brightness-105"
          >
            Create project
          </Link>
        </div>
      ) : (
        <ProjectListClient secret={adminSecret} rows={rows} />
      )}
    </>
  )
}
