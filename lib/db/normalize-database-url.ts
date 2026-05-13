/**
 * `postgres` forwards unknown URL query params as startup options. Prisma-style
 * `?schema=public` becomes an invalid GUC (`schema`) on vanilla Postgres → FATAL.
 *
 * Strips wrapping quotes — Next and some loaders leave `'"postgresql://..."'` otherwise.
 */
export function normalizeDatabaseUrl(raw: string): string {
  let trimmed = raw.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim()
  }

  if (!trimmed.includes('schema=')) return trimmed

  try {
    const u = new URL(trimmed.replace(/^postgresql:/i, 'http:'))
    u.searchParams.delete('schema')
    return u.toString().replace(/^https?:/, 'postgresql:')
  } catch {
    return trimmed.replace(/([?&])schema=[^&]*&?/gi, (match, lead: string) => {
      if (lead === '?') return match.endsWith('&') ? '?' : ''
      return ''
    }).replace(/\?&/, '?').replace(/[?&]$/, '')
  }
}
