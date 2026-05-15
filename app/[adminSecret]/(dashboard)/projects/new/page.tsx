import Link from 'next/link'

import AdminPageHeader from '@/components/admin/AdminPageHeader'
import ProjectForm from '@/components/admin/ProjectForm'
import { emptyDefaults } from '@/lib/admin/form-defaults'
import { nextSortOrder } from '@/lib/admin/queries'
import { requireAdmin } from '@/lib/admin/panel'

type Props = {
  params: Promise<{ adminSecret: string }>
}

export default async function NewProjectPage({ params }: Props) {
  const { adminSecret } = await params
  await requireAdmin(adminSecret)

  const sort = await nextSortOrder()

  return (
    <>
      <AdminPageHeader
        title="New project"
        subtitle="Publish a new artifact to the portfolio database."
        actions={
          <Link
            href={`/${adminSecret}`}
            className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border-strong))]"
          >
            ← Overview
          </Link>
        }
      />

      <div className="mt-10">
        <ProjectForm secret={adminSecret} mode="create" defaults={emptyDefaults(sort)} />
      </div>
    </>
  )
}
