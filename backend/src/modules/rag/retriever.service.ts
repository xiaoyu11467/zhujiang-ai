import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RetrieverService {
  constructor(private configService: ConfigService) {}

  /**
   * 将长文本切分成适合 Embedding 的分段
   */
  chunkText(text: string): string[] {
    const chunkSize = this.configService.get('CHUNK_SIZE', 500);
    const chunkOverlap = this.configService.get('CHUNK_OVERLAP', 50);
    const chunks: string[] = [];

    // 优先按段落分割
    const paragraphs = text.split(/\n\n+/);

    let currentChunk = '';
    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      // 简单按字符数估算（中文约1.5字符/token）
      const estimatedTokens = (currentChunk.length + trimmed.length) / 1.5;

      if (currentChunk && estimatedTokens > chunkSize) {
        chunks.push(currentChunk.trim());
        // 重叠：保留最后一部分
        const overlapText = currentChunk.slice(
          Math.max(0, currentChunk.length - chunkOverlap * 1.5),
        );
        currentChunk = overlapText + '\n\n' + trimmed;
      } else {
        currentChunk = currentChunk
          ? currentChunk + '\n\n' + trimmed
          : trimmed;
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * 组装 RAG Prompt：检索文档 + 用户问题 → 完整 Prompt
   */
  buildPrompt(
    question: string,
    retrievedDocs: string[],
  ): string {
    const context = retrievedDocs
      .map((doc, i) => `[参考资料${i + 1}]\n${doc}`)
      .join('\n\n');

    return `你是一名熟悉华南农业大学珠江学院校园生活的优秀学长，你的名字叫"珠江小智"。

请根据以下参考资料回答用户的问题。

## 回答原则：
1. 优先使用参考资料中的信息回答
2. 如果参考资料中没有相关信息，或你不确定，必须说明"这个我不太确定，建议你咨询辅导员或查看学校官网"
3. 绝不编造学校政策、规定
4. 语气亲切简单，像学长和学弟学妹聊天
5. 面向大一新生，使用通俗易懂的语言

## 图片显示规则：
当参考资料中有图片（如校园地图），你必须用 `![描述](图片URL)` 的 Markdown 语法输出图片，例如 `![华珠从化校区地图](/images/从化校区.jpg)`。聊天页面会自动把它渲染成真正的图片。**禁止**写"图片：xxx"这种纯文字描述，必须用 Markdown 图片语法。

## 联系人工服务 — Yu学长

Yu学长是华珠新生服务助手，微信：yux0620x，提供新生用品咨询、学车咨询、校园卡办理、校园服务推荐等人工服务。

⚠️ 重要规则：**不要在常规回答中主动推广微信**。仅当满足以下条件之一时，才推荐联系Yu学长：
1. 用户主动询问购买渠道（如"哪里买床上用品""怎么买新生用品""有没有推荐的"）
2. 用户主动需要人工帮助（如"有没有真人""我要找人工客服""AI帮不了我"）
3. 用户询问学车、驾校相关（如"学车怎么报名""学校附近有驾校吗"）

当触发推荐时，可以用类似语气：
"这个问题我可以帮你联系Yu学长（微信 yux0620x），他是专门帮新生处理这些事务的学长，你可以加他微信详细咨询一下～"

## 参考资料：
${context || '暂无相关参考资料'}

## 用户问题：
${question}

## 你的回答：`;
  }
}
