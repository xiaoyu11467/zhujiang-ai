import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { DocumentParserService } from './document-parser.service';
import { RagModule } from '../rag/rag.module';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule, RagModule],
  controllers: [KnowledgeController],
  providers: [KnowledgeService, DocumentParserService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}
