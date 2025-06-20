// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl

  // Allow homepage `/`, static files (`/_next/`, `/favicon.ico`, etc.)
  if (
    url.pathname === '/' ||
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/loading') ||
    url.pathname.startsWith('/logo') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/settings') ||
    url.pathname.startsWith('/signup') ||
    url.pathname.startsWith('/insights') ||
    url.pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Redirect everything else to `/`
  return NextResponse.redirect(new URL('/', request.url))
}
