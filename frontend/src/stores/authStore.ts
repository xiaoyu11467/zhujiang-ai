import { create } from 'zustand'

interface AuthState {
  token: string | null
  user: { id: string; username: string; role: string } | null
  isAuthenticated: boolean

  login: (token: string, user: { id: string; username: string; role: string }) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('adminToken'),
  user: null,
  isAuthenticated: !!localStorage.getItem('adminToken'),

  login: (token, user) => {
    localStorage.setItem('adminToken', token)
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('adminToken')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
