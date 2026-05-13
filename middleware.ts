import { type NextRequest, NextResponse } from 'next/server'

import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/dashboard' || path.startsWith('/dashboard/')) {
    return new NextResponse(null, { status: 404 })
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico)$).*)',
  ],
}
