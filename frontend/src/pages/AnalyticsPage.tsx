import { useState, useEffect } from 'react'
import {
  getOverview,
  getTrend,
  getHotQuestions,
} from '../services/analyticsService'
import type { OverviewStats, TrendDataPoint, HotQuestion } from '../types/analytics'
import { formatNumber } from '../utils/format'

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<OverviewStats | null>(null)
  const [trend, setTrend] = useState<TrendDataPoint[]>([])
  const [hotQuestions, setHotQuestions] = useState<HotQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, tr, hq] = await Promise.all([
          getOverview(),
          getTrend(30),
          getHotQuestions(10),
        ])
        setOverview(ov)
        setTrend(tr)
        setHotQuestions(hq)
      } catch {
        // ignore
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-6 max-w-5xl">
        <p className="text-slate-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">数据分析</h2>

      {/* 概览卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="今日提问" value={formatNumber(overview?.todayMessages || 0)} icon="💬" />
        <StatCard label="今日对话" value={formatNumber(overview?.todayConversations || 0)} icon="📝" />
        <StatCard label="总对话数" value={formatNumber(overview?.totalConversations || 0)} icon="📊" />
        <StatCard label="总消息数" value={formatNumber(overview?.totalMessages || 0)} icon="📨" />
      </div>

      {/* 提问趋势 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
        <h3 className="font-semibold text-slate-800 mb-4">📈 近30天提问趋势</h3>
        {trend.length === 0 ? (
          <p className="text-sm text-slate-400">暂无数据</p>
        ) : (
          <div className="flex items-end gap-1 h-32">
            {trend.map((point) => {
              const maxCount = Math.max(...trend.map((p) => p.count), 1)
              const height = (point.count / maxCount) * 100
              return (
                <div
                  key={point.date}
                  className="flex-1 flex flex-col items-center gap-1"
                  title={`${point.date}: ${point.count}次`}
                >
                  <div className="w-full bg-blue-100 rounded-t relative" style={{ height: '8rem' }}>
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {point.date.slice(5)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 热门问题 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-800 mb-4">🔥 热门问题类型</h3>
        {hotQuestions.length === 0 ? (
          <p className="text-sm text-slate-400">暂无数据</p>
        ) : (
          <div className="space-y-3">
            {hotQuestions.map((item, i) => {
              const maxCount = Math.max(...hotQuestions.map((h) => h.count), 1)
              const width = (item.count / maxCount) * 100
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 w-5">{i + 1}</span>
                  <span className="text-sm text-slate-700 w-16">{item.name}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 w-12 text-right">
                    {item.count}次
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <span className="text-2xl font-bold text-slate-800">{value}</span>
    </div>
  )
}
