import { and, count, desc, eq } from 'drizzle-orm'

import { getDb } from '@/lib/db'
import { ensureBlogSchemaIfNeeded } from '@/lib/db/ensure-schema'
import { blogPosts } from '@/lib/db/schema'
import type { BlogPostRow } from '@/lib/db/schema'

function publishedFilter(category?: string | null) {
  const c = category?.trim()
  if (c) return and(eq(blogPosts.published, true), eq(blogPosts.category, c))
  return eq(blogPosts.published, true)
}

export async function getPublishedBlogPosts(): Promise<BlogPostRow[]> {
  await ensureBlogSchemaIfNeeded()
  const db = getDb()
  if (!db) return []
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(publishedFilter())
      .orderBy(desc(blogPosts.featured), desc(blogPosts.publishedAt), desc(blogPosts.id))
  } catch (e) {
    console.error('[blog] getPublishedBlogPosts', e)
    return []
  }
}

/** Paged list for `/blog` — featured first, then newest. */
export async function getPublishedBlogPostsPage(options: {
  page: number
  pageSize: number
  category?: string | null
}): Promise<BlogPostRow[]> {
  await ensureBlogSchemaIfNeeded()
  const db = getDb()
  if (!db) return []
  const page = Math.max(1, Math.floor(options.page))
  const pageSize = Math.min(48, Math.max(1, Math.floor(options.pageSize)))
  const offset = (page - 1) * pageSize
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(publishedFilter(options.category))
      .orderBy(desc(blogPosts.featured), desc(blogPosts.publishedAt), desc(blogPosts.id))
      .limit(pageSize)
      .offset(offset)
  } catch (e) {
    console.error('[blog] getPublishedBlogPostsPage', e)
    return []
  }
}

export async function countPublishedBlogPosts(category?: string | null): Promise<number> {
  await ensureBlogSchemaIfNeeded()
  const db = getDb()
  if (!db) return 0
  try {
    const rows = await db.select({ n: count() }).from(blogPosts).where(publishedFilter(category))
    return Number(rows[0]?.n ?? 0)
  } catch (e) {
    console.error('[blog] countPublishedBlogPosts', e)
    return 0
  }
}

export async function getPublishedBlogCategories(): Promise<string[]> {
  await ensureBlogSchemaIfNeeded()
  const db = getDb()
  if (!db) return []
  try {
    const rows = await db.select({ category: blogPosts.category }).from(blogPosts).where(publishedFilter())
    return [...new Set(rows.map((r) => r.category).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  } catch (e) {
    console.error('[blog] getPublishedBlogCategories', e)
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostRow | null> {
  await ensureBlogSchemaIfNeeded()
  const db = getDb()
  if (!db) return null
  try {
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1)
    const row = rows[0]
    if (!row?.published) return null
    return row
  } catch (e) {
    console.error('[blog] getBlogPostBySlug', e)
    return null
  }
}
