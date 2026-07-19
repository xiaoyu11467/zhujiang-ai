import { MarkdownRenderer } from '../../utils/markdown'
import { FeedbackButtons } from './FeedbackButtons'
import type { Message } from '../../types/chat'

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} mb-4 animate-in`}>
      {/* 头像 */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0
          ${isUser ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}
      >
        {isUser ? '我' : '🤖'}
      </div>

      {/* 气泡 */}
      <div className={`max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-3 sm:px-4 py-2 sm:py-3 rounded-2xl text-[13px] sm:text-sm leading-relaxed
            ${isUser
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'
            }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <>
              {message.content ? (
                <MarkdownRenderer content={message.content} />
              ) : (
                <TypingIndicator />
              )}
              {/* 反馈按钮（仅AI消息且内容完整时显示） */}
              {message.content && !message.id.startsWith('temp') && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <FeedbackButtons messageId={message.id} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/** 正在输入动画 */
function TypingIndicator() {
  return (
    <div className="flex gap-1.5 py-1">
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}
