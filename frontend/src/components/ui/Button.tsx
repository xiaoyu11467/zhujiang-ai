import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

  const variants: Record<string, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
    secondary:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
