import { type ReactNode } from 'react'
import { notFound } from 'next/navigation'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminSecretLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ adminSecret: string }>
}) {
  const { adminSecret } = await params
  if (!process.env.ADMIN_PANEL_SECRET || adminSecret !== process.env.ADMIN_PANEL_SECRET) {
    notFound()
  }

  return <>{children}</>
}
