/**
 * 珠江小智 - Vercel Serverless API
 * 统一入口，处理所有 /api/* 请求
 */

// 内嵌知识库数据（构建时从 knowledge_base 目录加载）
const KNOWLEDGE_DOCS = []

// 简单的关键词哈希向量
function hashVector(text, dims = 1536) {
  const v = new Array(dims).fill(0)
  for (let i = 0; i < text.length - 1; i++) {
    let h = 0
    for (let j = 0; j < 2 && i + j < text.length; j++) {
      h = ((h << 5) - h + text.charCodeAt(i + j)) | 0
    }
    v[Math.abs(h) % dims] += 1
  }
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0))
  if (n > 0) v.forEach((_, i) => (v[i] /= n))
  return v
}

function cosineSim(a, b) {
  let d = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  const den = Math.sqrt(na) * Math.sqrt(nb)
  return den === 0 ? 0 : d / den
}

function searchKnowledge(question, topK = 5) {
  if (KNOWLEDGE_DOCS.length === 0) return []
  const qv = hashVector(question)
  const scored = KNOWLEDGE_DOCS.map((doc, i) => ({ i, score: cosineSim(qv, doc.vector) }))
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, topK).map((s) => KNOWLEDGE_DOCS[s.i].text)
}

function buildPrompt(question, docs) {
  const ctx = docs.map((d, i) => `[参考${i + 1}]\n${d}`).join('\n\n')
  return `你是华南农业大学珠江学院的AI学长"珠江小智"。
回答原则：优先使用参考资料，不确定就说"建议咨询辅导员"，不编造政策，语气亲切像学长对新生。

## Yu学长微信：yux0620x（新生用品/学车/人工帮助时可推荐，平时不主动推广）

## 参考资料：
${ctx || '暂无参考资料'}

## 用户问题：
${question}

## 回答：`
}

// 内存存储
const conversations = new Map()
const messages = new Map()
let adminUser = null

// ============ 路由处理 ============

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const path = req.url.replace('/api', '') || '/'
  const method = req.method

  try {
    // 路由分发
    if (path === '/' || path === '') return res.json({ name: '珠江小智 API', version: '1.0' })

    // Chat
    if (path === '/chat/send' && method === 'POST') return handleChatSend(req, res)
    if (path === '/chat/conversations' && method === 'GET') return handleGetConversations(req, res)
    if (path.startsWith('/chat/conversations/') && method === 'GET') return handleGetMessages(req, res, path)
    if (path.startsWith('/chat/conversations/') && method === 'DELETE') return handleDeleteConversation(req, res, path)
    if (path === '/chat/feedback' && method === 'POST') return handleFeedback(req, res)

    // Auth
    if (path === '/auth/login' && method === 'POST') return handleLogin(req, res)

    // Analytics
    if (path === '/analytics/overview' && method === 'GET') return res.json({ totalConversations: conversations.size, totalMessages: 0, todayMessages: 0, todayConversations: 0, avgSatisfaction: 0 })
    if (path === '/analytics/trend' && method === 'GET') return res.json([])
    if (path === '/analytics/hot-questions' && method === 'GET') return res.json([])
    if (path === '/analytics/track' && method === 'POST') return res.json({ ok: true })

    // 404
    return res.status(404).json({ error: 'Not found', path })
  } catch (e) {
    console.error('API Error:', e.message)
    return res.status(500).json({ error: e.message })
  }
}

// ============ Chat Handlers ============

