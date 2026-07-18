import { Injectable } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { RetrieverService } from './retriever.service';
import { ChromaService } from './chroma.service';

@Injectable()
export class RagService {
  constructor(
    private embeddingService: EmbeddingService,
    private retrieverService: RetrieverService,
    private chromaService: ChromaService,
  ) {}

  /**
   * RAG 检索：问题 → Embedding → ChromaDB 搜索 → 返回相关文档
   */
  async retrieve(question: string, topK = 5): Promise<string[]> {
    // 1. 问题向量化
    const questionEmbedding = await this.embeddingService.embedText(question);

    // 2. ChromaDB 相似度搜索
    const results = await this.chromaService.query(questionEmbedding, topK);

    return results.documents || [];
  }

  /**
   * 构建带检索上下文的 Prompt
   */
  async buildRagPrompt(question: string): Promise<{
    prompt: string;
    sources: string[];
  }> {
    const docs = await this.retrieve(question);
    const prompt = this.retrieverService.buildPrompt(question, docs);
    return { prompt, sources: docs };
  }

  /**
   * 文档入库：分块 → Embedding → ChromaDB
   */
  async indexDocument(
    docId: string,
    text: string,
    metadata: Record<string, any>,
  ): Promise<number> {
    // 1. 文本分块
    const chunks = this.retrieverService.chunkText(text);

    if (chunks.length === 0) return 0;

    // 2. 批量向量化
    const embeddings = await this.embeddingService.embedTexts(chunks);

    // 3. 构建ID和元数据
    const ids = chunks.map((_, i) => `${docId}_chunk_${i}`);
    const metadatas = chunks.map((_, i) => ({
      ...metadata,
      chunk_index: i,
    }));

    // 4. 存入ChromaDB
    await this.chromaService.addDocuments(ids, embeddings, chunks, metadatas);

    return chunks.length;
  }
}
