import { useNavigate } from 'react-router-dom'
import { QuickEntry } from '../components/home/QuickEntry'
import { HomeInput } from '../components/home/HomeInput'
import { ServiceCard } from '../components/home/ServiceCard'

export default function HomePage() {
  const navigate = useNavigate()

  const handleQuestionClick = (q: string) => {
    navigate(`/chat?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-white">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo / 标题 */}
        <div className="text-center mb-8 animate-in">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="text-5xl">🌊</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">
            珠江小智
          </h1>
          <p className="text-lg text-slate-500">AI校园助手</p>
        </div>

        {/* 欢迎语 */}
        <p className="text-slate-600 mb-8 text-center animate-in">
          你好，我是你的华珠AI学长
          <br />
          有什么校园问题都可以问我
        </p>

        {/* 输入框 */}
        <div className="w-full mb-8 animate-in">
          <HomeInput />
        </div>

        {/* 快捷入口 */}
        <div className="w-full mb-10 animate-in">
          <p className="text-center text-sm text-slate-400 mb-3">— 快捷入口 —</p>
          <QuickEntry />
        </div>

        {/* 推荐问题 */}
        <div className="w-full max-w-xl mb-10 animate-in">
          <p className="text-center text-sm text-slate-400 mb-3">— 大家常问 —</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              '新生报到需要准备什么？',
              '宿舍是几人间？',
              '怎么选课？',
              '奖学金有哪些？',
              '转专业难吗？',
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleQuestionClick(q)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm
                  text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                  transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 分隔 */}
        <div className="w-full max-w-lg border-t border-slate-100 my-4" />

        {/* 新生服务中心 */}
        <div className="w-full animate-in">
          <p className="text-center text-sm text-slate-400 mb-3">— 新生服务中心 —</p>
          <ServiceCard />
        </div>
      </div>

      {/* 页脚 */}
      <footer className="py-6 text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a href="/service" className="hover:text-slate-600 transition-colors">
            新生服务中心
          </a>
          <span className="text-slate-300">|</span>
          <a href="/about" className="hover:text-slate-600 transition-colors">
            关于我们
          </a>
        </div>
        <p>珠江小智 · AI校园助手 · 信息仅供参考</p>
        <p>数据来源：华南农业大学珠江学院官网及公开资料</p>
      </footer>
    </div>
  )
}
