import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

/**
 * 简单的关键词权重向量生成（当 Embedding API 不可用时的回退方案）
 * 基于字符级 n-gram 生成稀疏向量，可用于基础的关键词匹配检索
 */
function keywordHashVector(text: string, dims = 1536): number[] {
  const vec = new Array(dims).fill(0)
  // 2-gram 字符级哈希
  for (let i = 0; i < text.length - 1; i++) {
    const bigram = text.slice(i, i + 2)
    let hash = 0
    for (let j = 0; j < bigram.length; j++) {
      hash = ((hash << 5) - hash + bigram.charCodeAt(j)) | 0
    }
    const idx = Math.abs(hash) % dims
    vec[idx] += 1
  }
  // 归一化
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0))
  if (norm > 0) {
    for (let i = 0; i < dims; i++) vec[i] /= norm
  }
  return vec
}

@Injectable()
export class EmbeddingService {
  private client: OpenAI
  private useApi: boolean

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('OPENAI_API_KEY') || ''
    this.useApi = !!apiKey && !apiKey.includes('your-')

    if (this.useApi) {
      this.client = new OpenAI({
        apiKey,
        baseURL: this.configService.get('OPENAI_BASE_URL') || 'https://api.openai.com/v1',
      })
    }
  }

  async embedText(text: string): Promise<number[]> {
    if (this.useApi) {
      try {
        const model = this.configService.get('EMBEDDING_MODEL', 'text-embedding-3-small')
        const response = await this.client.embeddings.create({
          model,
          input: text,
        })
        return response.data[0].embedding
      } catch (e: any) {
        console.warn(`Embedding API 不可用，使用关键词回退: ${e.message}`)
      }
    }
    // 回退到关键词向量
    const dims = this.configService.get('EMBEDDING_DIMENSIONS', 1536)
    return keywordHashVector(text, dims)
  }

  async embedTexts(texts: string[]): Promise<number[][]> {
    if (this.useApi) {
      try {
        const model = this.configService.get('EMBEDDING_MODEL', 'text-embedding-3-small')
        const response = await this.client.embeddings.create({
          model,
          input: texts,
        })
        return response.data.map((d) => d.embedding)
      } catch (e: any) {
        console.warn(`Embedding API 不可用，使用关键词回退: ${e.message}`)
      }
    }
    // 回退到关键词向量
    const dims = this.configService.get('EMBEDDING_DIMENSIONS', 1536)
    return texts.map((t) => keywordHashVector(t, dims))
  }
}
