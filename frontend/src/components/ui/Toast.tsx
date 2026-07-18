import { useEffect } from 'react'
import { useUIStore } from '../../stores/uiStore'

export function Toast() {
  const { toastMessage, toastType, clearToast } = useUIStore()

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(clearToast, 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  if (!toastMessage) return null

  const colors: Record<string, string> = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in">
      <div
        className={`${colors[toastType]} text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium`}
      >
        {toastMessage}
      </div>
    </div>
  )
}
