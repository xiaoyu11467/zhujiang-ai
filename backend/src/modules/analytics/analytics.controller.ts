import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('overview')
  @UseGuards(AuthGuard('jwt'))
  async getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('trend')
  @UseGuards(AuthGuard('jwt'))
  async getTrend() {
    return this.analyticsService.getTrend();
  }

  @Get('hot-questions')
  @UseGuards(AuthGuard('jwt'))
  async getHotQuestions() {
    return this.analyticsService.getHotQuestions();
  }

  @Post('track')
  async trackEvent(
    @Body() body: { sessionId: string; eventType: string; eventData?: any },
  ) {
    return this.analyticsService.trackEvent(
      body.sessionId,
      body.eventType,
      body.eventData,
    );
  }
}
