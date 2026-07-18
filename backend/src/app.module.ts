import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma.module';
import { ChatModule } from './modules/chat/chat.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { RagModule } from './modules/rag/rag.module';
import { LlmModule } from './modules/llm/llm.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ChatModule,
    KnowledgeModule,
    RagModule,
    LlmModule,
    AuthModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
