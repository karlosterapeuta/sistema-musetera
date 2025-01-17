import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Lista de rotas públicas que não requerem autenticação
const publicRoutes = ['/', '/api/auth']

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Se não for uma rota pública e não tiver token, redireciona para login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Se tiver token e tentar acessar login, redireciona para dashboard
  if (token && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}