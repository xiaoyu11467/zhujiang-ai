import { useUIStore } from '../stores/uiStore'
import { useNavigate } from 'react-router-dom'

const SERVICES = [
  {
    icon: '📋',
    title: '新生问题咨询',
    desc: '关于报到流程、入学准备、军训安排等问题，Yu学长为你一一解答。',
    items: ['报到材料清单核对', '入学流程指引', '军训注意事项', '校区选择帮助'],
  },
  {
    icon: '🏠',
    title: '校园生活指导',
    desc: '从宿舍生活到校园设施，帮你快速适应大学生活。',
    items: ['宿舍用品推荐', '食堂美食指南', '图书馆使用攻略', '周边商圈介绍'],
  },
  {
    icon: '🛍️',
    title: '新生用品咨询',
    desc: '床上用品、生活用品、学习用品，学长推荐的靠谱渠道。',
    items: ['床上用品套装', '宿舍收纳好物', '学习必备清单', '电子产品推荐'],
  },
  {
    icon: '🚗',
    title: '学车咨询',
    desc: '从化/四会周边驾校信息，报名流程和注意事项。',
    items: ['驾校推荐与对比', '报名流程指导', '学车时间规划', '费用参考'],
  },
  {
    icon: '🎯',
    title: '校园服务推荐',
    desc: '更多校园相关服务，让你的大学生活更轻松。',
    items: ['校园网办理', '社团推荐', '兼职信息', '生活优惠'],
  },
]

const FAQ_LIST = [
  { q: 'Yu学长是学校官方人员吗？', a: 'Yu学长是华珠的在校学长，专注为新生提供入学和生活服务，非学校官方人员，但信息经过核实。' },
  { q: '咨询收费吗？', a: '新生咨询服务完全免费。用品推荐和学车等服务由合作商家提供，价格透明。' },
  { q: '怎么联系Yu学长？', a: '微信搜索 yux0620x，添加时备注「华珠新生+姓名」即可。' },
  { q: 'AI学长和Yu学长有什么区别？', a: 'AI学长（珠江小智）是智能问答机器人，可以随时回答校园常见问题。当你需要人工帮助、购买咨询或个性化建议时，可以联系Yu学长。' },
]

export default function ServicePage() {
  const setShowWechatModal = useUIStore((s) => s.setShowWechatModal)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* 顶部导航 */}
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
          <span className="font-semibold text-slate-800">新生服务中心</span>
          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="py-8 sm:py-12 px-4 text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <span className="text-3xl sm:text-4xl">🎓</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Yu学长</h1>
        <p className="text-slate-500 text-base sm:text-lg">华南农业大学珠江学院新生服务助手</p>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
          专注为华珠新生提供一站式入学服务，从报到到毕业，学长陪伴你的大学时光
        </p>
        <button
          onClick={() => setShowWechatModal(true)}
          className="mt-6 px-8 py-3 bg-emerald-600 text-white rounded-2xl font-medium
            hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 cursor-pointer
            flex items-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122zm-2.18 2.768c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
          </svg>
          添加Yu学长微信
        </button>
      </section>

      {/* 服务列表 */}
      <section className="max-w-3xl mx-auto px-4 pb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">服务范围</h2>
        <div className="space-y-4">
          {SERVICES.map((svc) => (
            <div
              key={svc.title}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{svc.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1">{svc.title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{svc.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {svc.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">常见问题</h2>
        <div className="space-y-3">
          {FAQ_LIST.map((faq) => (
            <details
              key={faq.q}
              className="bg-white rounded-xl border border-slate-200 group"
            >
              <summary className="px-5 py-4 cursor-pointer font-medium text-slate-700 text-sm
                group-open:text-emerald-700 list-none flex items-center justify-between">
                {faq.q}
                <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="py-12 px-4 text-center bg-emerald-50">
        <h2 className="text-xl font-bold text-slate-800 mb-3">准备好开启大学生活了吗？</h2>
        <p className="text-slate-500 mb-6">添加Yu学长微信，让学长帮你搞定一切</p>
        <button
          onClick={() => setShowWechatModal(true)}
          className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-medium
            hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 cursor-pointer"
        >
          微信添加：yux0620x
        </button>
        <p className="text-xs text-slate-400 mt-3">备注「华珠新生+姓名」</p>
      </section>
    </div>
  )
}
