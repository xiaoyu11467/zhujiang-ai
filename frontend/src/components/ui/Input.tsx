import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder:text-slate-400 transition-all ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  ),
)

Input.displayName = 'Input'
