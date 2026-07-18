import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 z-10 animate-in">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl leading-none cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
