'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import { Lock, Eye, PenLine, X, Plus, Users, Building2, Ticket, Trash2 } from 'lucide-react'
import type { Event, EventFormat, EventVisibility, EventStatus } from '@/lib/types'

const formatLabels: Record<EventFormat, string> = {
  online: 'オンライン',
  offline: 'オフライン',
  hybrid: 'ハイブリッド',
}

interface TicketType {
  id: string
  name: string
  price: number
  capacity: number
  soldCount: number
  memberOnly: boolean
}

interface EventWithExtras extends Event {
  linkedExhibitionId?: string
  tickets: TicketType[]
}

const mockExhibitions = [
  { id: 'ex_001', title: '境界線の詩', status: 'active' },
  { id: 'ex_002', title: '静寂の間', status: 'ended' },
]

const mockParticipants: Record<string, { id: string; name: string; status: string; appliedAt: string; ticketType?: string }[]> = {
  event_s_001: [
    { id: 'u01', name: '佐藤 みき',    status: 'attended',   appliedAt: '2025-04-25', ticketType: '会員限定' },
    { id: 'u03', name: '田中 花子',    status: 'attended',   appliedAt: '2025-04-26', ticketType: '会員限定' },
    { id: 'u05', name: '高橋 さくら',  status: 'applied',    appliedAt: '2025-04-28', ticketType: '会員限定' },
  ],
  event_s_002: [
    { id: 'u02', name: '渡辺 美咲',    status: 'applied',    appliedAt: '2025-04-20', ticketType: '一般' },
    { id: 'u04', name: '加藤 健太',    status: 'applied',    appliedAt: '2025-04-21', ticketType: '学生' },
    { id: 'u06', name: '伊藤 直樹',    status: 'applied',    appliedAt: '2025-04-22', ticketType: '一般' },
    { id: 'u07', name: '山口 恵美',    status: 'waitlisted', appliedAt: '2025-04-23', ticketType: '一般' },
  ],
}

