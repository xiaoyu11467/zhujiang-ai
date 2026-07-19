import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
      {/* 导航 */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">返回首页</span>
          </button>
          <span className="font-semibold text-slate-800">关于我们</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 sm:py-12 px-4 text-center">
        <span className="text-5xl sm:text-6xl">🌊</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-3 sm:mt-4 mb-2">珠江小智</h1>
        <p className="text-base sm:text-lg text-slate-500">AI校园助手</p>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
          面向华南农业大学珠江学院大一新生的智能问答平台
        </p>
      </section>

      {/* 项目介绍 */}
      <section className="max-w-3xl mx-auto px-4 pb-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-3">🤖 AI学长 · 珠江小智</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            珠江小智是专为华珠新生打造的AI智能问答助手。基于RAG（检索增强生成）技术，
            结合华南农业大学珠江学院官方公开资料，为新生提供7×24小时的校园咨询服务。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {['报到流程', '宿舍生活', '教务制度', '奖学金', '转专业', '社团活动', '校园地图', '军训指南']
              .map((t) => (
                <span key={t} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">{t}</span>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-3">🎓 Yu学长 · 人工服务</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Yu学长是华珠在校学长，为新生提供个性化人工服务，包括新生用品咨询、
            学车报名、校园生活指导等。AI和人工互补，让新生咨询更全面。
          </p>
          <button
            onClick={() => navigate('/service')}
            className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer"
          >
            了解更多 →
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-3">📚 知识来源</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-3">
            所有知识均来自华南农业大学珠江学院公开资料：
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            {[
              '学校官网 scauzj.edu.cn',
              '招生网 zs.scauzj.edu.cn',
              '教务处 jwc.scauzj.edu.cn',
              '学生工作部 xsc.scauzj.edu.cn',
              '阳光高考平台',
              '学校官方微信公众号',
            ].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-3">⚠️ 免责声明</h2>
          <div className="text-sm text-slate-500 leading-relaxed space-y-2">
            <p>1. 本平台信息仅供参考，以学校官方通知为准。</p>
            <p>2. AI回答基于公开资料生成，可能不是最新信息，如有疑问请咨询辅导员。</p>
            <p>3. Yu学长人工服务由个人提供，非学校官方行为。</p>
            <p>4. 本平台不收集个人身份信息，对话数据仅用于改进服务质量。</p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-slate-400">
        <p>珠江小智 · AI校园助手 v1.0</p>
        <p className="mt-1">为华南农业大学珠江学院新生而生 🌊</p>
      </footer>
    </div>
  )
}
