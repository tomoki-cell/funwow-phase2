'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Send, X, Users, Eye, MousePointer, ChevronDown } from 'lucide-react'

interface SentMessage {
  id: string
  sentAt: string
  subject: string
  body: string
  recipientFilter: string
  recipientCount: number
  openRate: number
  clickRate: number
}

const initialMessages: SentMessage[] = [
  {
    id: 'msg_001',
    sentAt: '2025-04-20T10:00:00Z',
    subject: '【Gallery HAKU】5月展示「境界線の詩」のご案内',
    body: 'いつもGallery HAKUをご支援いただきありがとうございます。5月24日より「境界線の詩」を開催いたします。ぜひご来場ください。',
    recipientFilter: '全会員',
    recipientCount: 7,
    openRate: 71,
    clickRate: 28,
  },
  {
    id: 'msg_002',
    sentAt: '2025-04-15T14:00:00Z',
    subject: '【会員限定】5月23日プレビューへのご招待',
    body: '年会員の皆様へ。一般公開前日5月23日18時より、会員限定プレビューを開催します。アーティストとのQ&Aもございます。',
    recipientFilter: '年会員のみ',
    recipientCount: 3,
    openRate: 100,
    clickRate: 66,
  },
  {
    id: 'msg_003',
    sentAt: '2025-03-28T09:00:00Z',
    subject: '新メンバーへようこそ！Gallery HAKUコミュニティのご案内',
    body: 'コミュニティへのご参加ありがとうございます。当ギャラリーのコミュニティでは、展示のお知らせや会員限定イベントをお届けします。',
    recipientFilter: '新規参加者',
    recipientCount: 2,
    openRate: 100,
    clickRate: 50,
  },
]

export default function MessagesPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()

  const [messages, setMessages] = useState<SentMessage[]>(initialMessages)
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState({ subject: '', body: '', recipientFilter: '全会員' })
  const [sending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  const recipientOptions = [
    { value: '全会員', count: 7 },
    { value: '年会員のみ', count: 3 },
    { value: 'フォロワーのみ', count: 4 },
    { value: '新規参加者（30日以内）', count: 1 },
  ]

  async function handleSend() {
    setSending(true)
    await new Promise((r) => setTimeout(r, 800))

    const selected = recipientOptions.find((o) => o.value === form.recipientFilter)
    const newMsg: SentMessage = {
      id: `msg_${Date.now()}`,
      sentAt: new Date().toISOString(),
      subject: form.subject,
      body: form.body,
      recipientFilter: form.recipientFilter,
      recipientCount: selected?.count ?? 0,
      openRate: 0,
      clickRate: 0,
    }

    setSending(false)
    setSentSuccess(true)
    setTimeout(() => {
      setMessages((prev) => [newMsg, ...prev])
      setSentSuccess(false)
      setShowModal(false)
      setForm({ subject: '', body: '', recipientFilter: '全会員' })
    }, 1500)
  }

  const totalSent = messages.reduce((sum, m) => sum + m.recipientCount, 0)
  const avgOpenRate = Math.round(messages.reduce((sum, m) => sum + m.openRate, 0) / messages.length)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">メール送信履歴</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          新しいメッセージ
        </button>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
          <div className="text-sm text-gray-500">送信通数</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{totalSent}</div>
          <div className="text-sm text-gray-500">累計送信数</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{avgOpenRate}%</div>
          <div className="text-sm text-gray-500">平均開封率</div>
        </div>
      </div>

      {/* 送信履歴リスト */}
      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 line-clamp-1">{msg.subject}</div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>{new Date(msg.sentAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {msg.recipientFilter}（{msg.recipientCount}名）
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-5 flex-shrink-0">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                    <Eye className="w-3.5 h-3.5 text-gray-400" />
                    {msg.openRate}%
                  </div>
                  <div className="text-xs text-gray-400">開封率</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                    <MousePointer className="w-3.5 h-3.5 text-gray-400" />
                    {msg.clickRate}%
                  </div>
                  <div className="text-xs text-gray-400">クリック率</div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === msg.id ? 'rotate-180' : ''}`}
                />
              </div>
            </div>

            {/* 展開：本文プレビュー */}
            {expandedId === msg.id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                <div className="text-sm text-gray-600 whitespace-pre-wrap">{msg.body}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 送信モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">新しいメッセージ</h2>
              <button onClick={() => !sending && setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sentSuccess ? (
              <div className="px-6 py-10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <div className="font-medium text-gray-800">送信しました</div>
              </div>
            ) : (
              <>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">送信先</label>
                    <select
                      value={form.recipientFilter}
                      onChange={(e) => setForm({ ...form, recipientFilter: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                    >
                      {recipientOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.value}（{o.count}名）
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="メールの件名"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                    <textarea
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      placeholder="メッセージ本文"
                      rows={6}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!form.subject || !form.body || sending}
                    className="flex items-center gap-1.5 px-5 py-2 text-sm bg-gray-900 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sending ? '送信中…' : '送信する'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
