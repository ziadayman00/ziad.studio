'use client'

import Link from 'next/link'

import ProjectImageUploader from '@/components/admin/ProjectImageUploader'
import { adminCard, adminField, adminLabel } from '@/components/admin/ui-classes'
import { createProjectAction, updateProjectAction } from '@/lib/admin/actions'
import type { ProjectFormDefaults } from '@/lib/admin/form-defaults'

export default function ProjectForm({
  secret,
  mode,
  projectId,
  defaults,
}: {
  secret: string
  mode: 'create' | 'edit'
  projectId?: number
  defaults: ProjectFormDefaults
}) {
  const action =
    mode === 'create'
      ? createProjectAction.bind(null, secret)
      : updateProjectAction.bind(null, secret, projectId ?? 0)

  return (
    <form action={action} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7 space-y-8">
        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Identity</p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className={adminLabel}>Title</span>
              <input name="title" required defaultValue={defaults.title} className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Slug</span>
              <input name="slug" defaultValue={defaults.slug} placeholder="auto from title if empty" className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Year</span>
              <input name="year" defaultValue={defaults.year} className={adminField} />
            </label>
            <label className="block md:col-span-2">
              <span className={adminLabel}>Subtitle</span>
              <input name="subtitle" defaultValue={defaults.subtitle} className={adminField} />
            </label>
            <label className="block md:col-span-2">
              <span className={adminLabel}>Category</span>
              <input name="category" defaultValue={defaults.category} className={adminField} />
            </label>
          </div>
        </div>

        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Story</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <span className={adminLabel}>Description</span>
              <textarea name="description" required rows={5} defaultValue={defaults.description} className={`${adminField} min-h-[130px] resize-y`} />
            </label>
            <label className="block">
              <span className={adminLabel}>Long description (optional)</span>
              <textarea name="longDescription" rows={5} defaultValue={defaults.longDescription} className={`${adminField} min-h-[130px] resize-y`} />
            </label>
            <label className="block">
              <span className={adminLabel}>Responsibility</span>
              <input name="responsibility" defaultValue={defaults.responsibility} className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Impact</span>
              <input name="impact" defaultValue={defaults.impact} className={adminField} />
            </label>
          </div>
        </div>

        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Links</p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className={adminLabel}>Live URL</span>
              <input name="live" type="url" defaultValue={defaults.live} placeholder="https://" className={adminField} />
            </label>
            <label className="block md:col-span-2">
              <span className={adminLabel}>GitHub URL</span>
              <input name="github" type="url" defaultValue={defaults.github} placeholder="https://" className={adminField} />
            </label>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Lists</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <span className={adminLabel}>Tech tags (comma-separated)</span>
              <input name="tags" defaultValue={defaults.tags} placeholder="Next.js, TypeScript, …" className={adminField} />
            </label>
            <label className="block">
              <span className={adminLabel}>Features (one per line)</span>
              <textarea name="features" rows={8} defaultValue={defaults.features} className={`${adminField} min-h-[180px] resize-y font-mono text-[13px]`} />
            </label>
          </div>
        </div>

        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Media</p>
          <p className="mt-2 font-sans text-xs text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))]">
            Upload image files (drag & drop or browse). Order is saved top-to-bottom — the first is the hero frame everywhere on the site.
            {' '}
            <span className="text-[color-mix(in_srgb,var(--lavender)_95%,transparent)]">
              With <span className="font-mono text-[10px]">SUPABASE_SERVICE_ROLE_KEY</span> set, files go to Supabase Storage; otherwise they are written to{' '}
              <span className="font-mono text-[10px]">/public/uploads/portfolio</span> (ideal for local dev).
            </span>
          </p>
          <div className="mt-6">
            <ProjectImageUploader initialValue={defaults.images} />
          </div>
        </div>

        <div className={adminCard}>
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">Presentation</p>
          <div className="mt-6 space-y-6">
            <label className="flex items-center gap-3">
              <input name="featured" type="checkbox" defaultChecked={defaults.featured} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-[var(--foreground)]">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-3">
              <input name="comingSoon" type="checkbox" defaultChecked={defaults.comingSoon} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-[var(--foreground)]">Coming soon</span>
            </label>
            <label className="flex items-center gap-3">
              <input name="inProgress" type="checkbox" defaultChecked={defaults.inProgress} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-[var(--foreground)]">In progress</span>
            </label>

            <label className="block">
              <span className={adminLabel}>Accent color (#RRGGBB)</span>
              <input name="color" defaultValue={defaults.color} placeholder="#FF7A59" className={`${adminField} font-mono text-[13px]`} />
            </label>

            <label className="block">
              <span className={adminLabel}>Sort order</span>
              <input name="sortOrder" type="number" defaultValue={defaults.sortOrder} className={adminField} />
              <span className="mt-2 block font-sans text-xs text-[color-mix(in_srgb,var(--foreground)_40%,var(--lavender))]">Lower numbers appear earlier in lists.</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/${secret}`}
            className="inline-flex justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3 font-display text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex justify-center rounded-full bg-[var(--coral)] px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_16px_50px_rgba(255,122,89,0.22)] transition-[transform,opacity] duration-500 ease-[var(--ease-out-expo)] hover:brightness-105 active:scale-[0.98]"
          >
            {mode === 'create' ? 'Publish project' : 'Save changes'}
          </button>
        </div>
      </div>
    </form>
  )
}