async function handleChatSend(req, res) {
  const { question, sessionId, conversationId } = req.body || {}
  if (!question) return res.status(400).json({ error: 'question required' })

  const sId = sessionId || 'anon'
  let cId = conversationId
  if (!cId || !conversations.has(cId)) {
    cId = 'conv_' + Date.now() + '_' + Math.random().toString(36).slice(2)
    conversations.set(cId, { id: cId, sessionId: sId, title: question.slice(0, 30), createdAt: new Date().toISOString() })
    messages.set(cId, [])
  }

  const convMsgs = messages.get(cId) || []

  // RAG 检索
  const docs = searchKnowledge(question)
  const prompt = buildPrompt(question, docs)

  // 调用 DeepSeek API
  const apiKey = process.env.DEEPSEEK_API_KEY || ''
  if (!apiKey || apiKey.includes('your-')) {
    // 无 API Key 时返回模拟回答
    const reply = `你好！我是珠江小智。关于「${question.slice(0, 30)}」这个问题，建议你登录学校官网 https://www.scauzj.edu.cn/ 查看最新信息，或者咨询辅导员。需要人工帮助可以联系 Yu学长（微信 yux0620x）。`
    convMsgs.push({ role: 'user', content: question })
    convMsgs.push({ role: 'assistant', content: reply })
    messages.set(cId, convMsgs)

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.write(`data: ${JSON.stringify({ type: 'meta', conversationId: cId })}\n\n`)
    for (const char of reply) {
      res.write(`data: ${JSON.stringify({ type: 'content', content: char })}\n\n`)
    }
    return res.end('data: [DONE]\n\n')
  }

  // SSE 流式响应
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  res.write(`data: ${JSON.stringify({ type: 'meta', conversationId: cId })}\n\n`)

  try {
    const response = await fetch(process.env.DEEPSEEK_BASE_URL + '/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 2000,
      }),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullReply = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      const lines = text.split('\n').filter((l) => l.startsWith('data: '))
      for (const line of lines) {
        const data = line.slice(6).trim()
        if (data === '[DONE]') continue
        try {
          const json = JSON.parse(data)
          const content = json.choices?.[0]?.delta?.content
          if (content) {
            fullReply += content
            res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`)
          }
        } catch {}
      }
    }

    convMsgs.push({ role: 'user', content: question })
    convMsgs.push({ role: 'assistant', content: fullReply })
    messages.set(cId, convMsgs)
  } catch (e) {
    res.write(`data: ${JSON.stringify({ type: 'error', content: 'AI服务暂时不可用: ' + e.message })}\n\n`)
  }

  res.end('data: [DONE]\n\n')
}

function handleGetConversations(req, res) {
  const { sessionId } = req.query
  const list = Array.from(conversations.values())
    .filter((c) => !sessionId || c.sessionId === sessionId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return res.json(list)
}

function handleGetMessages(req, res, path) {
  const id = path.split('/').pop()
  const msgs = messages.get(id) || []
  return res.json(msgs)
}

function handleDeleteConversation(req, res, path) {
  const id = path.split('/').pop()
  conversations.delete(id)
  messages.delete(id)
  return res.json({ success: true })
}

function handleFeedback(req, res) {
  const { messageId, rating, reason } = req.body || {}
  console.log('Feedback:', messageId, rating, reason)
  return res.json({ success: true })
}

function handleLogin(req, res) {
  const { username, password } = req.body || {}
  // 简易认证（生产环境应使用 JWT + bcrypt）
  const ADMIN_USER = process.env.ADMIN_USER || 'admin'
  const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123'

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const jwt = require('jsonwebtoken')
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )
    return res.json({ accessToken: token, user: { id: '1', username, role: 'admin' } })
  }
  return res.status(401).json({ error: '用户名或密码错误' })
}

// ============ 构建时加载知识库 ============
const fs = require('fs')
const path = require('path')

function loadKnowledgeAtBuildTime() {
  try {
    const kbDir = path.join(__dirname, '..', 'knowledge_base')
    if (!fs.existsSync(kbDir)) return
    const dirs = fs.readdirSync(kbDir, { withFileTypes: true })
    for (const dir of dirs) {
      if (dir.isDirectory() && !dir.name.startsWith('.')) {
        const catPath = path.join(kbDir, dir.name)
        const files = fs.readdirSync(catPath, { withFileTypes: true })
        for (const f of files) {
          if (f.isFile() && f.name.endsWith('.md')) {
            const text = fs.readFileSync(path.join(catPath, f.name), 'utf-8')
            const chunks = text.split(/\n\n+/).filter((c) => c.trim().length > 50)
            for (const chunk of chunks) {
              KNOWLEDGE_DOCS.push({ text: chunk.trim(), vector: hashVector(chunk.trim()), category: dir.name })
            }
          }
        }
      }
    }
    console.log(`知识库已加载: ${KNOWLEDGE_DOCS.length} 条`)
  } catch (e) {
    console.error('知识库加载失败:', e.message)
  }
}

loadKnowledgeAtBuildTime()
