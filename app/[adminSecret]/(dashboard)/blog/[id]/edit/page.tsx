import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import BlogForm from '@/components/admin/BlogForm'
import { rowToBlogDefaults } from '@/lib/admin/blog-form-defaults'
import { requireAdmin } from '@/lib/admin/panel'
import { ensureBlogSchemaIfNeeded } from '@/lib/db/ensure-schema'
import { getDb } from '@/lib/db'
import { blogPosts as blogPostsTable } from '@/lib/db/schema'

type Props = { params: Promise<{ adminSecret: string; id: string }> }

export default async function AdminBlogEditPage({ params }: Props) {
  const { adminSecret, id: rawId } = await params
  await requireAdmin(adminSecret)

  const id = Number.parseInt(rawId, 10)
  if (!Number.isFinite(id)) notFound()

  await ensureBlogSchemaIfNeeded()
  const db = getDb()
  if (!db) notFound()

  const rows = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id)).limit(1)
  const row = rows[0]
  if (!row) notFound()

  return (
    <>
      <AdminPageHeader
        title="Edit post"
        subtitle={`Editing “${row.title}”.`}
        actions={
          <Link
            href={`/${adminSecret}/blog`}
            className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]"
          >
            ← All posts
          </Link>
        }
      />
      <div className="mt-10">
        <BlogForm secret={adminSecret} mode="edit" postId={row.id} defaults={rowToBlogDefaults(row)} />
      </div>
    </>
  )
}
