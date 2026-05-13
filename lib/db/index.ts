import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'
import { resetProjectsSchemaCache } from './ensure-schema'
import { normalizeDatabaseUrl } from './normalize-database-url'
import { getPostgresOptions } from './postgres-options'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle<typeof schema>> | undefined
  sql: ReturnType<typeof postgres> | undefined
  dbUrl: string | undefined
}

export function getDb() {
  const url = normalizeDatabaseUrl(process.env.DATABASE_URL ?? '')
  if (!url) return null

  if (globalForDb.dbUrl !== url && globalForDb.sql) {
    void globalForDb.sql.end({ timeout: 5 }).catch(() => {})
    globalForDb.sql = undefined
    globalForDb.db = undefined
    resetProjectsSchemaCache()
  }

  if (!globalForDb.db) {
    const sql = postgres(url, {
      ...getPostgresOptions(url),
      connection: { application_name: 'ziad-studio-next' },
    })
    globalForDb.sql = sql
    globalForDb.db = drizzle(sql, { schema })
    globalForDb.dbUrl = url
  }

  return globalForDb.db
}
