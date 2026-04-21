'use client'

import { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
  Benefit,
  BenefitUsage,
  BenefitType,
  MemberPlanCode,
  UsageStatus,
  mockBenefits,
  mockBenefitUsages,
  benefitTypeLabel,
  planDisplayName,
  getBenefitUsages,
} from '@/lib/mock/benefits'
import { Gift, Plus, ChevronDown, ChevronUp, Users, Pencil, ToggleLeft, ToggleRight, X, Check, Clock } from 'lucide-react'

const ALL_PLANS: MemberPlanCode[] = [
  'free', 'annual', 'standard_individual', 'standard_corporate', 'premium_individual', 'premium_corporate',
]

const BENEFIT_TYPES: BenefitType[] = [
  'event_registration', 'private_viewing', 'discount', 'exclusive_content', 'point_bonus',
]

const STATUS_CONFIG: Record<UsageStatus, { label: string; cls: string }> = {
  pending:    { label: '申請中', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved:   { label: '承認済み', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  checked_in: { label: '参加済み', cls: 'bg-green-50 text-green-700 border-green-200' },
  used:       { label: '使用済み', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
  expired:    { label: '期限切れ', cls: 'bg-red-50 text-red-400 border-red-100' },
  declined:   { label: '不承認', cls: 'bg-gray-50 text-gray-400 border-gray-200' },
}

const TYPE_COLOR: Record<BenefitType, string> = {
  event_registration: 'bg-purple-50 text-purple-700',
  private_viewing:    'bg-amber-50 text-amber-700',
  discount:           'bg-green-50 text-green-700',
  exclusive_content:  'bg-blue-50 text-blue-700',
  point_bonus:        'bg-pink-50 text-pink-700',
}

interface BenefitForm {
  title: string
  description: string
  type: BenefitType
  applicablePlans: MemberPlanCode[]
  requiresApproval: boolean
  discountRate: string
  eventDate: string
  eventLocation: string
  capacity: string
  isActive: boolean
}

const emptyForm: BenefitForm = {
  title: '', description: '', type: 'event_registration',
  applicablePlans: ['standard_individual', 'premium_individual'],
  requiresApproval: false, discountRate: '', eventDate: '', eventLocation: '', capacity: '', isActive: true,
}

export default function BenefitsPage() {
  const params = useParams()
  const subjectSlug = params.subjectSlug as string

  const [benefits, setBenefits] = useState<Benefit[]>(
    mockBenefits.filter((b) => b.subjectSlug === subjectSlug)
  )
  const [usages] = useState<BenefitUsage[]>(mockBenefitUsages)
  const [expandedBenefit, setExpandedBenefit] = useState<string | null>(null)
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<BenefitForm>(emptyForm)
  const [filterStatus, setFilterStatus] = useState<UsageStatus | 'all'>('all')

  // 全申請（このsubjectの特典に絞る）
  const subjectBenefitIds = useMemo(() => new Set(benefits.map((b) => b.id)), [benefits])
  const filteredUsages = useMemo(() =>
    usages.filter((u) =>
      subjectBenefitIds.has(u.benefitId) &&
      (filterStatus === 'all' || u.status === filterStatus)
    ), [usages, subjectBenefitIds, filterStatus]
  )

  function openCreate() {
    setEditingBenefit(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(benefit: Benefit) {
    setEditingBenefit(benefit)
    setForm({
      title: benefit.title,
      description: benefit.description,
      type: benefit.type,
      applicablePlans: [...benefit.applicablePlans],
      requiresApproval: benefit.requiresApproval,
      discountRate: benefit.discountRate?.toString() ?? '',
      eventDate: benefit.eventDate ?? '',
      eventLocation: benefit.eventLocation ?? '',
      capacity: benefit.capacity?.toString() ?? '',
      isActive: benefit.isActive,
    })
    setShowModal(true)
  }

  function handleSave() {
    const base = {
      subjectSlug,
      title: form.title,
      description: form.description,
      type: form.type,
      applicablePlans: form.applicablePlans,
      requiresApproval: form.requiresApproval,
      discountRate: form.discountRate ? Number(form.discountRate) : undefined,
      eventDate: form.eventDate || undefined,
      eventLocation: form.eventLocation || undefined,
      capacity: form.capacity ? Number(form.capacity) : undefined,
      usageCount: 0,
      isActive: form.isActive,
    }
    if (editingBenefit) {
      setBenefits((prev) => prev.map((b) => b.id === editingBenefit.id ? { ...b, ...base } : b))
    } else {
      setBenefits((prev) => [...prev, { id: `b_${Date.now()}`, ...base }])
    }
    setShowModal(false)
  }

  function toggleActive(id: string) {
    setBenefits((prev) => prev.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b))
  }

  function togglePlan(plan: MemberPlanCode) {
    setForm((prev) => ({
      ...prev,
      applicablePlans: prev.applicablePlans.includes(plan)
        ? prev.applicablePlans.filter((p) => p !== plan)
        : [...prev.applicablePlans, plan],
    }))
  }

  const pendingCount = filteredUsages.filter((u) => u.status === 'pending').length

  return (
    <div className="max-w-4xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-900">特典管理</h1>
          </div>
          <p className="text-sm text-gray-500">会員プランに紐づく特典を設定・管理します</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新規特典を追加
        </button>
      </div>

      {/* 特典一覧 */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">設定中の特典</h2>
        <div className="space-y-3">
          {benefits.map((benefit) => {
            const benefitUsages = getBenefitUsages(benefit.id)
            const pendingN = benefitUsages.filter((u) => u.status === 'pending').length
            const isExpanded = expandedBenefit === benefit.id

            return (
              <div
                key={benefit.id}
                className={`bg-white rounded-xl border transition-colors ${benefit.isActive ? 'border-gray-100' : 'border-gray-100 opacity-50'}`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOR[benefit.type]}`}>
                          {benefitTypeLabel[benefit.type]}
                        </span>
                        {!benefit.isActive && (
                          <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                            非表示
                          </span>
                        )}
                        {pendingN > 0 && (
                          <span className="text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
                            申請 {pendingN}件
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{benefit.description}</p>

                      {/* 適用プラン */}
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {benefit.applicablePlans.map((plan) => (
                          <span key={plan} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {planDisplayName[plan]}
                          </span>
                        ))}
                      </div>

                      {/* 定員・割引率 */}
                      <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-400">
                        {benefit.capacity && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {benefitUsages.filter((u) => u.status !== 'expired' && u.status !== 'declined').length} / {benefit.capacity}
                          </span>
                        )}
                        {benefit.discountRate && <span>{benefit.discountRate}% 割引</span>}
                        {benefit.eventDate && (
                          <span>{new Date(benefit.eventDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        )}
                        {benefit.requiresApproval && <span className="text-amber-500">要承認</span>}
                      </div>
                    </div>

                    {/* アクション */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleActive(benefit.id)}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        title={benefit.isActive ? '非表示にする' : '表示する'}
                      >
                        {benefit.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => openEdit(benefit)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedBenefit(isExpanded ? null : benefit.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 展開：利用申請一覧 */}
                {isExpanded && (
                  <div className="border-t border-gray-50 px-5 pb-5 pt-4">
                    <div className="text-xs font-semibold text-gray-500 mb-3">
                      申請・利用履歴（{benefitUsages.length}件）
                    </div>
                    {benefitUsages.length === 0 ? (
                      <p className="text-sm text-gray-400">申請はまだありません</p>
                    ) : (
                      <div className="space-y-2">
                        {benefitUsages.map((usage) => {
                          const s = STATUS_CONFIG[usage.status]
                          return (
                            <div key={usage.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                  {usage.userName[0]}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-800">{usage.userName}</div>
                                  <div className="text-xs text-gray-400">{planDisplayName[usage.userPlan]}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {usage.adminNote && (
                                  <span className="text-xs text-gray-400 max-w-[140px] truncate">{usage.adminNote}</span>
                                )}
                                <span className={`text-xs border px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                                <span className="text-xs text-gray-400">
                                  {new Date(usage.appliedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                                </span>
                                {usage.status === 'pending' && (
                                  <button className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-full hover:bg-gray-700 transition-colors">
                                    承認
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 全申請一覧（フィルター付き） */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            全申請一覧
            {pendingCount > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full normal-case font-medium">
                要対応 {pendingCount}件
              </span>
            )}
          </h2>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved', 'used'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  filterStatus === s
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {s === 'all' ? 'すべて' : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {filteredUsages.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">申請はありません</div>
          ) : (
            filteredUsages.map((usage) => {
              const benefit = benefits.find((b) => b.id === usage.benefitId)
              const s = STATUS_CONFIG[usage.status]
              return (
                <div key={usage.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                      {usage.userName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{usage.userName}</div>
                      <div className="text-xs text-gray-400">{benefit?.title ?? '—'} · {planDisplayName[usage.userPlan]}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs border px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(usage.appliedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    </span>
                    {usage.status === 'pending' && (
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="承認">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors" title="不承認">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* 作成・編集モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">
                {editingBenefit ? '特典を編集' : '新規特典を追加'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* タイトル */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">特典名 *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="例：会員限定プレビュー「...」"
                />
              </div>

              {/* 説明 */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">説明</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              {/* 種別 */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">特典の種類</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as BenefitType }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {BENEFIT_TYPES.map((t) => (
                    <option key={t} value={t}>{benefitTypeLabel[t]}</option>
                  ))}
                </select>
              </div>

              {/* イベント日時・場所（event_registration / private_viewing） */}
              {(form.type === 'event_registration' || form.type === 'private_viewing') && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">日時</label>
                    <input
                      type="datetime-local"
                      value={form.eventDate}
                      onChange={(e) => setForm((p) => ({ ...p, eventDate: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">場所</label>
                    <input
                      value={form.eventLocation}
                      onChange={(e) => setForm((p) => ({ ...p, eventLocation: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Gallery HAKU（神楽坂）"
                    />
                  </div>
                </div>
              )}

              {/* 割引率（discount） */}
              {form.type === 'discount' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">割引率（%）</label>
                  <input
                    type="number"
                    value={form.discountRate}
                    onChange={(e) => setForm((p) => ({ ...p, discountRate: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="10"
                    min={1} max={100}
                  />
                </div>
              )}

              {/* 定員 */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">定員（空欄で無制限）</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="30"
                />
              </div>

              {/* 適用プラン */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">適用する会員プラン</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_PLANS.filter((p) => p !== 'free').map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => togglePlan(plan)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        form.applicablePlans.includes(plan)
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-400'
                      }`}
                    >
                      {planDisplayName[plan]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 承認方式 */}
              <div className="flex items-center justify-between py-2 border-t border-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-800">管理者承認が必要</div>
                  <div className="text-xs text-gray-400">オフ = 申請即時承認</div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, requiresApproval: !p.requiresApproval }))}
                >
                  {form.requiresApproval
                    ? <ToggleRight className="w-7 h-7 text-green-500" />
                    : <ToggleLeft className="w-7 h-7 text-gray-300" />}
                </button>
              </div>

              {/* 公開 */}
              <div className="flex items-center justify-between py-2 border-t border-gray-50">
                <div>
                  <div className="text-sm font-medium text-gray-800">公開状態</div>
                  <div className="text-xs text-gray-400">会員に表示する</div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                >
                  {form.isActive
                    ? <ToggleRight className="w-7 h-7 text-green-500" />
                    : <ToggleLeft className="w-7 h-7 text-gray-300" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-full text-sm font-medium hover:border-gray-400 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingBenefit ? '更新する' : '追加する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
