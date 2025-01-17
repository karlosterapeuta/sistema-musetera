import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const path = req.nextUrl.pathname

    // Se estiver na página de login e autenticado, vai para dashboard
    if (path === '/auth' && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Se não estiver autenticado e tentar acessar uma rota protegida, vai para login
    if (!isAuth && path !== '/auth') {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    return NextResponse.next()
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
    '/relatorios/:path*'
  ]
}