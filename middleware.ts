import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get('isAuthenticated')?.value === 'true'

  if (url.pathname.startsWith('/protected') && isAuthenticated) {
    url.pathname = '/'

    return NextResponse.redirect(url)
  }

  if (!url.pathname.startsWith('/protected') && !isAuthenticated) {
    url.pathname = '/protected'

    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
