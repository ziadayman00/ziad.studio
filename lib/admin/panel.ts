import { notFound, redirect } from 'next/navigation'

import { getAdminSession } from '@/lib/auth/admin-session'

export function assertPanelSecret(secret: string) {
  const expected = process.env.ADMIN_PANEL_SECRET
  if (!expected || secret !== expected) notFound()
}

export async function requireAdmin(secret: string) {
  assertPanelSecret(secret)
  if (!(await getAdminSession())) redirect(`/${secret}/login`)
}

export async function redirectIfAdmin(secret: string) {
  assertPanelSecret(secret)
  if (await getAdminSession()) redirect(`/${secret}`)
}
