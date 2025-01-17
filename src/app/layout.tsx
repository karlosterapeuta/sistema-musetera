import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { LayoutClient } from '@/components/LayoutClient'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { metadata } from './layout.config'

const inter = Inter({ subsets: ['latin'] })

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <SidebarProvider>
            <LayoutClient>
              {children}
            </LayoutClient>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}