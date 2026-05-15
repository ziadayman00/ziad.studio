import Link from 'next/link'

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import BlogForm from '@/components/admin/BlogForm'
import { emptyBlogDefaults } from '@/lib/admin/blog-form-defaults'
import { requireAdmin } from '@/lib/admin/panel'

type Props = { params: Promise<{ adminSecret: string }> }

export default async function AdminBlogNewPage({ params }: Props) {
  const { adminSecret } = await params
  await requireAdmin(adminSecret)

  return (
    <>
      <AdminPageHeader
        title="New post"
        subtitle="Write in plain text or Markdown-style line breaks; the public article page renders paragraphs cleanly."
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
        <BlogForm secret={adminSecret} mode="create" defaults={emptyBlogDefaults()} />
      </div>
    </>
  )
}
