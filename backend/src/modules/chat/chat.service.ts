import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RagService } from '../rag/rag.service';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaClient,
    private ragService: RagService,
    private llmService: LlmService,
  ) {}

  /**
   * 获取或创建对话
   */
  async getOrCreateConversation(sessionId: string, conversationId?: string) {
    if (conversationId) {
      const conv = await this.prisma.conversation.findUnique({
        where: { id: conversationId },
      });
      if (conv) return conv;
    }

    return this.prisma.conversation.create({
      data: { sessionId },
    });
  }

  /**
   * 获取历史对话列表
   */
  async getConversations(sessionId: string) {
    return this.prisma.conversation.findMany({
      where: { sessionId },
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
  }

  /**
   * 获取对话消息
   */
  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * 删除对话
   */
  async deleteConversation(conversationId: string) {
    return this.prisma.conversation.delete({
      where: { id: conversationId },
    });
  }

  /**
   * 流式 AI 问答
   */
  async *streamChat(
    question: string,
    sessionId: string,
    conversationId?: string,
  ): AsyncGenerator<{ type: string; content?: string; conversationId?: string }> {
    // 1. 获取/创建对话
    const conversation = await this.getOrCreateConversation(
      sessionId,
      conversationId,
    );

    // 返回对话ID
    yield { type: 'meta', conversationId: conversation.id };

    // 2. 保存用户消息
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: question,
      },
    });

    // 3. RAG检索
    const { prompt } = await this.ragService.buildRagPrompt(question);

    // 4. LLM流式生成
    let fullResponse = '';
    for await (const token of this.llmService.streamChat(prompt)) {
      fullResponse += token;
      yield { type: 'content', content: token };
    }

    // 5. 保存AI回复
    await this.prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: fullResponse,
      },
    });

    // 6. 更新对话标题（首次提问时自动生成）
    const msgCount = await this.prisma.message.count({
      where: { conversationId: conversation.id },
    });
    if (msgCount <= 2) {
      const title =
        question.length > 30 ? question.slice(0, 30) + '...' : question;
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { title, messageCount: msgCount },
      });
    } else {
      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { messageCount: msgCount },
      });
    }
  }

  /**
   * 提交反馈
   */
  async submitFeedback(
    messageId: string,
    rating: string,
    reason?: string,
  ) {
    return this.prisma.feedback.upsert({
      where: { messageId },
      create: { messageId, rating, reason },
      update: { rating, reason },
    });
  }
}
