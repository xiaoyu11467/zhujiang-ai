import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
  private deepseekClient: OpenAI;
  private openaiClient: OpenAI;

  constructor(private configService: ConfigService) {
    // DeepSeek（主要）
    this.deepseekClient = new OpenAI({
      apiKey: this.configService.get('DEEPSEEK_API_KEY') || 'sk-placeholder',
      baseURL:
        this.configService.get('DEEPSEEK_BASE_URL') ||
        'https://api.deepseek.com/v1',
    });

    // OpenAI（备用）
    this.openaiClient = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY') || 'sk-placeholder',
    });
  }

  /**
   * 流式生成回答（SSE）
   */
  async *streamChat(
    prompt: string,
    provider: 'deepseek' | 'openai' = 'deepseek',
  ): AsyncGenerator<string> {
    const client = provider === 'deepseek' ? this.deepseekClient : this.openaiClient;
    const model =
      provider === 'deepseek'
        ? this.configService.get('DEEPSEEK_MODEL', 'deepseek-chat')
        : this.configService.get('OPENAI_MODEL', 'gpt-4o-mini');

    const stream = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      temperature: 0.7,
      max_tokens: 2000,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }

  /**
   * 非流式生成回答
   */
  async chat(
    prompt: string,
    provider: 'deepseek' | 'openai' = 'deepseek',
  ): Promise<string> {
    const client =
      provider === 'deepseek' ? this.deepseekClient : this.openaiClient;
    const model =
      provider === 'deepseek'
        ? this.configService.get('DEEPSEEK_MODEL', 'deepseek-chat')
        : this.configService.get('OPENAI_MODEL', 'gpt-4o-mini');

    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '抱歉，我暂时无法回答这个问题。';
  }
}
