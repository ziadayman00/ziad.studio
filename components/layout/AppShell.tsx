'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import Atmosphere from '@/components/experience/Atmosphere'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { isMinimalShellPath } from '@/lib/layout/minimal-shell'

type Props = {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  const pathname = usePathname()
  const minimal = isMinimalShellPath(pathname)

  if (minimal) {
    return <main className="flex-1 min-h-0">{children}</main>
  }

  return (
    <>
      <Atmosphere />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
