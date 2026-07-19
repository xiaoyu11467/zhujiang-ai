import { useNavigate } from 'react-router-dom'

interface QuickEntryItem {
  icon: string
  label: string
  prompt: string
}

const ENTRIES: QuickEntryItem[] = [
  { icon: '🎓', label: '教务咨询', prompt: '请帮我了解教务相关信息' },
  { icon: '🏠', label: '宿舍生活', prompt: '请帮我了解宿舍相关信息' },
  { icon: '📚', label: '新生指南', prompt: '请帮我了解新生报到信息' },
  { icon: '🍜', label: '校园生活', prompt: '请帮我了解校园生活信息' },
  { icon: '🎯', label: '成长规划', prompt: '请帮我了解学业规划和成长建议' },
]

export function QuickEntry() {
  const navigate = useNavigate()

  const handleClick = (entry: QuickEntryItem) => {
    navigate(`/chat?q=${encodeURIComponent(entry.prompt)}`)
  }

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
      {ENTRIES.map((entry) => (
        <button
          key={entry.label}
          onClick={() => handleClick(entry)}
          className="flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-xl sm:rounded-2xl
            bg-white border border-slate-200 hover:border-blue-300
            hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <span className="text-xl sm:text-2xl">{entry.icon}</span>
          <span className="text-[10px] sm:text-xs text-slate-600 font-medium whitespace-nowrap">
            {entry.label}
          </span>
        </button>
      ))}
    </div>
  )
}
