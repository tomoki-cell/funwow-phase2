'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import MembershipBadge from '@/components/MembershipBadge'
import { X, Send, StickyNote, ChevronRight } from 'lucide-react'

type Plan = 'annual' | 'free'

interface Member {
  id: string
  name: string
  email: string
  plan: Plan
  joinedAt: string
  status: string
  memo: string
}

const initialMembers: Member[] = [
  { id: 'u1', name: '田中 花子', email: 'tanaka@example.com', plan: 'annual', joinedAt: '2025-01-15', status: 'active', memo: '' },
  { id: 'u2', name: '鈴木 一郎', email: 'suzuki@example.com', plan: 'free', joinedAt: '2025-02-20', status: 'active', memo: '' },
  { id: 'u3', name: '佐藤 みき', email: 'sato@example.com', plan: 'annual', joinedAt: '2025-03-01', status: 'active', memo: 'VIPゲスト。展示ごとに招待済み。' },
  { id: 'u4', name: '山本 直樹', email: 'yamamoto@example.com', plan: 'free', joinedAt: '2025-03-10', status: 'active', memo: '' },
  { id: 'u5', name: '高橋 さくら', email: 'takahashi@example.com', plan: 'annual', joinedAt: '2025-04-01', status: 'active', memo: '' },
  { id: 'u6', name: '伊藤 健二', email: 'ito@example.com', plan: 'free', joinedAt: '2025-04-05', status: 'active', memo: '' },
  { id: 'u7', name: '渡辺 美咲', email: 'watanabe@example.com', plan: 'annual', joinedAt: '2025-04-10', status: 'active', memo: '' },
]

export default function MembersPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()
  const subject = getSubjectBySlug(subjectSlug)
  const router = useRouter()

  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [filter, setFilter] = useState<'all' | Plan>('all')
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [memoEditId, setMemoEditId] = useState<string | null>(null)
  const [memoText, setMemoText] = useState('')
  const [showMsgModal, setShowMsgModal] = useState(false)
  const [msgSubject, setMsgSubject] = useState('')
  const [msgBody, setMsgBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  if (!subject) return <div className="text-gray-500">コミュニティが見つかりません</div>

  const filtered = members.filter((m) => filter === 'all' || m.plan === filter)
  const annualCount = members.filter((m) => m.plan === 'annual').length
  const freeCount = members.filter((m) => m.plan === 'free').length

  const allChecked = filtered.length > 0 && filtered.every((m) => checked.has(m.id))

  function toggleAll() {
    if (allChecked) {
      setChecked((prev) => {
        const next = new Set(prev)
        filtered.forEach((m) => next.delete(m.id))
        return next
      })
    } else {
      setChecked((prev) => {
        const next = new Set(prev)
        filtered.forEach((m) => next.add(m.id))
        return next
      })
    }
  }

  function toggleOne(id: string) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function openMemo(member: Member) {
    setMemoEditId(member.id)
    setMemoText(member.memo)
  }

  function saveMemo(id: string) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, memo: memoText } : m)))
    setMemoEditId(null)
  }

  async function sendMessage() {
    setSending(true)
    await new Promise((r) => setTimeout(r, 800))
    setSending(false)
    setSentSuccess(true)
    setTimeout(() => {
      setSentSuccess(false)
      setShowMsgModal(false)
      setMsgSubject('')
      setMsgBody('')
      setChecked(new Set())
    }, 1500)
  }

  const checkedMembers = members.filter((m) => checked.has(m.id))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">会員一覧</h1>
        <div className="flex items-center gap-3">
          {checked.size > 0 && (
            <button
              onClick={() => setShowMsgModal(true)}
              className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {checked.size}名にメッセージ
            </button>
          )}
          <button className="text-sm border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full hover:border-gray-400 transition-colors">
            CSV 書き出し
          </button>
        </div>
      </div>

      {/* サマリー */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{members.length}</div>
          <div className="text-sm text-gray-500">総会員数</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{annualCount}</div>
          <div className="text-sm text-gray-500">年会員</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{freeCount}</div>
          <div className="text-sm text-gray-500">フォロワー</div>
        </div>
      </div>

      {/* フィルタータブ */}
      <div className="flex gap-2 mb-4">
        {([['all', '全員'], ['annual', '年会員'], ['free', 'フォロワー']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setFilter(val); setChecked(new Set()) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === val
                ? 'bg-gray-900 text-white'
                : 'border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {label}
            {val === 'all' && ` (${members.length})`}
            {val === 'annual' && ` (${annualCount})`}
            {val === 'free' && ` (${freeCount})`}
          </button>
        ))}
      </div>

      {/* 会員テーブル */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={toggleAll}
                  className="rounded border-gray-300 accent-gray-900 cursor-pointer"
                />
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">名前</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">プラン</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">参加日</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">ステータス</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">メモ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <>
                <tr
                  key={member.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={checked.has(member.id)}
                      onChange={() => toggleOne(member.id)}
                      className="rounded border-gray-300 accent-gray-900 cursor-pointer"
                    />
                  </td>
                  <td
                    className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:text-gray-600"
                    onClick={() => router.push(`/manage/${subjectSlug}/members/${member.id}`)}
                  >
                    <div className="flex items-center gap-1">
                      {member.name}
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="text-xs text-gray-400 font-normal">{member.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <MembershipBadge plan={member.plan} />
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(member.joinedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      有効
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    {member.memo ? (
                      <span className="text-xs text-gray-500 line-clamp-1">{member.memo}</span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openMemo(member)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                      title="メモを編集"
                    >
                      <StickyNote className="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                {/* メモ編集行 */}
                {memoEditId === member.id && (
                  <tr key={`memo-${member.id}`} className="border-b border-gray-50 bg-yellow-50/50">
                    <td />
                    <td colSpan={6} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <textarea
                          value={memoText}
                          onChange={(e) => setMemoText(e.target.value)}
                          placeholder="管理用メモを入力（会員には表示されません）"
                          rows={2}
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                          autoFocus
                        />
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => saveMemo(member.id)}
                            className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setMemoEditId(null)}
                            className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-full hover:border-gray-400 transition-colors"
                          >
                            閉じる
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* メッセージ送信モーダル */}
      {showMsgModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">メッセージを送信</h2>
              <button onClick={() => !sending && setShowMsgModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {sentSuccess ? (
              <div className="px-6 py-10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <div className="font-medium text-gray-800">送信しました</div>
                <div className="text-sm text-gray-500 mt-1">{checkedMembers.length}名に送信済み</div>
              </div>
            ) : (
              <>
                <div className="px-6 py-5 space-y-4">
                  <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">
                    <div className="font-medium mb-1">送信先（{checkedMembers.length}名）</div>
                    <div className="flex flex-wrap gap-1.5">
                      {checkedMembers.map((m) => (
                        <span key={m.id} className="bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-xs">
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
                    <input
                      type="text"
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      placeholder="メールの件名"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                    <textarea
                      value={msgBody}
                      onChange={(e) => setMsgBody(e.target.value)}
                      placeholder="メッセージ本文を入力"
                      rows={5}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowMsgModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!msgSubject || !msgBody || sending}
                    className="flex items-center gap-1.5 px-5 py-2 text-sm bg-gray-900 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {sending ? '送信中…' : `${checkedMembers.length}名に送信`}
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
