interface RecommendQuestionsProps {
  onSelect: (question: string) => void
}

const QUESTIONS = [
  { icon: '🎓', text: '新生报到需要准备什么？' },
  { icon: '🏠', text: '宿舍是几人间？有空调吗？' },
  { icon: '📚', text: '怎么选课？选修课有哪些？' },
  { icon: '🏥', text: '学校医务室在哪？怎么看病？' },
  { icon: '🍜', text: '学校有几个食堂？什么好吃？' },
  { icon: '💰', text: '奖学金怎么申请？有哪些条件？' },
]

export function RecommendQuestions({ onSelect }: RecommendQuestionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto p-4">
      {QUESTIONS.map((q) => (
        <button
          key={q.text}
          onClick={() => onSelect(q.text)}
          className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200
            rounded-xl text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600
            hover:shadow-sm transition-all text-left cursor-pointer"
        >
          <span className="text-lg">{q.icon}</span>
          <span>{q.text}</span>
        </button>
      ))}
    </div>
  )
}
