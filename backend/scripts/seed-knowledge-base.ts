/**
 * 知识库初始化脚本
 * 读取 knowledge_base/ 目录下所有 .md 文件，分块并存入本地向量数据库
 *
 * 用法: npx ts-node scripts/seed-knowledge-base.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import OpenAI from 'openai'

// 加载环境变量
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

// ============ 关键词哈希向量（语义API不可用时的回退方案） ============
function keywordHashVector(text: string, dims = 1536): number[] {
  const vec = new Array(dims).fill(0)
  for (let i = 0; i < text.length - 1; i++) {
    const bigram = text.slice(i, i + 2)
    let hash = 0
    for (let j = 0; j < bigram.length; j++) {
      hash = ((hash << 5) - hash + bigram.charCodeAt(j)) | 0
    }
    const idx = Math.abs(hash) % dims
    vec[idx] += 1
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0))
  if (norm > 0) {
    for (let i = 0; i < dims; i++) vec[i] /= norm
  }
  return vec
}

// 简易向量存储（复用 local-vector-store 的逻辑）
interface VectorEntry {
  id: string
  embedding: number[]
  document: string
  metadata: Record<string, any>
}

class SimpleVectorStore {
  private data: VectorEntry[] = []
  private storePath: string

  constructor() {
    this.storePath = path.resolve(__dirname, '../data-vector-campus_knowledge.json')
    this.load()
  }

  private load() {
    try {
      if (fs.existsSync(this.storePath)) {
        this.data = JSON.parse(fs.readFileSync(this.storePath, 'utf-8'))
      }
    } catch { this.data = [] }
  }

  private save() {
    fs.writeFileSync(this.storePath, JSON.stringify(this.data, null, 2))
  }

  add(ids: string[], embeddings: number[][], documents: string[], metadatas: Record<string, any>[]) {
    for (let i = 0; i < ids.length; i++) {
      this.data.push({ id: ids[i], embedding: embeddings[i], document: documents[i], metadata: metadatas[i] })
    }
    this.save()
  }

  get count() { return this.data.length }
}

// ============ 主流程 ============

const KNOWLEDGE_BASE_DIR = path.resolve(__dirname, '../../knowledge_base')
const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50

function chunkText(text: string): string[] {
  const chunks: string[] = []
  const paragraphs = text.split(/\n\n+/)
  let current = ''

  for (const p of paragraphs) {
    const trimmed = p.trim()
    if (!trimmed) continue
    const estimatedTokens = (current.length + trimmed.length) / 1.5
    if (current && estimatedTokens > CHUNK_SIZE) {
      chunks.push(current.trim())
      const overlap = current.slice(Math.max(0, current.length - CHUNK_OVERLAP * 1.5))
      current = overlap + '\n\n' + trimmed
    } else {
      current = current ? current + '\n\n' + trimmed : trimmed
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

async function loadKnowledgeBase(): Promise<
  Array<{ filename: string; content: string; category: string }>
> {
  const results: Array<{ filename: string; content: string; category: string }> = []
  const categories = fs.readdirSync(KNOWLEDGE_BASE_DIR, { withFileTypes: true })

  for (const cat of categories) {
    if (cat.isDirectory() && !cat.name.startsWith('.')) {
      const catPath = path.join(KNOWLEDGE_BASE_DIR, cat.name)
      const files = fs.readdirSync(catPath, { withFileTypes: true })
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.md')) {
          const content = fs.readFileSync(path.join(catPath, file.name), 'utf-8')
          results.push({ filename: file.name, content, category: cat.name })
        }
      }
    }
  }
  return results
}

async function main() {
  console.log('=== 珠江小智 知识库初始化 ===\n')

  const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY
  const baseURL = process.env.OPENAI_BASE_URL || process.env.DEEPSEEK_BASE_URL || 'https://api.openai.com/v1'

  if (!apiKey || apiKey.includes('your-')) {
    console.log('⚠️  未配置有效的 API Key，将生成占位向量（仅用于测试结构）')
    console.log('   请在 backend/.env 中配置 OPENAI_API_KEY 或 DEEPSEEK_API_KEY\n')
  }

  // 读取知识库
  console.log('📂 读取知识库目录...')
  const files = await loadKnowledgeBase()
  console.log(`   找到 ${files.length} 个文档\n`)

  let totalChunks = 0
  const store = new SimpleVectorStore()

  // 清空已有数据
  if (store.count > 0) {
    console.log(`⚠️  向量存储已有 ${store.count} 条记录，将被清空`)
    // 清空文件
    fs.writeFileSync(path.resolve(__dirname, '../data-vector-campus_knowledge.json'), '[]')
  }

  for (const file of files) {
    console.log(`📄 [${file.category}] ${file.filename} (${file.content.length} 字符)`)

    const chunks = chunkText(file.content)
    console.log(`   → ${chunks.length} 个分段`)

    const ids: string[] = []
    const documents: string[] = []
    const metadatas: Record<string, any>[] = []

    for (let i = 0; i < chunks.length; i++) {
      ids.push(`${file.category}_${file.filename}_${i}`)
      documents.push(chunks[i])
      metadatas.push({
        filename: file.filename,
        category: file.category,
        chunk_index: i,
      })
    }

    // 生成 embedding（如果有 API key 则调用，否则用零向量占位）
    let embeddings: number[][]
    if (apiKey && !apiKey.includes('your-')) {
      try {
        const client = new OpenAI({ apiKey, baseURL })
        const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
        const response = await client.embeddings.create({ model, input: documents })
        embeddings = response.data.map((d) => d.embedding)
        console.log(`   ✅ 向量化完成 (${embeddings.length} 条)`)
      } catch (e: any) {
        console.log(`   ⚠️  Embedding API 调用失败: ${e.message}`)
        console.log('   → 使用关键词哈希向量（基础匹配可用）')
        embeddings = documents.map((d) => keywordHashVector(d))
      }
    } else {
      // 没有 API key，使用关键词哈希向量
      embeddings = documents.map((d) => keywordHashVector(d))
      console.log('   → 关键词哈希向量（基础匹配可用）')
    }

    store.add(ids, embeddings, documents, metadatas)
    totalChunks += chunks.length
  }

  console.log(`\n✅ 知识库初始化完成`)
  console.log(`   文档数: ${files.length}`)
  console.log(`   分段数: ${totalChunks}`)
  console.log(`   向量维度: 1536`)
  console.log(`\n💡 提示：配置有效的 OPENAI_API_KEY 后重新运行此脚本，即可获得语义搜索能力`)
}

main().catch((e) => {
  console.error('初始化失败:', e)
  process.exit(1)
})
