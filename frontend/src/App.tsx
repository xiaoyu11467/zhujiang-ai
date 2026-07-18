import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Toast } from './components/ui/Toast'
import { AdminLayout } from './components/admin/AdminLayout'
import { WechatModal } from './components/chat/WechatModal'
import { useAuthStore } from './stores/authStore'

const HomePage = lazy(() => import('./pages/HomePage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const ServicePage = lazy(() => import('./pages/ServicePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const KnowledgeBasePage = lazy(() => import('./pages/KnowledgeBasePage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin text-3xl mb-3">🌊</div>
        <p className="text-sm text-slate-400">加载中...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* 首页 */}
        <Route path="/" element={<HomePage />} />

        {/* 聊天页 */}
        <Route path="/chat" element={<ChatPage />} />

        {/* 新生服务中心 */}
        <Route path="/service" element={<ServicePage />} />

        {/* 关于页面 */}
        <Route path="/about" element={<AboutPage />} />

        {/* 管理后台 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/knowledge" replace />} />
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <span className="text-6xl">🌊</span>
              <h2 className="text-2xl font-bold text-slate-700 mt-4">页面未找到</h2>
              <p className="text-slate-500 mt-2">你访问的页面不存在</p>
              <a href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-700 text-sm">
                返回首页
              </a>
            </div>
          </div>
        } />
      </Routes>

      <Toast />
      <WechatModal />
    </Suspense>
  )
}
