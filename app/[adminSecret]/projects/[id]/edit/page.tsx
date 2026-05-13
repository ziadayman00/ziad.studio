import Link from 'next/link'
import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'

import PanelChrome from '@/components/admin/PanelChrome'
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
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <PanelChrome secret={adminSecret} title="Edit project" subtitle={`Editing “${project.title}”.`} />

        <div className="mt-12">
          <Link href={`/${adminSecret}`} className="font-sans text-xs uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white">
            ← Back to list
          </Link>
        </div>

        <div className="mt-10">
          <ProjectForm secret={adminSecret} mode="edit" projectId={project.id} defaults={projectToFormDefaults(project)} />
        </div>
      </div>
    </div>
  )
}
