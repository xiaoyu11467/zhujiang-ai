import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { RagModule } from '../rag/rag.module';
import { LlmModule } from '../llm/llm.module';
import { PrismaModule } from '../../common/prisma.module';

@Module({
  imports: [PrismaModule, RagModule, LlmModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
