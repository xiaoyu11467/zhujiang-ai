import { Modal } from '../ui/Modal'
import { useUIStore } from '../../stores/uiStore'

export function WechatModal() {
  const { showWechatModal, setShowWechatModal } = useUIStore()

  return (
    <Modal
      open={showWechatModal}
      onClose={() => setShowWechatModal(false)}
      title="联系 Yu学长"
    >
      <div className="text-center space-y-4">
        {/* 头像 */}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-3xl">🎓</span>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-slate-800">Yu学长</h4>
          <p className="text-sm text-slate-500">华南农业大学珠江学院新生服务助手</p>
        </div>

        {/* 服务标签 */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            '📋 新生咨询',
            '🏠 生活指导',
            '🛍️ 用品推荐',
            '🚗 学车咨询',
            '🎯 服务推荐',
          ].map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 微信号 */}
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">微信扫码或搜索添加</p>
          <div className="mx-auto w-36 sm:w-40 mb-3">
            <img src="/images/微信二维码.jpg" alt="Yu学长微信二维码" className="w-full rounded-lg" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <code className="text-base font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg select-all">
              yux0620x
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText('yux0620x')
              }}
              className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              复制
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            添加时请备注「华珠新生+姓名」
          </p>
        </div>
      </div>
    </Modal>
  )
}
