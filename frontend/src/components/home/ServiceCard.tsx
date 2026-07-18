import { useUIStore } from '../../stores/uiStore'

export function ServiceCard() {
  const setShowWechatModal = useUIStore((s) => s.setShowWechatModal)

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center gap-4">
          {/* 头像 */}
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-2xl">🎓</span>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800">Yu学长</h4>
            <p className="text-xs text-slate-500">华南农业大学珠江学院新生服务助手</p>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {['新生咨询', '生活指导', '学车', '用品推荐'].map((t) => (
                <span key={t} className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowWechatModal(true)}
            className="shrink-0 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium
              hover:bg-emerald-700 transition-all cursor-pointer"
          >
            添加微信
          </button>
        </div>
      </div>
    </div>
  )
}
