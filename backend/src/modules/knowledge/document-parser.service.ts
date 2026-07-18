import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentParserService {
  /**
   * 解析文件返回文本内容
   */
  async parseFile(filePath: string, fileType: string): Promise<string> {
    switch (fileType) {
      case 'txt':
        return this.parseTxt(filePath);
      case 'md':
        return this.parseMd(filePath);
      case 'pdf':
        return this.parsePdf(filePath);
      case 'docx':
        return this.parseDocx(filePath);
      case 'url':
        return this.parseUrl(filePath);
      default:
        throw new Error(`不支持的文件类型: ${fileType}`);
    }
  }

  private async parseTxt(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private async parseMd(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private async parsePdf(filePath: string): Promise<string> {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  private async parseDocx(filePath: string): Promise<string> {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  private async parseUrl(filePath: string): Promise<string> {
    // URL内容从文件读取（预先抓取好的HTML内容）
    const content = fs.readFileSync(filePath, 'utf-8');
    const cheerio = require('cheerio');
    const $ = cheerio.load(content);
    return $('body').text().replace(/\s+/g, ' ').trim();
  }

  /**
   * 从知识库目录批量加载 Markdown 文件
   */
  async loadKnowledgeBaseDir(dirPath: string): Promise<
    Array<{ filename: string; content: string; category: string }>
  > {
    const results: Array<{
      filename: string;
      content: string;
      category: string;
    }> = [];

    const categories = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const category of categories) {
      if (category.isDirectory() && !category.name.startsWith('.')) {
        const categoryPath = path.join(dirPath, category.name);
        const files = fs.readdirSync(categoryPath, { withFileTypes: true });
        for (const file of files) {
          if (file.isFile() && file.name.endsWith('.md')) {
            const filePath = path.join(categoryPath, file.name);
            const content = fs.readFileSync(filePath, 'utf-8');
            results.push({
              filename: file.name,
              content,
              category: category.name,
            });
          }
        }
      }
    }

    return results;
  }
}
