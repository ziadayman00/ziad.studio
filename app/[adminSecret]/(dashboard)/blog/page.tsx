import Link from 'next/link'
import { desc } from 'drizzle-orm'

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import DeleteBlogPostButton from '@/components/admin/DeleteBlogPostButton'
import { requireAdmin } from '@/lib/admin/panel'
import { formatDbError } from '@/lib/db/format-error'
import { ensureBlogSchemaIfNeeded } from '@/lib/db/ensure-schema'
import { getDb } from '@/lib/db'
import type { BlogPostRow } from '@/lib/db/schema'
import { blogPosts as blogPostsTable } from '@/lib/db/schema'

type Props = { params: Promise<{ adminSecret: string }> }

export default async function AdminBlogListPage({ params }: Props) {
  const { adminSecret } = await params
  await requireAdmin(adminSecret)

  await ensureBlogSchemaIfNeeded()
  const db = getDb()
  let rows: BlogPostRow[] = []
  let dbError: string | null = null

  if (db) {
    try {
      rows = await db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.updatedAt))
    } catch (e) {
      console.error('[admin] blog list failed', e)
      dbError = formatDbError(e)
    }
  }

  return (
    <>
      <AdminPageHeader
        title="Blog"
        subtitle="Draft and publish posts. When published, they appear on the public blog index and get a shareable URL."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${adminSecret}`}
              className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
            >
              ← Overview
            </Link>
            <Link
              href={`/${adminSecret}/blog/new`}
              className="rounded-full bg-[var(--coral)] px-6 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_40px_rgba(255,122,89,0.2)] transition-[filter] hover:brightness-105"
            >
              New post
            </Link>
          </div>
        }
      />

      {dbError ? (
        <div className="mt-10 rounded-[22px] border border-red-200 bg-[color-mix(in_srgb,#fecaca_22%,var(--surface))] p-6">
          <p className="font-display font-semibold text-red-900">Could not load posts</p>
          <p className="mt-2 font-mono text-xs text-red-800/90">{dbError}</p>
        </div>
      ) : !db ? (
        <div className="mt-10 rounded-[22px] border border-amber-200 bg-[color-mix(in_srgb,#fde68a_25%,var(--surface))] p-6">
          <p className="font-display font-semibold text-amber-950">Database not configured</p>
          <p className="mt-2 font-sans text-sm text-amber-950/85">Add DATABASE_URL to use the blog CMS.</p>
        </div>
      ) : rows.length === 0 ? (
        <div className="cin-panel mt-12 rounded-[22px] p-10 text-center">
          <p className="font-display text-xl font-semibold text-[var(--foreground)]">No posts yet</p>
          <p className="mt-3 font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))]">Write the first note — it can stay a draft until you publish.</p>
          <Link
            href={`/${adminSecret}/blog/new`}
            className="mt-8 inline-flex rounded-full bg-[var(--coral)] px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_16px_50px_rgba(255,122,89,0.22)]"
          >
            New post
          </Link>
        </div>
      ) : (
        <ul className="mt-10 space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className="cin-panel flex flex-col gap-4 rounded-[20px] p-4 md:flex-row md:items-center md:justify-between md:p-5"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-bold text-[var(--foreground)]">{row.title}</span>
                  {row.published ? (
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--blue)_12%,transparent)] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--blue)]">
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--lavender)]">
                      Draft
                    </span>
                  )}
                  {row.featured ? (
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] px-2.5 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--coral-dark)]">
                      Featured
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 font-mono text-[12px] text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))]">{row.slug}</p>
                <p className="mt-2 line-clamp-2 font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))]">{row.excerpt}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {row.published ? (
                  <Link
                    href={`/blog/${row.slug}`}
                    className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
                  >
                    View live
                  </Link>
                ) : null}
                <Link
                  href={`/${adminSecret}/blog/${row.id}/edit`}
                  className="rounded-full bg-[var(--graphite)] px-5 py-2 font-display text-xs font-semibold uppercase tracking-[0.12em] text-white transition-[filter] hover:brightness-110"
                >
                  Edit
                </Link>
                <DeleteBlogPostButton secret={adminSecret} id={row.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
