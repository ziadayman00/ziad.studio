/**
 * Next.js instrumentation — runs once when the Node server starts.
 * Ensures `public.projects` exists so the first request does not hit 42P01.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ensureProjectsSchemaIfNeeded } = await import('./lib/db/ensure-schema')
    await ensureProjectsSchemaIfNeeded().catch(() => {})
  }
}
