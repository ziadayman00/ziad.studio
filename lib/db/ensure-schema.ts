import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import postgres from 'postgres'

import { normalizeDatabaseUrl } from './normalize-database-url'
import { getPostgresOptions } from './postgres-options'

/** Inline fallback if init-projects.sql is missing from the deployment bundle */
const FALLBACK_DDL = `
CREATE TABLE IF NOT EXISTS "projects" (
  "id" serial PRIMARY KEY NOT NULL,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "subtitle" text NOT NULL DEFAULT '',
  "category" text NOT NULL,
  "year" text NOT NULL,
  "description" text NOT NULL,
  "long_description" text,
  "color" text NOT NULL,
  "featured" boolean NOT NULL DEFAULT false,
  "responsibility" text,
  "impact" text,
  "tags" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "features" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "images" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "live" text,
  "github" text,
  "coming_soon" boolean NOT NULL DEFAULT false,
  "in_progress" boolean NOT NULL DEFAULT false,
  "sort_order" integer NOT NULL DEFAULT 0,
  "created_at" timestamptz DEFAULT now(),
  "updated_at" timestamptz DEFAULT now()
);
`

let ensureLock: Promise<void> | null = null
let schemaReady = false

/**
 * Creates `public.projects` if missing (same DDL as lib/db/init-projects.sql).
 * Uses a short-lived connection so it does not clash with the singleton pool in getDb().
 * Safe to call from every server request; work is skipped once the table exists.
 */
export async function ensureProjectsSchemaIfNeeded(): Promise<void> {
  if (schemaReady) return
  if (ensureLock) return ensureLock

  ensureLock = (async () => {
    try {
      const raw = process.env.DATABASE_URL ?? ''
      const url = normalizeDatabaseUrl(raw)
      if (!url) return

      const sql = postgres(url, { ...getPostgresOptions(url), max: 1 })
      try {
        const rows = await sql<{ ok: boolean }[]>`
          select exists (
            select 1 from information_schema.tables
            where table_schema = 'public' and table_name = 'projects'
          ) as ok
        `
        if (rows[0]?.ok) {
          schemaReady = true
          return
        }

        const ddlPath = join(process.cwd(), 'lib/db/init-projects.sql')
        let ddl: string
        try {
          ddl = readFileSync(ddlPath, 'utf8')
        } catch {
          ddl = FALLBACK_DDL
        }
        await sql.unsafe(ddl)
        schemaReady = true
      } finally {
        await sql.end({ timeout: 5 }).catch(() => {})
      }
    } catch (e) {
      console.error('[db] ensureProjectsSchemaIfNeeded failed', e)
      schemaReady = false
    } finally {
      ensureLock = null
    }
  })()

  return ensureLock
}

/** Call after env hot-reload in dev if DATABASE_URL changes */
export function resetProjectsSchemaCache() {
  schemaReady = false
}
