import { useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export function HomeInput() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    navigate(`/chat?q=${encodeURIComponent(trimmed)}`)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex gap-3 items-center bg-white rounded-2xl border border-slate-200
        shadow-lg shadow-blue-500/5 focus-within:ring-2 focus-within:ring-blue-500
        focus-within:border-transparent transition-all p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入你的问题，比如：怎么选课？"
          className="flex-1 px-4 py-3 text-sm outline-none bg-transparent
            placeholder:text-slate-400"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="shrink-0 bg-blue-600 text-white px-5 py-2.5 rounded-xl
            hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
            transition-all text-sm font-medium cursor-pointer"
        >
          发送
        </button>
      </div>
    </div>
  )
}
