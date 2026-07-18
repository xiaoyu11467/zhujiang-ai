import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  showWechatModal: boolean
  toastMessage: string | null
  toastType: 'success' | 'error' | 'info'

  toggleSidebar: () => void
  setSidebarOpen: (v: boolean) => void
  setShowWechatModal: (v: boolean) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearToast: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  showWechatModal: false,
  toastMessage: null,
  toastType: 'info',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setShowWechatModal: (v) => set({ showWechatModal: v }),
  showToast: (message, type = 'info') => set({ toastMessage: message, toastType: type }),
  clearToast: () => set({ toastMessage: null }),
}))
