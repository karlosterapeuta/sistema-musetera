import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      const path = req.nextUrl.pathname
      
      // Permitir acesso público a /auth
      if (path === '/auth') return true
      
      // Todas as outras rotas requerem autenticação
      return !!token
    }
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/patients/:path*',
    '/relatorios/:path*',
    '/auth'
  ]
}