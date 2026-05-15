import type { ReactNode } from 'react'

import AdminShell from '@/components/admin/AdminShell'

export default async function DashboardGroupLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ adminSecret: string }>
}) {
  const { adminSecret } = await params
  return <AdminShell secret={adminSecret}>{children}</AdminShell>
}
