import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    return null
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
    '/relatorios/:path*'
  ]
}