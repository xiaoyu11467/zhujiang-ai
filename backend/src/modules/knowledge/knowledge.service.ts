import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RagService } from '../rag/rag.service';
import { DocumentParserService } from './document-parser.service';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class KnowledgeService {
  constructor(
    private prisma: PrismaClient,
    private ragService: RagService,
    private parser: DocumentParserService,
    private configService: ConfigService,
  ) {}

  /**
   * 获取文档列表
   */
  async getDocuments(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.document.count(),
    ]);
    return { documents, total, page, pageSize };
  }

  /**
   * 上传并处理文档
   */
  async uploadDocument(
    file: Express.Multer.File,
    category?: string,
  ): Promise<any> {
    if (!file) throw new BadRequestException('未上传文件');

    // 1. 保存文件元信息
    const fileType = path.extname(file.originalname).replace('.', '');
    const document = await this.prisma.document.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        fileType,
        fileSize: file.size,
        status: 'parsing',
        category,
      },
    });

    try {
      // 2. 解析文本
      const text = await this.parser.parseFile(file.path, fileType);

      await this.prisma.document.update({
        where: { id: document.id },
        data: { status: 'indexing', charCount: text.length },
      });

      // 3. 入库到向量数据库
      const chunkCount = await this.ragService.indexDocument(
        document.id,
        text,
        {
          doc_id: document.id,
          filename: file.originalname,
          category: category || 'uncategorized',
        },
      );

      // 4. 更新状态
      await this.prisma.document.update({
        where: { id: document.id },
        data: { status: 'completed', chunkCount },
      });

      return { ...document, status: 'completed', chunkCount };
    } catch (error) {
      await this.prisma.document.update({
        where: { id: document.id },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      });
      throw error;
    }
  }

  /**
   * 删除文档
   */
  async deleteDocument(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new BadRequestException('文档不存在');

    // 删除上传的文件
    const filePath = path.join('uploads', doc.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除数据库记录
    await this.prisma.document.delete({ where: { id } });

    // 注意：ChromaDB中的分段不会自动删除，需要通过删除collection实现
    return { success: true };
  }

  /**
   * 批量导入知识库目录
   */
  async seedKnowledgeBase(): Promise<{
    total: number;
    indexed: number;
  }> {
    const kbDir = this.configService.get(
      'KNOWLEDGE_BASE_DIR',
      '../knowledge_base',
    );
    const fullPath = path.resolve(kbDir);

    if (!fs.existsSync(fullPath)) {
      throw new BadRequestException(`知识库目录不存在: ${fullPath}`);
    }

    const files = await this.parser.loadKnowledgeBaseDir(fullPath);

    let indexed = 0;
    for (const file of files) {
      try {
        // 创建文档记录
        const document = await this.prisma.document.create({
          data: {
            filename: file.filename,
            originalName: file.filename,
            fileType: 'md',
            status: 'indexing',
            category: file.category,
            charCount: file.content.length,
            sourceUrl: '',
          },
        });

        // 入库
        const chunkCount = await this.ragService.indexDocument(
          document.id,
          file.content,
          {
            doc_id: document.id,
            filename: file.filename,
            category: file.category,
          },
        );

        await this.prisma.document.update({
          where: { id: document.id },
          data: { status: 'completed', chunkCount },
        });

        indexed++;
      } catch (error) {
        console.error(`索引失败: ${file.filename}`, error.message);
      }
    }

    return { total: files.length, indexed };
  }
}
