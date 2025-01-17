'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSession } from 'next-auth/react'

export function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // Se não houver sessão, mostra apenas o conteúdo sem o layout
  if (!session) {
    return <>{children}</>
  }

  // Se houver sessão, mostra o layout completo
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
