import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ProjectForm from '@/components/admin/ProjectForm'
import { projectToFormDefaults } from '@/lib/admin/form-defaults'
import { requireAdmin } from '@/lib/admin/panel'
import { ensureProjectsSchemaIfNeeded } from '@/lib/db/ensure-schema'
import { getDb } from '@/lib/db'
import { projects as projectsTable } from '@/lib/db/schema'
import { type Project, getProjectById } from '@/lib/projects'

type Props = {
  params: Promise<{ adminSecret: string; id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { adminSecret, id: rawId } = await params
  await requireAdmin(adminSecret)

  const id = Number.parseInt(rawId, 10)
  if (!Number.isFinite(id)) notFound()

  await ensureProjectsSchemaIfNeeded()
  const db = getDb()
  let project: Project | null = null

  if (db) {
    const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1)
    const row = rows[0]
    if (row) {
      project = {
        id: row.id,
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle,
        category: row.category,
        year: row.year,
        description: row.description,
        longDescription: row.longDescription ?? row.description,
        tags: row.tags ?? [],
        color: row.color,
        featured: row.featured,
        sortOrder: row.sortOrder,
        responsibility: row.responsibility ?? undefined,
        impact: row.impact ?? undefined,
        features: row.features ?? [],
        images: row.images ?? [],
        live: row.live ?? undefined,
        github: row.github ?? undefined,
        comingSoon: row.comingSoon,
        inProgress: row.inProgress,
      }
    }
  } else {
    project = await getProjectById(id)
  }

  if (!project) notFound()

  return (
    <>
      <AdminPageHeader
        title="Edit project"
        subtitle={`Editing “${project.title}”.`}
        actions={
          <Link
            href={`/${adminSecret}`}
            className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
          >
            ← Overview
          </Link>
        }
      />

      <div className="mt-10">
        <ProjectForm secret={adminSecret} mode="edit" projectId={project.id} defaults={projectToFormDefaults(project)} />
      </div>
    </>
  )
}
