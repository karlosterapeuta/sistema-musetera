import NextAuth from 'next-auth'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            professionalRegister: true
          }
        })

        if (!user?.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          professionalRegister: user.professionalRegister
        }
      }
    })
  ],
  pages: {
    signIn: '/auth'
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60 // 8 hours
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.professionalRegister = user.professionalRegister
        delete token.name
        delete token.picture
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.professionalRegister = token.professionalRegister as string
        delete session.user.name
        delete session.user.image
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }