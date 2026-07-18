import { useState } from 'react'
import { submitFeedback } from '../../services/chatService'

interface FeedbackButtonsProps {
  messageId: string
}

export function FeedbackButtons({ messageId }: FeedbackButtonsProps) {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)
  const [showReason, setShowReason] = useState(false)

  const handleFeedback = async (rating: 'like' | 'dislike') => {
    if (feedback === rating) return // 已投过

    setFeedback(rating)

    if (rating === 'dislike') {
      setShowReason(true)
    } else {
      try {
        await submitFeedback(messageId, rating)
      } catch { /* ignore */ }
    }
  }

  const handleReason = async (reason: string) => {
    try {
      await submitFeedback(messageId, 'dislike', reason)
    } catch { /* ignore */ }
    setShowReason(false)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleFeedback('like')}
        className={`flex items-center gap-1 text-xs transition-colors cursor-pointer
          ${feedback === 'like' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-500'}`}
      >
        <svg className="w-3.5 h-3.5" fill={feedback === 'like' ? 'currentColor' : 'none'}
          stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
        有帮助
      </button>

      <button
        onClick={() => handleFeedback('dislike')}
        className={`flex items-center gap-1 text-xs transition-colors cursor-pointer
          ${feedback === 'dislike' ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
      >
        <svg className="w-3.5 h-3.5" fill={feedback === 'dislike' ? 'currentColor' : 'none'}
          stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
        </svg>
        没帮助
      </button>

      {/* 点踩原因 */}
      {showReason && (
        <div className="flex gap-1.5 flex-wrap">
          {['不准确', '不完整', '不相关', '其他'].map((reason) => (
            <button
              key={reason}
              onClick={() => handleReason(reason)}
              className="text-xs px-2 py-0.5 rounded-full border border-slate-200
                text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {reason}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
