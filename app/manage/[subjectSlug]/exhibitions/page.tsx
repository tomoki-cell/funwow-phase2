'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus, X, PenLine, Building2, Calendar } from 'lucide-react'

type RelationType = 'creator_related' | 'venue_related' | 'fair_related' | 'presented_by'
type ExStatus = 'upcoming' | 'active' | 'ended'

interface Exhibition {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  space: string
  artistNames: string
  relationType: RelationType
  status: ExStatus
  coverImageUrl?: string
}

const relationLabels: Record<RelationType, string> = {
  creator_related: '作家として参加',
  venue_related:   '会場として開催',
  fair_related:    'フェアとして開催',
  presented_by:    '主催',
}

const statusConfig: Record<ExStatus, { label: string; style: string }> = {
  upcoming: { label: '開催予定', style: 'text-blue-600 bg-blue-50 border-blue-200' },
  active:   { label: '開催中',   style: 'text-green-600 bg-green-50 border-green-200' },
  ended:    { label: '終了',     style: 'text-gray-400 bg-gray-50 border-gray-200' },
}

const initialExhibitions: Exhibition[] = [
  {
    id: 'ex_001',
    title: '境界線の詩',
    description: '内と外、可視と不可視の間を問う3名の作家による展示。',
    startDate: '2025-05-24',
    endDate: '2025-06-20',
    space: 'Gallery HAKU（神楽坂）',
    artistNames: '山田 蒼、木下 真帆、李 承恩',
    relationType: 'venue_related',
    status: 'active',
    coverImageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
  },
  {
    id: 'ex_002',
    title: '静寂の間',
    description: '音と静寂の境界をテーマにした映像とインスタレーション展。',
    startDate: '2025-01-10',
    endDate: '2025-02-15',
    space: 'Gallery HAKU（神楽坂）',
    artistNames: '渡辺 光一',
    relationType: 'venue_related',
    status: 'ended',
    coverImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  },
]

const emptyForm = {
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  space: '',
  artistNames: '',
  relationType: 'venue_related' as RelationType,
  status: 'upcoming' as ExStatus,
  coverImageUrl: '',
}

function calcStatus(startDate: string, endDate: string): ExStatus {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (now < start) return 'upcoming'
  if (now > end) return 'ended'
  return 'active'
}

export default function ExhibitionsPage() {
  useParams<{ subjectSlug: string }>()

  const [exhibitions, setExhibitions] = useState<Exhibition[]>(initialExhibitions)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(ex: Exhibition) {
    setEditingId(ex.id)
    setForm({
      title: ex.title,
      description: ex.description,
      startDate: ex.startDate,
      endDate: ex.endDate,
      space: ex.space,
      artistNames: ex.artistNames,
      relationType: ex.relationType,
      status: ex.status,
      coverImageUrl: ex.coverImageUrl ?? '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))

    const status = form.startDate && form.endDate ? calcStatus(form.startDate, form.endDate) : form.status

    if (editingId) {
      setExhibitions((prev) =>
        prev.map((ex) => ex.id === editingId ? { ...ex, ...form, status } : ex)
      )
    } else {
      setExhibitions((prev) => [
        {
          id: `ex_${Date.now()}`,
          ...form,
          status,
          coverImageUrl: form.coverImageUrl || undefined,
        },
        ...prev,
      ])
    }

    setSaving(false)
    setShowModal(false)
  }

  const activeCount = exhibitions.filter((e) => e.status === 'active').length
  const upcomingCount = exhibitions.filter((e) => e.status === 'upcoming').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">展示登録</h1>
          <p className="text-sm text-gray-500 mt-1">
            開催中 {activeCount}件　開催予定 {upcomingCount}件
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          展示を追加
        </button>
      </div>

      <div className="space-y-3">
        {exhibitions.map((ex) => {
          const sc = statusConfig[ex.status]
          return (
            <div key={ex.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
              {ex.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ex.coverImageUrl}
                  alt={ex.title}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-gray-300" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">{ex.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{ex.artistNames}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.style}`}>
                      {sc.label}
                    </span>
                    <button
                      onClick={() => openEdit(ex)}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <PenLine className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {ex.space}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(ex.startDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    〜
                    {new Date(ex.endDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full">{relationLabels[ex.relationType]}</span>
                </div>

                {ex.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{ex.description}</p>
                )}
              </div>
            </div>
          )
        })}

        {exhibitions.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 px-5 py-10 text-center text-gray-400 text-sm">
            展示がありません
          </div>
        )}
      </div>

      {/* 作成 / 編集モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? '展示を編集' : '展示を追加'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">展示タイトル</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="例：境界線の詩"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">参加作家</label>
                <input
                  type="text"
                  value={form.artistNames}
                  onChange={(e) => setForm({ ...form, artistNames: e.target.value })}
                  placeholder="例：山田 蒼、木下 真帆（カンマ区切り）"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="展示の概要"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">会場</label>
                <input
                  type="text"
                  value={form.space}
                  onChange={(e) => setForm({ ...form, space: e.target.value })}
                  placeholder="例：Gallery HAKU（神楽坂）"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開始日</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">終了日</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">関係種別</label>
                  <select
                    value={form.relationType}
                    onChange={(e) => setForm({ ...form, relationType: e.target.value as RelationType })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {(Object.entries(relationLabels) as [RelationType, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ExStatus })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="upcoming">開催予定</option>
                    <option value="active">開催中</option>
                    <option value="ended">終了</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カバー画像URL（任意）</label>
                <input
                  type="text"
                  value={form.coverImageUrl}
                  onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                onClick={handleSave}
                disabled={!form.title || !form.startDate || !form.endDate || saving}
                className="px-5 py-2 text-sm bg-gray-900 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '保存中…' : editingId ? '更新する' : '追加する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
