import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const path = req.nextUrl.pathname

    // Rota pública
    if (path === '/auth') {
      // Se estiver autenticado, redireciona para dashboard
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      // Se não estiver autenticado, permite acesso
      return NextResponse.next()
    }

    // Rotas protegidas
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true // Deixamos o controle para a função middleware
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patients/:path*',
    '/relatorios/:path*',
    '/auth'
  ]
}