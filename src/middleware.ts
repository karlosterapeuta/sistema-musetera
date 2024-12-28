import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Lista de rotas protegidas que requerem autenticação
const protectedRoutes = [
  '/agenda',
  '/pacientes',
  '/processos',
  '/biblioteca',
  '/configuracao',
]

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('callbackUrl', request.url)
    loginUrl.searchParams.set('error', 'Você precisa fazer login para acessar esta funcionalidade.')
    return NextResponse.redirect(loginUrl)
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