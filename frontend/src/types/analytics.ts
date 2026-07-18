export interface OverviewStats {
  totalConversations: number
  totalMessages: number
  todayMessages: number
  todayConversations: number
  avgSatisfaction: number
}

export interface TrendDataPoint {
  date: string
  count: number
}

export interface HotQuestion {
  name: string
  count: number
}
