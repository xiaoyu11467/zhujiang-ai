import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  async getOverview() {
    const [totalConversations, totalMessages, avgSatisfaction] =
      await Promise.all([
        this.prisma.conversation.count(),
        this.prisma.message.count(),
        this.prisma.feedback
          .aggregate({
            _count: { rating: true },
          })
          .then(() => 0)
          .catch(() => 0),
      ]);

    // 今日数据
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMessages = await this.prisma.message.count({
      where: { createdAt: { gte: today } },
    });

    const todayConversations = await this.prisma.conversation.count({
      where: { createdAt: { gte: today } },
    });

    return {
      totalConversations,
      totalMessages,
      todayMessages,
      todayConversations,
      avgSatisfaction,
    };
  }

  async getTrend(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const messages = await this.prisma.message.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // 按天聚合
    const trendMap: Record<string, number> = {};
    for (const msg of messages) {
      const day = msg.createdAt.toISOString().slice(0, 10);
      trendMap[day] = (trendMap[day] || 0) + 1;
    }

    return Object.entries(trendMap).map(([date, count]) => ({
      date,
      count,
    }));
  }

  async getHotQuestions(limit = 10) {
    // 从用户消息中统计高频关键词
    const messages = await this.prisma.message.findMany({
      where: { role: 'user' },
      select: { content: true },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    // 简单分组统计
    const categories: Record<string, number> = {
      '选课': 0,
      '宿舍': 0,
      '转专业': 0,
      '奖学金': 0,
      '军训': 0,
      '报到': 0,
      '食堂': 0,
      '图书馆': 0,
      '考试': 0,
      '社团': 0,
    };

    for (const msg of messages) {
      for (const [key] of Object.entries(categories)) {
        if (msg.content.includes(key)) {
          categories[key]++;
        }
      }
    }

    return Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async trackEvent(
    sessionId: string,
    eventType: string,
    eventData?: any,
  ) {
    return this.prisma.analyticsEvent.create({
      data: {
        sessionId,
        eventType,
        eventData,
      },
    });
  }
}
