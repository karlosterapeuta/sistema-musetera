import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const path = req.nextUrl.pathname

    // Rotas públicas que não precisam de autenticação
    if (path === '/auth' || path === '/cadastro') {
      return isAuth 
        ? NextResponse.redirect(new URL('/dashboard', req.url))
        : NextResponse.next()
    }

    // Se não estiver autenticado, redireciona para /auth
    if (!isAuth) {
      const url = new URL('/auth', req.url)
      url.searchParams.set('callbackUrl', req.url)
      return NextResponse.redirect(url)
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
    '/relatorios/:path*',
    '/auth',
    '/cadastro'
  ]
}