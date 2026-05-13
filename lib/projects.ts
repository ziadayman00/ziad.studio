import { asc, eq } from 'drizzle-orm'

import raw from '@/projects.json'

import { getDb } from '@/lib/db'
import { ensureProjectsSchemaIfNeeded } from '@/lib/db/ensure-schema'
import type { ProjectRow } from '@/lib/db/schema'
import { projects as projectsTable } from '@/lib/db/schema'
import { slugify } from '@/lib/slug'

export type Project = {
  id: number
  slug: string
  title: string
  subtitle: string
  category: string
  year: string
  description: string
  longDescription: string
  tags: string[]
  color: string
  featured: boolean
  sortOrder?: number
  responsibility?: string
  impact?: string
  features?: string[]
  images?: string[]
  live?: string
  github?: string
  comingSoon?: boolean
  inProgress?: boolean
}

type RawProject = {
  title: string
  subtitle: string
  year: string
  sector: string
  responsibility?: string
  impact?: string
  tech: string[]
  description: string
  features?: string[]
  images?: string[]
  live?: string
  github?: string
  comingSoon?: boolean
  inProgress?: boolean
}

const palette = ['#FF7A59', '#6EA8FE', '#8D8BA7', '#D67E6D', '#8AA2D4', '#B286A7']

const featuredProjects = (raw.featuredProjects as RawProject[]).map((p, i) => ({
  id: i + 1,
  sortOrder: i,
  slug: slugify(p.title),
  title: p.title,
  subtitle: p.subtitle,
  category: p.sector,
  year: p.year,
  description: p.description,
  longDescription: p.description,
  tags: p.tech,
  color: palette[i % palette.length],
  featured: true,
  responsibility: p.responsibility,
  impact: p.impact,
  features: p.features ?? [],
  images: p.images ?? [],
  live: p.live,
  github: p.github,
  comingSoon: p.comingSoon ?? false,
  inProgress: p.inProgress ?? false,
}))

const webProjects = (raw.webProjects as RawProject[]).map((p, i) => ({
  id: featuredProjects.length + i + 1,
  sortOrder: featuredProjects.length + i,
  slug: slugify(p.title),
  title: p.title,
  subtitle: p.subtitle,
  category: p.sector,
  year: p.year,
  description: p.description,
  longDescription: p.description,
  tags: p.tech,
  color: palette[(i + 2) % palette.length],
  featured: false,
  images: p.images ?? [],
  live: p.live,
  github: p.github,
  comingSoon: p.comingSoon ?? false,
  inProgress: p.inProgress ?? false,
}))

/** Static fallback when `DATABASE_URL` is unset or the database is empty / unreachable. */
export function getFallbackProjects(): Project[] {
  return [...featuredProjects, ...webProjects]
}

/** Dashboard rows first; then `projects.json` entries whose slug is not already in the DB. */
function mergeDbProjectsWithSeed(dbProjects: Project[], seedProjects: Project[]): Project[] {
  const dbSlugs = new Set(dbProjects.map((p) => p.slug))
  const maxId = dbProjects.reduce((m, p) => Math.max(m, p.id), 0)
  let nextId = maxId + 1
  const extras = seedProjects
    .filter((p) => !dbSlugs.has(p.slug))
    .map((p) => ({ ...p, id: nextId++ }))
  return [...dbProjects, ...extras]
}

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    sortOrder: row.sortOrder,
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

export async function getProjects(): Promise<Project[]> {
  await ensureProjectsSchemaIfNeeded()
  const seed = getFallbackProjects()
  const db = getDb()
  if (!db) return seed
  try {
    const rows = await db
      .select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.sortOrder), asc(projectsTable.id))
    if (rows.length === 0) return seed
    return mergeDbProjectsWithSeed(rows.map(rowToProject), seed)
  } catch {
    return seed
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  await ensureProjectsSchemaIfNeeded()
  const normalized = decodeURIComponent(slug || '')
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')

  const fallback = () =>
    getFallbackProjects().find(
      (p) =>
        p.slug === normalized ||
        p.slug === normalized.replace(/\/+$/, '') ||
        p.slug === normalized.replace(/^\/+/, '')
    ) ?? null

  const db = getDb()
  if (!db) return fallback()

  try {
    const rows = await db.select().from(projectsTable).where(eq(projectsTable.slug, normalized)).limit(1)
    const row = rows[0]
    if (!row) return fallback()
    return rowToProject(row)
  } catch {
    return fallback()
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  await ensureProjectsSchemaIfNeeded()
  const db = getDb()
  if (!db) return getFallbackProjects().find((p) => p.id === id) ?? null
  try {
    const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, id)).limit(1)
    const row = rows[0]
    return row ? rowToProject(row) : null
  } catch {
    return null
  }
}
