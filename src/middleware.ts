import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Se estiver autenticado e tentar acessar páginas de auth
    if (token && (path === '/auth' || path === '/cadastro')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        // Permite acesso a /auth e /cadastro sem autenticação
        if (path === '/auth' || path === '/cadastro') {
          return true
        }
        // Requer autenticação para outras rotas
        return !!token
      }
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