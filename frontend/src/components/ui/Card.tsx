import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({
  hover = false,
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-6
        ${hover ? 'hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer' : 'shadow-sm'}
        ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
