'use client'

import Link from 'next/link'

import ProjectImageUploader from '@/components/admin/ProjectImageUploader'
import { createProjectAction, updateProjectAction } from '@/lib/admin/actions'
import type { ProjectFormDefaults } from '@/lib/admin/form-defaults'

function fieldClass() {
  return 'mt-2 w-full rounded-2xl border border-white/12 bg-black/25 px-4 py-3 font-sans text-sm text-white outline-none transition-[border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] placeholder:text-white/25 focus:border-[var(--coral)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--coral)_28%,transparent)]'
}

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
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-white/40">Identity</p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Title</span>
              <input name="title" required defaultValue={defaults.title} className={fieldClass()} />
            </label>
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Slug</span>
              <input name="slug" defaultValue={defaults.slug} placeholder="auto from title if empty" className={fieldClass()} />
            </label>
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Year</span>
              <input name="year" defaultValue={defaults.year} className={fieldClass()} />
            </label>
            <label className="block md:col-span-2">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Subtitle</span>
              <input name="subtitle" defaultValue={defaults.subtitle} className={fieldClass()} />
            </label>
            <label className="block md:col-span-2">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Category</span>
              <input name="category" defaultValue={defaults.category} className={fieldClass()} />
            </label>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-white/40">Story</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Description</span>
              <textarea name="description" required rows={5} defaultValue={defaults.description} className={`${fieldClass()} min-h-[130px] resize-y`} />
            </label>
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Long description (optional)</span>
              <textarea name="longDescription" rows={5} defaultValue={defaults.longDescription} className={`${fieldClass()} min-h-[130px] resize-y`} />
            </label>
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Responsibility</span>
              <input name="responsibility" defaultValue={defaults.responsibility} className={fieldClass()} />
            </label>
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Impact</span>
              <input name="impact" defaultValue={defaults.impact} className={fieldClass()} />
            </label>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-white/40">Links</p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Live URL</span>
              <input name="live" type="url" defaultValue={defaults.live} placeholder="https://" className={fieldClass()} />
            </label>
            <label className="block md:col-span-2">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">GitHub URL</span>
              <input name="github" type="url" defaultValue={defaults.github} placeholder="https://" className={fieldClass()} />
            </label>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-white/40">Lists</p>
          <div className="mt-6 space-y-6">
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Tech tags (comma-separated)</span>
              <input name="tags" defaultValue={defaults.tags} placeholder="Next.js, TypeScript, …" className={fieldClass()} />
            </label>
            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Features (one per line)</span>
              <textarea name="features" rows={8} defaultValue={defaults.features} className={`${fieldClass()} min-h-[180px] resize-y font-mono text-[13px]`} />
            </label>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-white/40">Media</p>
          <p className="mt-2 font-sans text-xs text-white/45">
            Upload image files (drag & drop or browse). Order is saved top-to-bottom — the first is the hero frame everywhere on the site.
            {' '}
            <span className="text-white/30">
              With <span className="font-mono text-[10px]">SUPABASE_SERVICE_ROLE_KEY</span> set, files go to Supabase Storage; otherwise they are written to{' '}
              <span className="font-mono text-[10px]">/public/uploads/portfolio</span> (ideal for local dev).
            </span>
          </p>
          <div className="mt-6">
            <ProjectImageUploader initialValue={defaults.images} />
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="font-sans text-[11px] tracking-[0.22em] uppercase text-white/40">Presentation</p>
          <div className="mt-6 space-y-6">
            <label className="flex items-center gap-3">
              <input name="featured" type="checkbox" defaultChecked={defaults.featured} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-white/75">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-3">
              <input name="comingSoon" type="checkbox" defaultChecked={defaults.comingSoon} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-white/75">Coming soon</span>
            </label>
            <label className="flex items-center gap-3">
              <input name="inProgress" type="checkbox" defaultChecked={defaults.inProgress} className="size-4 accent-[var(--coral)]" />
              <span className="font-sans text-sm text-white/75">In progress</span>
            </label>

            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Accent color (#RRGGBB)</span>
              <input name="color" defaultValue={defaults.color} placeholder="#FF7A59" className={`${fieldClass()} font-mono text-[13px]`} />
            </label>

            <label className="block">
              <span className="font-sans text-xs uppercase tracking-[0.14em] text-white/45">Sort order</span>
              <input name="sortOrder" type="number" defaultValue={defaults.sortOrder} className={fieldClass()} />
              <span className="mt-2 block font-sans text-xs text-white/35">Lower numbers appear earlier in lists.</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/${secret}`}
            className="inline-flex justify-center rounded-full border border-white/14 px-6 py-3 font-display text-sm font-semibold text-white/75 transition-colors hover:border-white/25 hover:text-white"
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
