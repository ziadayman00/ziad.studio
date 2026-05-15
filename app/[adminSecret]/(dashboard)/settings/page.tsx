import Link from 'next/link'

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { requireAdmin } from '@/lib/admin/panel'

type Props = { params: Promise<{ adminSecret: string }> }

export default async function AdminSettingsPage({ params }: Props) {
  const { adminSecret } = await params
  await requireAdmin(adminSecret)

  const hasDb = Boolean(process.env.DATABASE_URL)
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const hasAdminPw = Boolean(process.env.ADMIN_PASSWORD)

  return (
    <>
      <AdminPageHeader
        title="Settings"
        subtitle="Environment-driven configuration. Restart the dev server after changing .env.local."
        actions={
          <Link
            href={`/${adminSecret}`}
            className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]"
          >
            ← Overview
          </Link>
        }
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="cin-panel rounded-[22px] p-6 md:p-8">
          <h2 className="font-display text-lg font-bold text-[var(--foreground)]">Environment</h2>
          <ul className="mt-6 space-y-4 font-sans text-sm">
            <li className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <span className="text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))]">DATABASE_URL</span>
              <span className={`font-mono text-xs ${hasDb ? 'text-emerald-700' : 'text-red-700'}`}>{hasDb ? 'set' : 'missing'}</span>
            </li>
            <li className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
              <span className="text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))]">ADMIN_PASSWORD</span>
              <span className={`font-mono text-xs ${hasAdminPw ? 'text-emerald-700' : 'text-red-700'}`}>{hasAdminPw ? 'set' : 'missing'}</span>
            </li>
            <li className="flex items-center justify-between gap-4">
              <span className="text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))]">SUPABASE_SERVICE_ROLE_KEY</span>
              <span className={`font-mono text-xs ${hasServiceRole ? 'text-emerald-700' : 'text-amber-800'}`}>
                {hasServiceRole ? 'set' : 'optional'}
              </span>
            </li>
          </ul>
          <p className="mt-6 font-sans text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))]">
            Without the service role, image uploads fall back to <span className="font-mono">/public/uploads/portfolio</span> — fine for local work.
          </p>
        </div>

        <div className="cin-panel rounded-[22px] p-6 md:p-8">
          <h2 className="font-display text-lg font-bold text-[var(--foreground)]">Customize</h2>
          <ul className="mt-6 list-inside list-disc space-y-3 font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))]">
            <li>
              <strong className="text-[var(--foreground)]">Portfolio</strong> — full CRUD under Overview and New project.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Blog</strong> — posts stored in Postgres; toggle published to expose on the site.
            </li>
            <li>
              <strong className="text-[var(--foreground)]">Marketing copy</strong> — still lives in the codebase; ask to extract to CMS when you are ready.
            </li>
          </ul>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full border border-[var(--border-strong)] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
          >
            Open public site
          </Link>
        </div>
      </div>
    </>
  )
}
