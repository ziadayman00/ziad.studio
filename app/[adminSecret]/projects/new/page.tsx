import Link from 'next/link'

import PanelChrome from '@/components/admin/PanelChrome'
import ProjectForm from '@/components/admin/ProjectForm'
import { nextSortOrder } from '@/lib/admin/queries'
import { emptyDefaults } from '@/lib/admin/form-defaults'
import { requireAdmin } from '@/lib/admin/panel'

type Props = {
  params: Promise<{ adminSecret: string }>
}

export default async function NewProjectPage({ params }: Props) {
  const { adminSecret } = await params
  await requireAdmin(adminSecret)

  const sort = await nextSortOrder()

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
        <PanelChrome secret={adminSecret} title="New project" subtitle="Publish a new artifact to the portfolio database." />

        <div className="mt-12">
          <Link href={`/${adminSecret}`} className="font-sans text-xs uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white">
            ← Back to list
          </Link>
        </div>

        <div className="mt-10">
          <ProjectForm secret={adminSecret} mode="create" defaults={emptyDefaults(sort)} />
        </div>
      </div>
    </div>
  )
}
