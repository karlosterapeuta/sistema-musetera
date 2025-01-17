import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith('/auth') || path.startsWith('/cadastro')) {
      return isAuth 
        ? NextResponse.redirect(new URL('/dashboard', req.url), {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
            },
          })
        : null
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url), {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      })
    }

    // Add response headers
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    return response
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patients/:path*',
    '/auth',
    '/cadastro',
    '/relatorios/:path*'
  ]
}