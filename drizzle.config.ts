import { config } from 'dotenv'
import { resolve } from 'node:path'
import { defineConfig } from 'drizzle-kit'

import { normalizeDatabaseUrl } from './lib/db/normalize-database-url'

// `.env.local` must win over machine-level `DATABASE_URL` (dotenv default does not override).
config({ path: resolve(process.cwd(), '.env') })
config({ path: resolve(process.cwd(), '.env.local'), override: true })

// Prefer DIRECT_URL for drizzle-kit (matches Supabase “migrations” connection); else pooled DATABASE_URL.
const migrationUrl =
  normalizeDatabaseUrl(process.env.DIRECT_URL ?? '') ||
  normalizeDatabaseUrl(process.env.DATABASE_URL ?? '')

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: migrationUrl,
  },
})
