/**
 * 本地文件向量存储
 * 在 ChromaDB 不可用时作为替代方案
 * 使用简单的文件 JSON 存储 + 余弦相似度搜索
 */
import * as fs from 'fs'
import * as path from 'path'

interface VectorEntry {
  id: string
  embedding: number[]
  document: string
  metadata: Record<string, any>
}

export class LocalVectorStore {
  private data: VectorEntry[] = []
  private storePath: string
  private dirty = false

  constructor(name: string) {
    this.storePath = path.resolve(`./data-vector-${name}.json`)
    this.load()
  }

  private load() {
    try {
      if (fs.existsSync(this.storePath)) {
        const raw = fs.readFileSync(this.storePath, 'utf-8')
        this.data = JSON.parse(raw)
        console.log(`本地向量存储已加载: ${this.data.length} 条记录`)
      }
    } catch {
      this.data = []
    }
  }

  private save() {
    const dir = path.dirname(this.storePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(this.storePath, JSON.stringify(this.data, null, 2))
    this.dirty = false
  }

  async add(
    ids: string[],
    embeddings: number[][],
    documents: string[],
    metadatas: Record<string, any>[],
  ) {
    for (let i = 0; i < ids.length; i++) {
      this.data.push({
        id: ids[i],
        embedding: embeddings[i],
        document: documents[i],
        metadata: metadatas[i] || {},
      })
    }
    this.dirty = true
    this.save()
    console.log(`本地向量存储: 已添加 ${ids.length} 条记录`)
  }

  async query(
    queryEmbedding: number[],
    nResults = 5,
  ): Promise<{
    documents: string[]
    metadatas: Record<string, any>[]
  }> {
    if (this.data.length === 0) {
      return { documents: [], metadatas: [] }
    }

    // 计算余弦相似度
    const scores = this.data.map((entry, idx) => ({
      idx,
      score: this.cosineSimilarity(queryEmbedding, entry.embedding),
    }))

    // 排序取 top-K
    scores.sort((a, b) => b.score - a.score)
    const topK = scores.slice(0, nResults)

    return {
      documents: topK.map((s) => this.data[s.idx].document),
      metadatas: topK.map((s) => this.data[s.idx].metadata),
    }
  }

  async delete() {
    this.data = []
    if (fs.existsSync(this.storePath)) {
      fs.unlinkSync(this.storePath)
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dot = 0
    let normA = 0
    let normB = 0
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB)
    return denom === 0 ? 0 : dot / denom
  }

  get count(): number {
    return this.data.length
  }
}
