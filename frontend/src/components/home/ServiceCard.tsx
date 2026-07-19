import { useUIStore } from '../../stores/uiStore'

export function ServiceCard() {
  const setShowWechatModal = useUIStore((s) => s.setShowWechatModal)

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <span className="text-xl sm:text-2xl">🎓</span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Yu学长</h4>
          <p className="text-[11px] sm:text-xs text-slate-500">华南农业大学珠江学院新生服务助手</p>
          <div className="flex flex-wrap gap-1 mt-1 sm:mt-1.5">
            {['新生咨询', '生活指导', '学车', '用品推荐'].map((t) => (
              <span key={t} className="text-[9px] sm:text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {t}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowWechatModal(true)}
          className="shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium
            hover:bg-emerald-700 transition-all cursor-pointer"
        >
          添加微信
        </button>
      </div>
    </div>
  )
}
