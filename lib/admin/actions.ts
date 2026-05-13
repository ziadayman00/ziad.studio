'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { eq, ne } from 'drizzle-orm'

import { assertPanelSecret } from '@/lib/admin/panel'
import { clearAdminSession, getAdminSession, setAdminSession } from '@/lib/auth/admin-session'
import { getDb } from '@/lib/db'
import { ensureProjectsSchemaIfNeeded } from '@/lib/db/ensure-schema'
import { projects as projectsTable } from '@/lib/db/schema'
import { slugify } from '@/lib/slug'

const PALETTE = ['#FF7A59', '#6EA8FE', '#8D8BA7', '#D67E6D', '#8AA2D4', '#B286A7']

function pickColor(sortOrder: number) {
  return PALETTE[Math.abs(sortOrder) % PALETTE.length]
}

async function auth(secret: string) {
  assertPanelSecret(secret)
  if (!(await getAdminSession())) throw new Error('Unauthorized')
}

function splitLines(s: string) {
  return s
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)
}

function splitComma(s: string) {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
}

function normalizeUrl(v: string | undefined) {
  const t = (v ?? '').trim()
  if (!t || t === '#') return null
  return t
}

export async function loginAction(secret: string, _prev: unknown, formData: FormData) {
  assertPanelSecret(secret)
  const pw = String(formData.get('password') ?? '')
  if (!process.env.ADMIN_PASSWORD || pw !== process.env.ADMIN_PASSWORD) {
    return { error: 'Wrong password.' }
  }
  await setAdminSession()
  redirect(`/${secret}`)
}

export async function logoutAction(secret: string, formData?: FormData) {
  void formData
  assertPanelSecret(secret)
  await clearAdminSession()
  redirect(`/${secret}/login`)
}

export async function createProjectAction(secret: string, formData: FormData) {
  try {
    await auth(secret)
  } catch {
    redirect(`/${secret}/login`)
  }

  await ensureProjectsSchemaIfNeeded()
  const db = getDb()
  if (!db) redirect(`/${secret}`)

  const title = String(formData.get('title') ?? '').trim()
  if (!title) redirect(`/${secret}/projects/new`)

  let slug = String(formData.get('slug') ?? '').trim()
  if (!slug) slug = slugify(title)
  else slug = slugify(slug)

  const subtitle = String(formData.get('subtitle') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim() || 'General'
  const year = String(formData.get('year') ?? '').trim() || String(new Date().getFullYear())
  const description = String(formData.get('description') ?? '').trim()
  if (!description) redirect(`/${secret}/projects/new`)

  const longDescription = String(formData.get('longDescription') ?? '').trim() || description
  const responsibility = String(formData.get('responsibility') ?? '').trim() || null
  const impact = String(formData.get('impact') ?? '').trim() || null

  const tags = splitComma(String(formData.get('tags') ?? ''))
  const features = splitLines(String(formData.get('features') ?? ''))
  const images = splitLines(String(formData.get('images') ?? ''))

  const live = normalizeUrl(String(formData.get('live') ?? ''))
  const github = normalizeUrl(String(formData.get('github') ?? ''))

  const featured = formData.get('featured') === 'on'
  const comingSoon = formData.get('comingSoon') === 'on'
  const inProgress = formData.get('inProgress') === 'on'

  const sortOrderRaw = Number.parseInt(String(formData.get('sortOrder') ?? ''), 10)
  const sortOrder = Number.isFinite(sortOrderRaw) ? sortOrderRaw : 0

  let color = String(formData.get('color') ?? '').trim()
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) color = pickColor(sortOrder)

  let uniqueSlug = slug
  for (let bump = 0; bump < 12; bump++) {
    const exists = await db.select({ id: projectsTable.id }).from(projectsTable).where(eq(projectsTable.slug, uniqueSlug)).limit(1)
    if (exists.length === 0) break
    uniqueSlug = `${slug}-${bump + 2}`
  }

  await db.insert(projectsTable).values({
    slug: uniqueSlug,
    title,
    subtitle,
    category,
    year,
    description,
    longDescription,
    color,
    featured,
    responsibility,
    impact,
    tags,
    features,
    images,
    live,
    github,
    comingSoon,
    inProgress,
    sortOrder,
  })

  revalidatePath('/')
  revalidatePath('/work')
  revalidatePath(`/work/${uniqueSlug}`)
  redirect(`/${secret}`)
}

export async function updateProjectAction(secret: string, id: number, formData: FormData) {
  try {
    await auth(secret)
  } catch {
    redirect(`/${secret}/login`)
  }

  await ensureProjectsSchemaIfNeeded()
  const db = getDb()
  if (!db) redirect(`/${secret}`)

  const title = String(formData.get('title') ?? '').trim()
  if (!title) redirect(`/${secret}/projects/${id}/edit`)

  let slug = String(formData.get('slug') ?? '').trim()
  slug = slug ? slugify(slug) : slugify(title)

  const subtitle = String(formData.get('subtitle') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim() || 'General'
  const year = String(formData.get('year') ?? '').trim() || String(new Date().getFullYear())
  const description = String(formData.get('description') ?? '').trim()
  if (!description) redirect(`/${secret}/projects/${id}/edit`)

  const longDescription = String(formData.get('longDescription') ?? '').trim() || description
  const responsibility = String(formData.get('responsibility') ?? '').trim() || null
  const impact = String(formData.get('impact') ?? '').trim() || null

  const tags = splitComma(String(formData.get('tags') ?? ''))
  const features = splitLines(String(formData.get('features') ?? ''))
  const images = splitLines(String(formData.get('images') ?? ''))

  const live = normalizeUrl(String(formData.get('live') ?? ''))
  const github = normalizeUrl(String(formData.get('github') ?? ''))

  const featured = formData.get('featured') === 'on'
  const comingSoon = formData.get('comingSoon') === 'on'
  const inProgress = formData.get('inProgress') === 'on'

  const sortOrderRaw = Number.parseInt(String(formData.get('sortOrder') ?? ''), 10)
  const sortOrder = Number.isFinite(sortOrderRaw) ? sortOrderRaw : 0

  let color = String(formData.get('color') ?? '').trim()
  if (!/^#[0-9A-Fa-f]{6}$/.test(color)) color = pickColor(sortOrder)

  const others = await db
    .select({ slug: projectsTable.slug })
    .from(projectsTable)
    .where(ne(projectsTable.id, id))
    .limit(500)

  const taken = new Set(others.map((r) => r.slug))
  let uniqueSlug = slug
  let bump = 0
  while (taken.has(uniqueSlug)) {
    bump += 1
    uniqueSlug = `${slug}-${bump + 1}`
    if (bump > 40) break
  }

  await db
    .update(projectsTable)
    .set({
      slug: uniqueSlug,
      title,
      subtitle,
      category,
      year,
      description,
      longDescription,
      color,
      featured,
      responsibility,
      impact,
      tags,
      features,
      images,
      live,
      github,
      comingSoon,
      inProgress,
      sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.id, id))

  revalidatePath('/')
  revalidatePath('/work')
  revalidatePath(`/work/${uniqueSlug}`)
  redirect(`/${secret}`)
}

export async function deleteProjectAction(secret: string, id: number, formData?: FormData) {
  void formData
  try {
    await auth(secret)
  } catch {
    redirect(`/${secret}/login`)
  }

  await ensureProjectsSchemaIfNeeded()
  const db = getDb()
  if (!db) redirect(`/${secret}`)

  await db.delete(projectsTable).where(eq(projectsTable.id, id))

  revalidatePath('/')
  revalidatePath('/work')
  redirect(`/${secret}`)
}
