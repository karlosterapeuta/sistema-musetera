import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const isAuth = !!req.nextauth.token
    const path = req.nextUrl.pathname

    // Limitar o tamanho da URL
    if (req.nextUrl.toString().length > 2000) {
      return new NextResponse('URI Too Long', { status: 414 })
    }

    // Permitir acesso a rotas públicas sem redirecionamento
    if (path === '/auth' || path === '/cadastro') {
      return isAuth 
        ? NextResponse.redirect(new URL('/dashboard', req.url))
        : NextResponse.next()
    }

    // Se não estiver autenticado, redireciona para /auth
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    // Se estiver autenticado e tentar acessar /auth ou /cadastro, redireciona para /dashboard
    if (isAuth && (path === '/auth' || path === '/cadastro')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
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