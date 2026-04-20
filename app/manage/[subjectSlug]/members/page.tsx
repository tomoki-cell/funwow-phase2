'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { mockMembers, getParticipationsByUserId, getMemberStats } from '@/lib/mock/members'
import MembershipBadge from '@/components/MembershipBadge'
import {
  X, Send, StickyNote, MapPin, Calendar, ChevronDown, ChevronUp,
  ArrowUpDown, ExternalLink, Building2
} from 'lucide-react'

type SortKey = 'participationCount' | 'lastVisit' | 'joinedAt'
type SortDir = 'asc' | 'desc'
type FilterPlan = 'all' | 'annual' | 'free'

const engagementConfig = {
  high:   { label: '常連', dot: 'bg-green-500',  bar: 'bg-green-500',  text: 'text-green-700' },
  medium: { label: 'アクティブ', dot: 'bg-blue-400', bar: 'bg-blue-400',  text: 'text-blue-700' },
  low:    { label: '低め',  dot: 'bg-yellow-400', bar: 'bg-yellow-400', text: 'text-yellow-700' },
  none:   { label: '未来訪', dot: 'bg-gray-300',  bar: 'bg-gray-200',  text: 'text-gray-400' },
}

export default function MembersPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()

  const [filterPlan, setFilterPlan] = useState<FilterPlan>('all')
  const [sortKey, setSortKey] = useState<SortKey>('participationCount')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [memoEditId, setMemoEditId] = useState<string | null>(null)
  const [memoTexts, setMemoTexts] = useState<Record<string, string>>({})
  const [savedMemos, setSavedMemos] = useState<Record<string, string>>(
    Object.fromEntries(mockMembers.map((m) => [m.id, m.memo]))
  )
  const [showMsgModal, setShowMsgModal] = useState(false)
  const [msgSubject, setMsgSubject] = useState('')
  const [msgBody, setMsgBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  const membersWithStats = useMemo(
    () => mockMembers.map((m) => ({ ...m, stats: getMemberStats(m.id) })),
    []
  )

  const filtered = useMemo(() => {
    let list = membersWithStats
    if (filterPlan !== 'all') list = list.filter((m) => m.plan === filterPlan)
    return [...list].sort((a, b) => {
      let va: number, vb: number
      if (sortKey === 'participationCount') {
        va = a.stats.hakuCount; vb = b.stats.hakuCount
      } else if (sortKey === 'lastVisit') {
        va = a.stats.lastVisit ? new Date(a.stats.lastVisit).getTime() : 0
        vb = b.stats.lastVisit ? new Date(b.stats.lastVisit).getTime() : 0
      } else {
        va = new Date(a.joinedAt).getTime()
        vb = new Date(b.joinedAt).getTime()
      }
      return sortDir === 'desc' ? vb - va : va - vb
    })
  }, [membersWithStats, filterPlan, sortKey, sortDir])

  const maxCount = Math.max(...membersWithStats.map((m) => m.stats.hakuCount), 1)
  const annualCount = mockMembers.filter((m) => m.plan === 'annual').length
  const freeCount = mockMembers.filter((m) => m.plan === 'free').length
  const activeCount = membersWithStats.filter((m) => m.stats.engagement !== 'none').length

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />
    return sortDir === 'desc'
      ? <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
      : <ChevronUp className="w-3.5 h-3.5 text-gray-700" />
  }

  function toggleAll() {
    const allChecked = filtered.every((m) => checked.has(m.id))
    setChecked(allChecked
      ? new Set([...checked].filter((id) => !filtered.find((m) => m.id === id)))
      : new Set([...checked, ...filtered.map((m) => m.id)])
    )
  }

  async function sendMessage() {
    setSending(true)
    await new Promise((r) => setTimeout(r, 800))
    setSending(false)
    setSentSuccess(true)
    setTimeout(() => {
      setSentSuccess(false)
      setShowMsgModal(false)
      setMsgSubject(''); setMsgBody('')
      setChecked(new Set())
    }, 1500)
  }

  const selectedMember = selectedMemberId
    ? membersWithStats.find((m) => m.id === selectedMemberId) ?? null
    : null
  const selectedHistory = selectedMemberId ? getParticipationsByUserId(selectedMemberId) : []
  const hakuHistory = selectedHistory.filter((r) => r.place === 'Gallery HAKU')
  const otherHistory = selectedHistory.filter((r) => r.place !== 'Gallery HAKU')
  const checkedMembers = mockMembers.filter((m) => checked.has(m.id))

  return (
    <div className="relative">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">会員管理</h1>
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{mockMembers.length}</div>
          <div className="text-sm text-gray-500">総会員数</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{annualCount}</div>
          <div className="text-sm text-gray-500">年会員</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
          <div className="text-sm text-gray-500">来訪あり</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{mockMembers.length - activeCount}</div>
          <div className="text-sm text-gray-500 text-red-500">未来訪</div>
        </div>
      </div>

      {/* フィルター＋ソート */}
      <div className="flex items-center justify-between mb-4 gap-4">
        <div className="flex gap-2">
          {([['all', 'すべて', mockMembers.length], ['annual', '年会員', annualCount], ['free', 'フォロワー', freeCount]] as const).map(([val, label, count]) => (
            <button
              key={val}
              onClick={() => { setFilterPlan(val); setChecked(new Set()) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterPlan === val ? 'bg-gray-900 text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>ソート：</span>
          {([['participationCount', '来館回数'], ['lastVisit', '最終来訪'], ['joinedAt', '参加日']] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleSort(key)}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-colors ${
                sortKey === key ? 'border-gray-900 text-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              {label}
              <SortIcon k={key} />
            </button>
          ))}
        </div>
      </div>

      {/* 会員テーブル */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && filtered.every((m) => checked.has(m.id))}
                  onChange={toggleAll}
                  className="rounded border-gray-300 accent-gray-900 cursor-pointer"
                />
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">会員</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">プラン</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium w-48">
                <button onClick={() => toggleSort('participationCount')} className="flex items-center gap-1 hover:text-gray-800">
                  来館回数 <SortIcon k="participationCount" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">
                <button onClick={() => toggleSort('lastVisit')} className="flex items-center gap-1 hover:text-gray-800">
                  最終来訪 <SortIcon k="lastVisit" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">メモ</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => {
              const { stats } = member
              const eng = engagementConfig[stats.engagement]
              const barWidth = `${Math.round((stats.hakuCount / maxCount) * 100)}%`

              return (
                <>
                  <tr
                    key={member.id}
                    className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${
                      selectedMemberId === member.id ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked.has(member.id)}
                        onChange={() => setChecked((prev) => {
                          const next = new Set(prev)
                          next.has(member.id) ? next.delete(member.id) : next.add(member.id)
                          return next
                        })}
                        className="rounded border-gray-300 accent-gray-900 cursor-pointer"
                      />
                    </td>

                    <td
                      className="px-4 py-3 cursor-pointer"
                      onClick={() => setSelectedMemberId(selectedMemberId === member.id ? null : member.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${eng.dot}`} title={eng.label} />
                        <div>
                          <div className="font-medium text-gray-800 hover:text-gray-600 flex items-center gap-1">
                            {member.name}
                            <ExternalLink className="w-3 h-3 text-gray-300" />
                          </div>
                          <div className="text-xs text-gray-400">{member.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <MembershipBadge plan={member.plan} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 w-28 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${eng.bar}`}
                            style={{ width: barWidth }}
                          />
                        </div>
                        <span className={`text-xs font-semibold w-6 text-right ${eng.text}`}>
                          {stats.hakuCount}
                        </span>
                        {stats.otherCount > 0 && (
                          <span
                            className="text-xs text-blue-500 bg-blue-50 rounded px-1 py-0.5"
                            title={`他スペース来訪：${stats.otherVenueNames.join('、')}`}
                          >
                            +{stats.otherCount} 他
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs text-gray-500">
                      {stats.lastVisit ? (
                        <div>
                          <div>{new Date(stats.lastVisit).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</div>
                          <div className={`text-xs mt-0.5 ${
                            (stats.daysSinceLastVisit ?? 0) > 90 ? 'text-red-400' :
                            (stats.daysSinceLastVisit ?? 0) > 30 ? 'text-yellow-500' : 'text-green-500'
                          }`}>
                            {stats.daysSinceLastVisit === 0 ? '今日' : `${stats.daysSinceLastVisit}日前`}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-300">未来訪</span>
                      )}
                    </td>

                    <td className="px-4 py-3 max-w-[160px]">
                      {savedMemos[member.id] ? (
                        <span className="text-xs text-gray-500 line-clamp-1">{savedMemos[member.id]}</span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setMemoEditId(memoEditId === member.id ? null : member.id)
                          setMemoTexts((prev) => ({ ...prev, [member.id]: savedMemos[member.id] ?? '' }))
                        }}
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
                            value={memoTexts[member.id] ?? ''}
                            onChange={(e) => setMemoTexts((prev) => ({ ...prev, [member.id]: e.target.value }))}
                            placeholder="管理用メモ（会員には表示されません）"
                            rows={2}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                            autoFocus
                          />
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() => {
                                setSavedMemos((prev) => ({ ...prev, [member.id]: memoTexts[member.id] ?? '' }))
                                setMemoEditId(null)
                              }}
                              className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors"
                            >保存</button>
                            <button
                              onClick={() => setMemoEditId(null)}
                              className="px-3 py-1.5 text-xs border border-gray-200 text-gray-600 rounded-full hover:border-gray-400 transition-colors"
                            >閉じる</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        {(Object.entries(engagementConfig) as [keyof typeof engagementConfig, typeof engagementConfig['high']][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        ))}
        <span className="ml-2">来館回数はGallery HAKUのみ、+N他は他ギャラリー来訪数</span>
      </div>

      {/* ===== 詳細ポップアップ（右ドロワー） ===== */}
      {selectedMember && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setSelectedMemberId(null)}
          />
          <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${engagementConfig[selectedMember.stats.engagement].dot}`} />
                <div>
                  <div className="font-bold text-gray-900">{selectedMember.name}</div>
                  <div className="text-xs text-gray-400">{selectedMember.email}</div>
                </div>
              </div>
              <button onClick={() => setSelectedMemberId(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-5 space-y-6">
              {/* プロフィール */}
              <div className="flex items-center gap-4">
                <MembershipBadge plan={selectedMember.plan} />
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">有効</span>
                <span className="text-xs text-gray-400">
                  {new Date(selectedMember.joinedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}参加
                </span>
              </div>

              {/* エンゲージメントサマリー */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-gray-900">{selectedMember.stats.hakuCount}</div>
                  <div className="text-xs text-gray-500 mt-0.5">来館回数</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-gray-900">{selectedMember.stats.otherCount}</div>
                  <div className="text-xs text-gray-500 mt-0.5">他スペース</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <div className={`text-xl font-bold ${
                    !selectedMember.stats.daysSinceLastVisit ? 'text-gray-300' :
                    selectedMember.stats.daysSinceLastVisit > 90 ? 'text-red-500' :
                    selectedMember.stats.daysSinceLastVisit > 30 ? 'text-yellow-500' : 'text-green-600'
                  }`}>
                    {selectedMember.stats.daysSinceLastVisit !== null ? `${selectedMember.stats.daysSinceLastVisit}日` : '—'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">最終来訪</div>
                </div>
              </div>

              {/* メモ */}
              {savedMemos[selectedMember.id] && (
                <div className="bg-yellow-50 rounded-xl px-4 py-3 text-sm text-gray-700 flex gap-2">
                  <StickyNote className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  {savedMemos[selectedMember.id]}
                </div>
              )}

              {/* Gallery HAKU来訪履歴 */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  Gallery HAKU 来訪履歴
                  <span className="text-xs font-normal text-gray-400">({hakuHistory.length}件)</span>
                </div>
                {hakuHistory.length === 0 ? (
                  <div className="text-sm text-gray-400 py-2">記録なし</div>
                ) : (
                  <div className="space-y-1.5">
                    {hakuHistory.map((r) => (
                      <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            r.type === 'event' ? 'bg-blue-400' :
                            r.type === 'pass' ? 'bg-purple-400' : 'bg-green-400'
                          }`} />
                          <div>
                            <div className="text-sm text-gray-700">{r.detail}</div>
                            <div className="text-xs text-gray-400">{r.label}</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {new Date(r.occurredAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 他Funwow登録スペース来訪 */}
              {otherHistory.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    他スペース来訪
                    <span className="text-xs font-normal text-gray-400">({otherHistory.length}件)</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">Funwow登録スペースへのチェックイン（Phase1連携）</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {selectedMember.stats.otherVenueNames.map((name: string) => (
                      <span key={name} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2 py-0.5">
                        {name}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {otherHistory.map((r) => (
                      <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-300 mt-1.5" />
                          <div>
                            <div className="text-sm text-gray-700 font-medium">{r.place}</div>
                            <div className="text-xs text-gray-400">{r.detail}</div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {new Date(r.occurredAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* アクション */}
              <div className="border-t border-gray-100 pt-4 flex gap-2">
                <button
                  onClick={() => {
                    setChecked((prev) => {
                      const next = new Set(prev)
                      next.add(selectedMember.id)
                      return next
                    })
                    setSelectedMemberId(null)
                    setShowMsgModal(true)
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 text-white rounded-full py-2 text-sm hover:bg-gray-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  メッセージ送信
                </button>
                <button
                  onClick={() => {
                    setMemoEditId(selectedMember.id)
                    setMemoTexts((prev) => ({ ...prev, [selectedMember.id]: savedMemos[selectedMember.id] ?? '' }))
                    setSelectedMemberId(null)
                  }}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-600 rounded-full px-4 py-2 text-sm hover:border-gray-400 transition-colors"
                >
                  <StickyNote className="w-3.5 h-3.5" />
                  メモ
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
                  <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
                    <div className="font-medium text-gray-700 mb-1.5">送信先（{checkedMembers.length}名）</div>
                    <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
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
                  <button onClick={() => setShowMsgModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-colors">
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
