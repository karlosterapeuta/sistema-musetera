import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg ring-1 ring-gray-900/5 ${className}`}>
      {children}
    </div>
  )
} 