const statusConfig: Record<string, { label: string; style: string }> = {
  applied:    { label: '申込済',        style: 'text-blue-600 bg-blue-50 border-blue-200' },
  attended:   { label: '参加済',        style: 'text-green-600 bg-green-50 border-green-200' },
  waitlisted: { label: 'キャンセル待ち', style: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  canceled:   { label: 'キャンセル',    style: 'text-gray-500 bg-gray-50 border-gray-200' },
}

const emptyForm = {
  title: '',
  description: '',
  startDate: '',
  startTime: '14:00',
  endTime: '16:00',
  eventFormat: 'offline' as EventFormat,
  visibility: 'public' as EventVisibility,
  status: 'draft' as EventStatus,
  capacity: '',
  locationText: '',
  linkedExhibitionId: '',
}

const defaultTicket: Omit<TicketType, 'id'> = {
  name: '一般',
  price: 1000,
  capacity: 20,
  soldCount: 0,
  memberOnly: false,
}

export default function ManageEventsPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()
  const subject = getSubjectBySlug(subjectSlug)

  const [events, setEvents] = useState<EventWithExtras[]>(
    (subject?.upcomingEvents ?? []).map((e) => ({
      ...e,
      tickets: e.id === 'event_s_002'
        ? [
            { id: 't1', name: '一般',   price: 0,    capacity: 40, soldCount: 3, memberOnly: false },
            { id: 't2', name: '学生',   price: 0,    capacity: 10, soldCount: 1, memberOnly: false },
          ]
        : [],
    }))
  )
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventWithExtras | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandTab, setExpandTab] = useState<'participants' | 'tickets'>('participants')

  if (!subject) return <div className="text-gray-500">コミュニティが見つかりません</div>

  function openCreate() {
    setEditingEvent(null)
    setForm(emptyForm)
    setTickets([])
    setShowModal(true)
  }

  function openEdit(event: EventWithExtras) {
    setEditingEvent(event)
    const start = new Date(event.startAt)
    const end = new Date(event.endAt)
    setForm({
      title: event.title,
      description: event.description,
      startDate: start.toISOString().split('T')[0],
      startTime: start.toISOString().split('T')[1].slice(0, 5),
      endTime: end.toISOString().split('T')[1].slice(0, 5),
      eventFormat: event.eventFormat,
      visibility: event.visibility,
      status: event.status,
      capacity: event.capacity?.toString() ?? '',
      locationText: event.locationText ?? '',
      linkedExhibitionId: event.linkedExhibitionId ?? '',
    })
    setTickets([...event.tickets])
    setShowModal(true)
  }

  function addTicket() {
    setTickets((prev) => [...prev, { ...defaultTicket, id: `t_${Date.now()}` }])
  }

  function updateTicket(id: string, field: keyof TicketType, value: string | number | boolean) {
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t))
  }

  function removeTicket(id: string) {
    setTickets((prev) => prev.filter((t) => t.id !== id))
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))

    const startAt = new Date(`${form.startDate}T${form.startTime}:00+09:00`).toISOString()
    const endAt = new Date(`${form.startDate}T${form.endTime}:00+09:00`).toISOString()

    if (editingEvent) {
      setEvents((prev) => prev.map((e) => e.id === editingEvent.id
        ? { ...e, title: form.title, description: form.description, startAt, endAt, eventFormat: form.eventFormat, visibility: form.visibility, status: form.status, capacity: form.capacity ? parseInt(form.capacity) : undefined, locationText: form.locationText || undefined, linkedExhibitionId: form.linkedExhibitionId || undefined, tickets }
        : e
      ))
    } else {
      const newEvent: EventWithExtras = {
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
        linkedExhibitionId: form.linkedExhibitionId || undefined,
        tickets,
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
          const linkedEx = mockExhibitions.find((ex) => ex.id === event.linkedExhibitionId)
          const isExpanded = expandedId === event.id
          const totalTicketCapacity = event.tickets.reduce((s, t) => s + t.capacity, 0)
          const totalSold = event.tickets.reduce((s, t) => s + t.soldCount, 0)

          return (
            <div key={event.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800">{event.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                    <span>{new Date(event.startAt).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>{formatLabels[event.eventFormat]}</span>
                    {linkedEx && (
                      <span className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                        <Building2 className="w-3 h-3" />
                        {linkedEx.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {event.visibility === 'members_only' ? (
                    <span className="flex items-center gap-1 text-gray-500 text-xs"><Lock className="w-3 h-3" />会員限定</span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-xs"><Eye className="w-3 h-3" />公開</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${event.status === 'published' ? 'text-green-600 bg-green-50 border-green-200' : 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                    {event.status === 'published' ? '公開中' : '下書き'}
                  </span>

                  <button
                    onClick={() => { setExpandedId(isExpanded ? null : event.id); setExpandTab('participants') }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-3 py-1 hover:border-gray-400 transition-colors"
                  >
                    <Users className="w-3 h-3" />
                    {participants.length}名
                  </button>

                  {event.tickets.length > 0 && (
                    <button
                      onClick={() => { setExpandedId(isExpanded && expandTab === 'tickets' ? null : event.id); setExpandTab('tickets') }}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-3 py-1 hover:border-gray-400 transition-colors"
                    >
                      <Ticket className="w-3 h-3" />
                      {totalSold}/{totalTicketCapacity}
                    </button>
                  )}

                  <button onClick={() => openEdit(event)} className="text-gray-400 hover:text-gray-700 transition-colors">
                    <PenLine className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 展開パネル */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {/* タブ切替 */}
                  <div className="flex border-b border-gray-100">
                    <button
                      onClick={() => setExpandTab('participants')}
                      className={`px-5 py-2.5 text-xs font-medium transition-colors ${expandTab === 'participants' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      参加者 ({participants.length}名)
                    </button>
                    <button
                      onClick={() => setExpandTab('tickets')}
                      className={`px-5 py-2.5 text-xs font-medium transition-colors ${expandTab === 'tickets' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      チケット ({event.tickets.length}種)
                    </button>
                  </div>

                  {expandTab === 'participants' ? (
                    participants.length === 0 ? (
                      <div className="px-5 py-4 text-sm text-gray-400 text-center">申込者なし</div>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="border-b border-gray-100">
                          <tr>
                            <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">参加者</th>
                            <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">チケット</th>
                            <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">申込日</th>
                            <th className="text-left px-5 py-2.5 text-xs text-gray-500 font-medium">ステータス</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((p) => (
                            <tr key={p.id} className="border-b border-gray-100 last:border-0">
                              <td className="px-5 py-2.5 font-medium text-gray-700">{p.name}</td>
                              <td className="px-5 py-2.5 text-xs text-gray-500">{p.ticketType ?? '—'}</td>
                              <td className="px-5 py-2.5 text-gray-500">{new Date(p.appliedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}</td>
                              <td className="px-5 py-2.5">
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusConfig[p.status]?.style ?? ''}`}>
                                  {statusConfig[p.status]?.label ?? p.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  ) : (
                    <div className="p-4">
                      {event.tickets.length === 0 ? (
                        <div className="text-sm text-gray-400 text-center py-2">チケット未設定</div>
                      ) : (
                        <div className="space-y-2">
                          {event.tickets.map((t) => (
                            <div key={t.id} className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100 text-sm">
                              <div className="flex-1 font-medium text-gray-800">{t.name}</div>
                              <div className="text-gray-500">¥{t.price.toLocaleString()}</div>
                              <div className="text-gray-500">{t.soldCount}/{t.capacity}枚</div>
                              {t.memberOnly && <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">会員限定</span>}
                              <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.round((t.soldCount / t.capacity) * 100)}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
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

      {/* 作成 / 編集モーダル */}
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
              {/* 基本情報 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="イベント名" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none" />
              </div>

              {/* 関連展示 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  関連展示（任意）
                </label>
                <select
                  value={form.linkedExhibitionId}
                  onChange={(e) => setForm({ ...form, linkedExhibitionId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  <option value="">紐づけなし</option>
                  {mockExhibitions.map((ex) => (
                    <option key={ex.id} value={ex.id}>{ex.title}</option>
                  ))}
                </select>
              </div>

              {/* 日時 */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">開催日</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開始</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">終了</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">形式</label>
                  <select value={form.eventFormat} onChange={(e) => setForm({ ...form, eventFormat: e.target.value as EventFormat })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                    <option value="offline">オフライン</option>
                    <option value="online">オンライン</option>
                    <option value="hybrid">ハイブリッド</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公開範囲</label>
                  <select value={form.visibility} onChange={(e) => setForm({ ...form, visibility: e.target.value as EventVisibility })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                    <option value="public">公開</option>
                    <option value="members_only">会員限定</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as EventStatus })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                    <option value="draft">下書き</option>
                    <option value="published">公開する</option>
                  </select>
                </div>
              </div>

              {form.eventFormat !== 'online' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">開催場所</label>
                  <input type="text" value={form.locationText} onChange={(e) => setForm({ ...form, locationText: e.target.value })} placeholder="例: Gallery HAKU（神楽坂）" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              )}

              {/* チケット設定 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5" />
                    チケット設定
                  </label>
                  <button onClick={addTicket} className="flex items-center gap-1 text-xs text-gray-600 border border-gray-200 rounded-full px-3 py-1 hover:border-gray-400 transition-colors">
                    <Plus className="w-3 h-3" />
                    追加
                  </button>
                </div>

                {tickets.length === 0 ? (
                  <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-4 py-3 text-center">
                    チケットなし（無料・申込制）
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* ヘッダー */}
                    <div className="grid grid-cols-[1fr_80px_70px_70px_24px] gap-2 px-2 text-xs text-gray-400">
                      <div>種別名</div><div>価格（¥）</div><div>定員</div><div>会員限定</div><div />
                    </div>
                    {tickets.map((t) => (
                      <div key={t.id} className="grid grid-cols-[1fr_80px_70px_70px_24px] gap-2 items-center">
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => updateTicket(t.id, 'name', e.target.value)}
                          placeholder="例: 一般"
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <input
                          type="number"
                          value={t.price}
                          onChange={(e) => updateTicket(t.id, 'price', parseInt(e.target.value) || 0)}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <input
                          type="number"
                          value={t.capacity}
                          onChange={(e) => updateTicket(t.id, 'capacity', parseInt(e.target.value) || 0)}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={t.memberOnly}
                            onChange={(e) => updateTicket(t.id, 'memberOnly', e.target.checked)}
                            className="accent-gray-900 w-4 h-4 cursor-pointer"
                          />
                        </div>
                        <button onClick={() => removeTicket(t.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-colors">
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
