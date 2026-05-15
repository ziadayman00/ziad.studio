'use client'

import Link from 'next/link'

import { adminCard, adminField, adminLabel } from '@/components/admin/ui-classes'
import { createBlogPostAction, updateBlogPostAction } from '@/lib/admin/actions'
import type { BlogFormDefaults } from '@/lib/admin/blog-form-defaults'

export default function BlogForm({
  secret,
  mode,
  postId,
  defaults,
}: {
  secret: string
  mode: 'create' | 'edit'
  postId?: number
  defaults: BlogFormDefaults
}) {
  const action =
    mode === 'create'
      ? createBlogPostAction.bind(null, secret)
      : updateBlogPostAction.bind(null, secret, postId ?? 0)

  return (
    <form action={action} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
      <div className="space-y-8 lg:col-span-7">
        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Article</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <span className={adminLabel}>Title</span>
              <input name="title" required defaultValue={defaults.title} className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Slug</span>
              <input name="slug" defaultValue={defaults.slug} placeholder="auto from title if empty" className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Excerpt</span>
              <textarea name="excerpt" required rows={3} defaultValue={defaults.excerpt} className={`${adminField} min-h-[88px] resize-y`} />
            </label>
            <label className="block">
              <span className={adminLabel}>Body</span>
              <textarea name="content" required rows={16} defaultValue={defaults.content} className={`${adminField} min-h-[280px] resize-y font-mono text-[13px] leading-relaxed`} />
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-8 lg:col-span-5">
        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Meta</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <span className={adminLabel}>Category</span>
              <input name="category" defaultValue={defaults.category} className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Tags (comma-separated)</span>
              <input name="tags" defaultValue={defaults.tags} placeholder="Next.js, Design, …" className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Cover image URL (optional)</span>
              <input name="coverImage" type="url" defaultValue={defaults.coverImage} placeholder="https://" className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Reading time (minutes)</span>
              <input name="readingTime" type="number" min={1} max={120} defaultValue={defaults.readingTime} className={adminField} />
            </label>

            <label className="flex items-center gap-3">
              <input name="published" type="checkbox" defaultChecked={defaults.published} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-[var(--foreground)]">Published on /blog</span>
            </label>
            <label className="flex items-center gap-3">
              <input name="featured" type="checkbox" defaultChecked={defaults.featured} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-[var(--foreground)]">Featured placement</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/${secret}/blog`}
            className="inline-flex justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3 font-display text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center rounded-full bg-[var(--coral)] px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_16px_50px_rgba(255,122,89,0.22)] transition-[transform,filter] duration-500 ease-[var(--ease-out-expo)] hover:brightness-105 active:scale-[0.98]"
          >
            {mode === 'create' ? 'Create post' : 'Save post'}
          </button>
        </div>
      </div>
    </form>
  )
}
