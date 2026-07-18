import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
@UseGuards(AuthGuard('jwt'))
export class KnowledgeController {
  constructor(private knowledgeService: KnowledgeService) {}

  @Get('documents')
  async getDocuments(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.knowledgeService.getDocuments(+page, +pageSize);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.knowledgeService.uploadDocument(file);
  }

  @Delete('documents/:id')
  async deleteDocument(@Param('id') id: string) {
    return this.knowledgeService.deleteDocument(id);
  }

  @Post('seed')
  async seedKnowledgeBase() {
    return this.knowledgeService.seedKnowledgeBase();
  }
}
