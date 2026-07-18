import { useEffect } from 'react'
import { useChat } from '../../hooks/useChat'
import { useUIStore } from '../../stores/uiStore'
import { formatTime } from '../../utils/format'

export function ChatSidebar() {
  const {
    conversations,
    currentConversationId,
    loadConversations,
    switchConversation,
    removeConversation,
    newChat,
  } = useChat()

  const { sidebarOpen, setSidebarOpen } = useUIStore()

  useEffect(() => {
    loadConversations()
  }, [])

  return (
    <>
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-50 border-r border-slate-200
          flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* 新建对话 */}
        <div className="p-4">
          <button
            onClick={newChat}
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl text-sm font-medium
              hover:bg-blue-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新对话
          </button>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto px-3">
          {conversations.length === 0 ? (
            <p className="text-center text-sm text-slate-400 mt-8">暂无历史对话</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  switchConversation(conv.id)
                  setSidebarOpen(false)
                }}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 cursor-pointer
                  transition-all text-sm
                  ${conv.id === currentConversationId
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="flex-1 truncate">{conv.title}</span>
                <span className="text-xs text-slate-400 shrink-0">
                  {formatTime(conv.updatedAt)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('确定删除这个对话吗？')) {
                      removeConversation(conv.id)
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500
                    transition-all cursor-pointer shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* 底部：Yu学长入口 */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={() => useUIStore.getState().setShowWechatModal(true)}
            className="w-full py-2 px-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs
              hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-2"
          >
            <span className="text-base">💬</span>
            <span>需要人工帮助？联系 Yu学长</span>
          </button>
        </div>
      </aside>
    </>
  )
}
