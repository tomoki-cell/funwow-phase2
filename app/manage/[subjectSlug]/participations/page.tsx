'use client'

import { useState, useMemo } from 'react'
import { mockParticipations, mockMembers } from '@/lib/mock/members'

const typeConfig: Record<string, { label: string; style: string }> = {
  event:  { label: 'イベント参加', style: 'text-blue-600 bg-blue-50 border-blue-200' },
  visit:  { label: 'チェックイン',  style: 'text-green-600 bg-green-50 border-green-200' },
  pass:   { label: '会員証提示',    style: 'text-purple-600 bg-purple-50 border-purple-200' },
}

const memberMap = Object.fromEntries(mockMembers.map((m) => [m.id, m.name]))

const sorted = [...mockParticipations].sort(
  (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
)

export default function ParticipationsPage() {
  const [filterType, setFilterType] = useState<'all' | 'event' | 'visit' | 'pass'>('all')
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

  const filtered = useMemo(
    () => filterType === 'all' ? sorted : sorted.filter((p) => p.type === filterType),
    [filterType]
  )

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">参加履歴</h1>
          <p className="text-sm text-gray-500 mt-1">全{filtered.length}件</p>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex gap-2 mb-4">
        {([['all', 'すべて'], ['event', 'イベント参加'], ['visit', 'チェックイン'], ['pass', '会員証提示']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => { setFilterType(val); setPage(1) }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterType === val ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">種別</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">会員</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">内容</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">場所</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">日時</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((p) => {
              const cfg = typeConfig[p.type]
              return (
                <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg?.style ?? ''}`}>
                      {cfg?.label ?? p.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">
                    {memberMap[p.userId] ?? p.userId}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{p.detail}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{p.place}</td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(p.occurredAt).toLocaleDateString('ja-JP', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            前へ
          </button>
          <span className="text-sm text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  )
}
