'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import { Lock, Eye, PenLine, X, Plus, Users } from 'lucide-react'
import type { Event, EventFormat, EventVisibility, EventStatus } from '@/lib/types'

const formatLabels: Record<EventFormat, string> = {
  online: 'オンライン',
  offline: 'オフライン',
  hybrid: 'ハイブリッド',
}

const emptyForm = {
  title: '',
  description: '',
  startDate: '',
  startTime: '14:00',
  endDate: '',
  endTime: '16:00',
  eventFormat: 'offline' as EventFormat,
  visibility: 'public' as EventVisibility,
  status: 'draft' as EventStatus,
  capacity: '',
  locationText: '',
}

const mockParticipants: Record<string, { id: string; name: string; status: string; appliedAt: string }[]> = {
  event_s_001: [
    { id: 'u1', name: '田中 花子', status: 'attended', appliedAt: '2025-04-25' },
    { id: 'u3', name: '佐藤 みき', status: 'attended', appliedAt: '2025-04-26' },
    { id: 'u5', name: '高橋 さくら', status: 'applied', appliedAt: '2025-04-28' },
  ],
  event_s_002: [
    { id: 'u1', name: '田中 花子', status: 'applied', appliedAt: '2025-04-20' },
    { id: 'u2', name: '鈴木 一郎', status: 'applied', appliedAt: '2025-04-21' },
    { id: 'u4', name: '山本 直樹', status: 'applied', appliedAt: '2025-04-22' },
    { id: 'u5', name: '高橋 さくら', status: 'waitlisted', appliedAt: '2025-04-23' },
  ],
}

const statusLabels: Record<string, { label: string; style: string }> = {
  applied: { label: '申込済', style: 'text-blue-600 bg-blue-50 border-blue-200' },
  attended: { label: '参加済', style: 'text-green-600 bg-green-50 border-green-200' },
  waitlisted: { label: 'キャンセル待ち', style: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  canceled: { label: 'キャンセル', style: 'text-gray-500 bg-gray-50 border-gray-200' },
}

export default function ManageEventsPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()
  const subject = getSubjectBySlug(subjectSlug)

  const [events, setEvents] = useState<Event[]>(subject?.upcomingEvents ?? [])
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)

  if (!subject) return <div className="text-gray-500">コミュニティが見つかりません</div>

  function openCreate() {
    setEditingEvent(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(event: Event) {
    setEditingEvent(event)
    const start = new Date(event.startAt)
    const end = new Date(event.endAt)
    setForm({
      title: event.title,
      description: event.description,
      startDate: start.toISOString().split('T')[0],
      startTime: start.toISOString().split('T')[1].slice(0, 5),
      endDate: end.toISOString().split('T')[0],
      endTime: end.toISOString().split('T')[1].slice(0, 5),
      eventFormat: event.eventFormat,
      visibility: event.visibility,
      status: event.status,
      capacity: event.capacity?.toString() ?? '',
      locationText: event.locationText ?? '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))

    const startAt = new Date(`${form.startDate}T${form.startTime}:00+09:00`).toISOString()
    const endAt = new Date(`${form.endDate || form.startDate}T${form.endTime}:00+09:00`).toISOString()

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? { ...e, title: form.title, description: form.description, startAt, endAt, eventFormat: form.eventFormat, visibility: form.visibility, status: form.status, capacity: form.capacity ? parseInt(form.capacity) : undefined, locationText: form.locationText || undefined }
            : e
        )
      )
    } else {
      const newEvent: Event = {
        id: `event_new_${Date.now()}`,
        organizerSubjectId: subject!.id,
        isFunwowHosted: false,
        title: form.title,
        description: form.description,
        startAt,
        endAt,
        eventFormat: form.eventFormat,
        visibility: form.visibility,
        status: form.status,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        locationText: form.locationText || undefined,
        createdByUserId: 'user_admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setEvents((prev) => [newEvent, ...prev])
    }

    setSaving(false)
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">イベント管理</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          新しいイベント
        </button>
      </div>

      <div className="space-y-3">
        {events.map((event) => {
          const participants = mockParticipants[event.id] ?? []
          const isExpanded = expandedEventId === event.id

          return (
            <div key={event.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800">{event.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>{new Date(event.startAt).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{formatLabels[event.eventFormat]}</span>
                    {event.capacity && <span>定員 {event.capacity}名</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {event.visibility === 'members_only' ? (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Lock className="w-3 h-3" /> 会員限定
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Eye className="w-3 h-3" /> 公開
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    event.status === 'published' ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-500 bg-gray-50 border-gray-200'
                  }`}>
                    {event.status === 'published' ? '公開中' : '下書き'}
                  </span>

                  <button
                    onClick={() => setExpandedEventId(isExpanded ? null : event.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-3 py-1 hover:border-gray-400 transition-colors"
                  >
                    <Users className="w-3 h-3" />
                    参加者 {participants.length}名
                  </button>

                  <button
                    onClick={() => openEdit(event)}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 参加者一覧（展開） */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {participants.length === 0 ? (
                    <div className="px-5 py-4 text-sm text-gray-400 text-center">申込者なし</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-100">
                        <tr>
                          <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">参加者</th>
                          <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">申込日</th>
                          <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">ステータス</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participants.map((p) => (
                          <tr key={p.id} className="border-b border-gray-100 last:border-0">
                            <td className="px-5 py-2.5 font-medium text-gray-700">{p.name}</td>
                            <td className="px-5 py-2.5 text-gray-500">{new Date(p.appliedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</td>
                            <td className="px-5 py-2.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusLabels[p.status]?.style ?? ''}`}>
                                {statusLabels[p.status]?.label ?? p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {events.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 px-5 py-10 text-center text-gray-400 text-sm">
            イベントがありません
          </div>
        )}
      </div>

      {/* 新規作成 / 編集モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingEvent ? 'イベントを編集' : '新しいイベント'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="イベント名を入力"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="イベントの説明"
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開始日時</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <input
                      type="time"
                      value={form.startTime}
                      onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                      className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">終了時刻</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">形式</label>
                  <select
                    value={form.eventFormat}
                    onChange={(e) => setForm({ ...form, eventFormat: e.target.value as EventFormat })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="offline">オフライン</option>
                    <option value="online">オンライン</option>
                    <option value="hybrid">ハイブリッド</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公開範囲</label>
                  <select
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value as EventVisibility })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="public">公開</option>
                    <option value="members_only">会員限定</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">定員</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    placeholder="例: 20"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>

              {form.eventFormat !== 'online' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開催場所</label>
                  <input
                    type="text"
                    value={form.locationText}
                    onChange={(e) => setForm({ ...form, locationText: e.target.value })}
                    placeholder="例: Gallery HAKU（神楽坂）"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="draft">下書き</option>
                  <option value="published">公開する</option>
                </select>
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
                disabled={!form.title || !form.startDate || saving}
                className="px-5 py-2 text-sm bg-gray-900 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '保存中…' : editingEvent ? '更新する' : '作成する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
