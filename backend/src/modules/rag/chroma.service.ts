import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocalVectorStore } from '../../common/local-vector-store';

@Injectable()
export class ChromaService implements OnModuleInit {
  private store: LocalVectorStore;
  private storeName: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.storeName =
      this.configService.get('CHROMA_COLLECTION') || 'campus_knowledge';
    this.store = new LocalVectorStore(this.storeName);
    console.log(`本地向量存储已初始化: ${this.storeName} (${this.store.count} 条)`);
  }

  async addDocuments(
    ids: string[],
    embeddings: number[][],
    documents: string[],
    metadatas: Record<string, any>[],
  ) {
    await this.store.add(ids, embeddings, documents, metadatas);
  }

  async query(
    queryEmbedding: number[],
    nResults = 5,
  ): Promise<{ documents: string[]; metadatas: Record<string, any>[] }> {
    return this.store.query(queryEmbedding, nResults);
  }

  async deleteCollection() {
    await this.store.delete();
  }
}
