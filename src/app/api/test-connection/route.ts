import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from '@/lib/supabaseClient'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Teste do Prisma
    const userCount = await prisma.user.count()
    
    // Teste do Supabase
    const { data: version, error } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: 'success',
      prisma: {
        connected: true,
        userCount
      },
      supabase: {
        connected: true,
        version
      }
    })
  } catch (error) {
    console.error('Connection test failed:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
