import { config } from 'dotenv'
import { resolve } from 'node:path'

config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), '.env.local'), override: true })

import postgres from 'postgres'

import { normalizeDatabaseUrl } from '../lib/db/normalize-database-url'
import { getPostgresOptions } from '../lib/db/postgres-options'
import { printSupabaseDatabaseUrlHint } from '../lib/db/supabase-connection-hint'
import { getFallbackProjects } from '../lib/projects'

function printPgError(e: unknown) {
  if (e && typeof e === 'object' && 'code' in e) {
    const x = e as { code?: string; message?: string; detail?: string; hint?: string; table_name?: string; schema_name?: string }
    console.error('\n--- PostgreSQL ---')
    if (x.code) console.error('code:', x.code)
    if (x.message) console.error('message:', x.message)
    if (x.detail) console.error('detail:', x.detail)
    if (x.hint) console.error('hint:', x.hint)
    if (x.schema_name || x.table_name) console.error('object:', [x.schema_name, x.table_name].filter(Boolean).join('.'))
    console.error('------------------\n')
  }
}

async function main() {
  const url = normalizeDatabaseUrl(process.env.DATABASE_URL ?? '')
  if (!url) {
    console.error('Missing DATABASE_URL in .env.local')
    process.exit(1)
  }

  const sql = postgres(url, { ...getPostgresOptions(url), max: 1 })

  try {
    const info = await sql`
      select current_database() as db, current_user as user
    `
    const db = String(info[0]?.db ?? '')
    const user = String(info[0]?.user ?? '')

    const existsRows = await sql`
      select exists (
        select 1
        from information_schema.tables
        where table_schema = 'public'
          and table_name = 'projects'
      ) as ok
    `
    const ok = Boolean(existsRows[0]?.ok)

    if (!ok) {
      console.error(
        `Connected as ${user} to database "${db}", but table public.projects is missing.\n` +
          'Create it in Supabase → SQL Editor (see lib/db/init-projects.sql), or fix DATABASE_URL if this is the wrong project.'
      )
      process.exit(1)
    }

    const list = getFallbackProjects()

    for (let i = 0; i < list.length; i++) {
      const p = list[i]
      await sql`
        insert into public.projects (
          slug, title, subtitle, category, year, description, long_description,
          color, featured, responsibility, impact, tags, features, images,
          live, github, coming_soon, in_progress, sort_order
        )
        values (
          ${p.slug},
          ${p.title},
          ${p.subtitle},
          ${p.category},
          ${p.year},
          ${p.description},
          ${p.longDescription ?? p.description},
          ${p.color},
          ${p.featured},
          ${p.responsibility ?? null},
          ${p.impact ?? null},
          ${sql.json(p.tags)},
          ${sql.json(p.features ?? [])},
          ${sql.json(p.images ?? [])},
          ${p.live ?? null},
          ${p.github ?? null},
          ${p.comingSoon ?? false},
          ${p.inProgress ?? false},
          ${p.sortOrder ?? i}
        )
        on conflict (slug) do update set
          title = excluded.title,
          subtitle = excluded.subtitle,
          category = excluded.category,
          year = excluded.year,
          description = excluded.description,
          long_description = excluded.long_description,
          color = excluded.color,
          featured = excluded.featured,
          responsibility = excluded.responsibility,
          impact = excluded.impact,
          tags = excluded.tags,
          features = excluded.features,
          images = excluded.images,
          live = excluded.live,
          github = excluded.github,
          coming_soon = excluded.coming_soon,
          in_progress = excluded.in_progress,
          sort_order = excluded.sort_order,
          updated_at = now()
      `
    }

    console.log(`Seeded ${list.length} projects into "${db}" (upsert by slug).`)
  } catch (e) {
    const err = e as NodeJS.ErrnoException
    if (err.code === 'ENOENT' || err.code === 'ENOTFOUND') {
      printSupabaseDatabaseUrlHint()
    }
    throw e
  } finally {
    try {
      await sql.end({ timeout: 5 })
    } catch {
      /* ignore */
    }
  }
}

main().catch((e) => {
  printPgError(e)
  console.error(e)
  process.exit(1)
})
