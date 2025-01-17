import NextAuth from 'next-auth'
import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {},
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findUnique({
            where: { 
              email: credentials?.email?.toLowerCase().trim() 
            }
          })

          if (!user || !user.password) return null

          const match = await bcrypt.compare(
            credentials?.password || '',
            user.password
          )

          if (!match) return null

          return {
            id: user.id,
            email: user.email,
            professionalRegister: user.professionalRegister
          }
        } catch (error) {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth'
  },
  session: {
    strategy: 'jwt'
  }
})

export { handler as GET, handler as POST }