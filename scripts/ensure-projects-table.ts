import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { config } from 'dotenv'
import postgres from 'postgres'

import { normalizeDatabaseUrl } from '../lib/db/normalize-database-url'
import { getPostgresOptions } from '../lib/db/postgres-options'
import { printSupabaseDatabaseUrlHint } from '../lib/db/supabase-connection-hint'

config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), '.env.local'), override: true })

const url = normalizeDatabaseUrl(process.env.DATABASE_URL ?? '')
if (!url) {
  console.error('Missing DATABASE_URL in .env.local or .env')
  process.exit(1)
}

const sqlPath = resolve(process.cwd(), 'lib/db/init-projects.sql')
const ddl = readFileSync(sqlPath, 'utf8')

async function main() {
  const db = postgres(url, { ...getPostgresOptions(url), max: 1 })
  try {
    await db.unsafe(ddl)
    console.log('Table "projects" is ready (ran lib/db/init-projects.sql).')
  } finally {
    await db.end({ timeout: 5 })
  }
}

main().catch((e: unknown) => {
  const err = e as NodeJS.ErrnoException & { hostname?: string }
  if (err.code === 'ENOENT' || err.code === 'ENOTFOUND') {
    printSupabaseDatabaseUrlHint()
    if (err.hostname) console.error(`Failed host: ${err.hostname}\n`)
  }
  console.error(e)
  process.exit(1)
})
