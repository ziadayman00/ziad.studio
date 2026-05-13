import { max } from 'drizzle-orm'

import { getDb } from '@/lib/db'
import { ensureProjectsSchemaIfNeeded } from '@/lib/db/ensure-schema'
import { projects as projectsTable } from '@/lib/db/schema'

/** Next `sort_order` for new rows (server-only helper). */
export async function nextSortOrder(): Promise<number> {
  await ensureProjectsSchemaIfNeeded()
  const db = getDb()
  if (!db) return 0
  const rows = await db.select({ m: max(projectsTable.sortOrder) }).from(projectsTable)
  const v = rows[0]?.m
  const n = v == null ? -1 : typeof v === 'number' ? v : Number(v)
  return (Number.isFinite(n) ? n : -1) + 1
}
