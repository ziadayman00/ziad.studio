type Pgish = Error & {
  code?: string
  detail?: string
  hint?: string
  schema_name?: string
  table_name?: string
  column_name?: string
  cause?: unknown
}

function appendPgFields(parts: string[], any: Pgish) {
  if (any.code) parts.push(`PostgreSQL ${any.code}`)
  if (any.detail) parts.push(any.detail)
  if (any.hint) parts.push(`Hint: ${any.hint}`)
  if (any.schema_name || any.table_name) {
    parts.push(`Ref: ${[any.schema_name, any.table_name, any.column_name].filter(Boolean).join('.')}`)
  }
}

/** Extract a useful message from postgres.js / Drizzle errors (often nested). */
export function formatDbError(e: unknown): string {
  if (e instanceof Error) {
    const any = e as Pgish
    const parts = [any.message]
    appendPgFields(parts, any)
    if (any.cause instanceof Error) {
      parts.push(`cause: ${any.cause.message}`)
      appendPgFields(parts, any.cause as Pgish)
    }
    return parts.filter(Boolean).join(' — ')
  }
  return String(e)
}
