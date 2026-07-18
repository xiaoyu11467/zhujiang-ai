import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUIStore } from '../stores/uiStore'
import api from '../services/api'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const { showToast } = useUIStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { username, password })
      login(data.accessToken, data.user)
      showToast('登录成功', 'success')
      navigate('/admin/knowledge')
    } catch {
      showToast('用户名或密码错误', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-3xl">🌊</span>
          <h2 className="text-xl font-bold text-slate-800 mt-2">珠江小智</h2>
          <p className="text-sm text-slate-500">管理后台登录</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="请输入用户名"
            autoFocus
          />
          <Input
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
      </div>
    </div>
  )
}
