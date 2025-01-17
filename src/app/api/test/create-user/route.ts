import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Verifica se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'test@test.com'
      }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Usuário de teste já existe' })
    }

    // Cria o hash da senha
    const hashedPassword = await bcrypt.hash('test123', 10)

    // Cria o usuário
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'test@test.com',
        password: hashedPassword,
        professionalRegister: 'TEST123'
      }
    })

    return NextResponse.json({
      message: 'Usuário de teste criado com sucesso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        professionalRegister: user.professionalRegister
      }
    })
  } catch (error) {
    console.error('Erro ao criar usuário de teste:', error)
    return NextResponse.json(
      { error: 'Erro ao criar usuário de teste' },
      { status: 500 }
    )
  }
}
