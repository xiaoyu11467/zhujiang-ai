import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { WechatModal } from '../chat/WechatModal'

const NAV_ITEMS = [
  { path: '/admin/knowledge', label: '知识库管理', icon: '📚' },
  { path: '/admin/analytics', label: '数据分析', icon: '📊' },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuthStore()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 侧边栏 */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div
          className="p-5 border-b border-slate-100 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-bold text-slate-800">珠江小智</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">管理后台</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                transition-all cursor-pointer
                ${location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2 px-1">
            {user?.username || '管理员'}
          </p>
          <button
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50
              rounded-xl transition-colors cursor-pointer"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* 内容区 */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      <WechatModal />
    </div>
  )
}
