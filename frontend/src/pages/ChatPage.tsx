import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import { useUIStore } from '../stores/uiStore'
import { ChatBubble } from '../components/chat/ChatBubble'
import { ChatInput } from '../components/chat/ChatInput'
import { ChatSidebar } from '../components/chat/ChatSidebar'
import { RecommendQuestions } from '../components/chat/RecommendQuestions'
import { WechatModal } from '../components/chat/WechatModal'

export default function ChatPage() {
  const [searchParams] = useSearchParams()
  const {
    messages,
    isStreaming,
    sendMessage,
  } = useChat()
  const { sidebarOpen, setSidebarOpen } = useUIStore()

  const { setShowWechatModal } = useUIStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 从URL参数获取预设问题
  const initialQuestion = searchParams.get('q')
  const hasSent = useRef(false)

  useEffect(() => {
    if (initialQuestion && !hasSent.current) {
      hasSent.current = true
      // 延迟发送，确保组件已挂载
      setTimeout(() => {
        sendMessage(initialQuestion)
      }, 500)
    }
  }, [initialQuestion])

  return (
    <div className="h-screen sm:h-screen flex bg-slate-50" style={{ height: '100dvh' }}>
      {/* 侧边栏 */}
      <ChatSidebar />

      {/* 主内容 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className="h-14 border-b border-slate-200 bg-white flex items-center px-4 gap-3 shrink-0">
          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-slate-600 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          <h1 className="text-lg font-semibold text-slate-800">珠江小智</h1>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            AI学长
          </span>

          {/* 右侧微信入口 */}
          <div className="ml-auto">
            <button
              onClick={() => setShowWechatModal(true)}
              className="text-xs text-emerald-600 hover:text-emerald-700
                flex items-center gap-1 px-3 py-1.5 bg-emerald-50 rounded-full
                hover:bg-emerald-100 transition-all cursor-pointer"
            >
              <span>💬</span>
              <span className="hidden sm:inline">联系Yu学长</span>
            </button>
          </div>
        </header>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="text-center mb-8">
                <span className="text-5xl">🌊</span>
                <h2 className="text-xl font-semibold text-slate-700 mt-3">
                  你好，我是珠江小智
                </h2>
                <p className="text-slate-500 mt-1">
                  你的华珠AI学长，有什么可以帮你？
                </p>
              </div>
              <RecommendQuestions onSelect={sendMessage} />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto py-4 px-4">
              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* 输入区域 */}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>

      {/* 微信弹窗 */}
      <WechatModal />
    </div>
  )
}
