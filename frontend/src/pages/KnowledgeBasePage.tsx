import { useState, useEffect, useRef } from 'react'
import { Button } from '../components/ui/Button'
import { useUIStore } from '../stores/uiStore'
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  seedKnowledgeBase,
} from '../services/knowledgeService'
import type { Document } from '../types/knowledge'
import { formatFileSize, formatTime } from '../utils/format'

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [total, setTotal] = useState(0)
  const [page] = useState(1)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { showToast } = useUIStore()

  const loadDocs = async () => {
    setLoading(true)
    try {
      const data = await getDocuments(page)
      setDocuments(data.documents)
      setTotal(data.total)
    } catch {
      showToast('加载失败', 'error')
    }
    setLoading(false)
  }

  useEffect(() => {
    loadDocs()
  }, [page])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await uploadDocument(file)
      showToast('上传成功，正在解析入库...', 'success')
      loadDocs()
    } catch {
      showToast('上传失败', 'error')
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该文档吗？')) return
    try {
      await deleteDocument(id)
      showToast('删除成功', 'success')
      loadDocs()
    } catch {
      showToast('删除失败', 'error')
    }
  }

  const handleSeed = async () => {
    setSeeding(true)
    try {
      const result = await seedKnowledgeBase()
      showToast(
        `知识库初始化完成：${result.indexed}/${result.total} 篇文档入库`,
        'success',
      )
      loadDocs()
    } catch {
      showToast('初始化失败', 'error')
    }
    setSeeding(false)
  }

  const statusMap: Record<string, { label: string; color: string }> = {
    uploading: { label: '上传中', color: 'bg-yellow-100 text-yellow-700' },
    parsing: { label: '解析中', color: 'bg-blue-100 text-blue-700' },
    indexing: { label: '索引入库中', color: 'bg-purple-100 text-purple-700' },
    completed: { label: '已入库', color: 'bg-green-100 text-green-700' },
    failed: { label: '失败', color: 'bg-red-100 text-red-700' },
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">知识库管理</h2>
          <p className="text-sm text-slate-500 mt-1">
            共 {total} 篇文档
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? '初始化中...' : '📂 从目录导入'}
          </Button>
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? '上传中...' : '📄 上传文档'}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.md,.txt"
            onChange={handleUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* 文档列表 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">加载中...</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            暂无文档，请上传或从目录导入
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-4 py-3 font-medium text-slate-600">文件名</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">分类</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">大小</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">状态</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">时间</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => {
                const status = statusMap[doc.status] || statusMap.failed
                return (
                  <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-700">{doc.originalName}</span>
                      <span className="text-xs text-slate-400 ml-2">.{doc.fileType}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {doc.category || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {doc.fileSize ? formatFileSize(Number(doc.fileSize)) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {formatTime(doc.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
