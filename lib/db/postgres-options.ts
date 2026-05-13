/** Supabase and most hosted Postgres require TLS; local dev usually does not. */
export function getPostgresOptions(connectionUrl: string) {
  const isLocal = /localhost|127\.0\.0\.1/.test(connectionUrl)

  return {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
    prepare: false,
    ssl: isLocal ? false : ('require' as const),
  }
}
