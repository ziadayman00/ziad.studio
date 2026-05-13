/** Shown when DATABASE_URL host fails DNS (common with guessed `db.<ref>.supabase.co`). */
export function printSupabaseDatabaseUrlHint() {
  console.error(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DATABASE_URL host could not be resolved (DNS).

Do not build the URL by hand. In Supabase:

  1. Open your project → Project Settings → Database
  2. Under "Connection string", pick "URI"
  3. Use "Session pooler" or "Transaction pooler" (recommended for tools/servers)
     • Host usually looks like: aws-0-<REGION>.pooler.supabase.com
     • Port is often 6543
     • User often looks like: postgres.<project-ref>
  4. Paste the full string into .env.local as DATABASE_URL=

The old-style host db.<project-ref>.supabase.co often does not resolve — use the
exact string from the dashboard instead.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
}

export function isLikelyBadSupabaseDbHost(hostname: string): boolean {
  return /^db\.[^.]+\.supabase\.co$/i.test(hostname)
}
