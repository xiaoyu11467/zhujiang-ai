import api from './api'
import type { OverviewStats, TrendDataPoint, HotQuestion } from '../types/analytics'

export async function getOverview(): Promise<OverviewStats> {
  const { data } = await api.get('/analytics/overview')
  return data
}

export async function getTrend(days = 30): Promise<TrendDataPoint[]> {
  const { data } = await api.get('/analytics/trend', { params: { days } })
  return data
}

export async function getHotQuestions(limit = 10): Promise<HotQuestion[]> {
  const { data } = await api.get('/analytics/hot-questions', { params: { limit } })
  return data
}

export async function trackEvent(
  sessionId: string,
  eventType: string,
  eventData?: Record<string, unknown>,
): Promise<void> {
  await api.post('/analytics/track', { sessionId, eventType, eventData })
}
