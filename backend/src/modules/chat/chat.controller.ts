import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { FeedbackDto } from './dto/feedback.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * 发送消息（SSE流式响应）
   */
  @Post('send')
  async sendMessage(@Body() dto: SendMessageDto, @Res() res: Response) {
    // 设置 SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const sessionId =
      dto.sessionId ||
      `session_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    try {
      for await (const chunk of this.chatService.streamChat(
        dto.question,
        sessionId,
        dto.conversationId,
      )) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    } catch (error) {
      res.write(
        `data: ${JSON.stringify({ type: 'error', content: '抱歉，生成回答时出了点问题，请稍后再试。' })}\n\n`,
      );
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }

  /**
   * 获取历史对话列表
   */
  @Get('conversations')
  async getConversations(@Query('sessionId') sessionId: string) {
    if (!sessionId) return [];
    return this.chatService.getConversations(sessionId);
  }

  /**
   * 获取对话消息
   */
  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }

  /**
   * 删除对话
   */
  @Delete('conversations/:id')
  async deleteConversation(@Param('id') id: string) {
    await this.chatService.deleteConversation(id);
    return { success: true };
  }

  /**
   * 提交反馈
   */
  @Post('feedback')
  async submitFeedback(@Body() dto: FeedbackDto) {
    return this.chatService.submitFeedback(
      dto.messageId,
      dto.rating,
      dto.reason,
    );
  }
}
