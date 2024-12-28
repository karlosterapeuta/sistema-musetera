import './globals.css'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import type { Metadata } from 'next'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MuseTera',
  description: 'Sistema de Gestão para Musicoterapeutas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-6 bg-gray-50">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}