import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { EmbeddingService } from './embedding.service';
import { RetrieverService } from './retriever.service';
import { ChromaService } from './chroma.service';

@Module({
  providers: [RagService, EmbeddingService, RetrieverService, ChromaService],
  exports: [RagService],
})
export class RagModule {}
