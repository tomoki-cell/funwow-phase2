'use client'

import { useState } from 'react'
import { Plus, X, PenLine, Trash2, Check } from 'lucide-react'

type BillingCycle = 'none' | 'monthly' | 'annual'
type PlanTier = 'free' | 'standard_individual' | 'standard_corporate' | 'premium_individual' | 'premium_corporate' | 'custom'

interface PlanDef {
  id: string
  tier: PlanTier
  name: string
  price: number
  billingCycle: BillingCycle
  description: string
  benefits: string[]
  isActive: boolean
  includesFunwowBenefits: boolean
}

const tierLabels: Record<PlanTier, string> = {
  free:                 'フォロワー（無料）',
  standard_individual:  'スタンダード（個人）',
  standard_corporate:   'スタンダード（法人）',
  premium_individual:   'プレミアム（個人）',
  premium_corporate:    'プレミアム（法人）',
  custom:               'カスタム',
}

const tierColors: Record<PlanTier, string> = {
  free:                 'bg-gray-100 text-gray-600 border-gray-200',
  standard_individual:  'bg-blue-50 text-blue-700 border-blue-200',
  standard_corporate:   'bg-blue-100 text-blue-800 border-blue-300',
  premium_individual:   'bg-amber-50 text-amber-700 border-amber-200',
  premium_corporate:    'bg-amber-100 text-amber-800 border-amber-300',
  custom:               'bg-gray-50 text-gray-600 border-gray-200',
}

const initialPlans: PlanDef[] = [
  {
    id: 'plan_free',
    tier: 'free',
    name: 'フォロワー',
    price: 0,
    billingCycle: 'none',
    description: '公開投稿・公開イベントへのアクセス。展示情報をフォローできます。',
    benefits: ['公開投稿の閲覧', '公開イベントへの参加', '展示情報のお知らせ'],
    isActive: true,
    includesFunwowBenefits: false,
  },
  {
    id: 'plan_std_ind',
    tier: 'standard_individual',
    name: 'スタンダード（個人）',
    price: 12000,
    billingCycle: 'annual',
    description: '会員限定コンテンツへのアクセスと展示入場特典付き個人プラン。',
    benefits: ['会員限定投稿の閲覧', '会員限定イベントへの参加', '展示入場1回無料', 'Funwow月500pt付与'],
    isActive: true,
    includesFunwowBenefits: true,
  },
  {
    id: 'plan_std_corp',
    tier: 'standard_corporate',
    name: 'スタンダード（法人）',
    price: 36000,
    billingCycle: 'annual',
    description: '最大3名まで利用可能な法人向けスタンダードプラン。',
    benefits: ['3名まで会員限定コンテンツ閲覧', '会員限定イベントへの参加（3名）', '展示入場3回無料', '請求書払い対応'],
    isActive: true,
    includesFunwowBenefits: false,
  },
  {
    id: 'plan_pre_ind',
    tier: 'premium_individual',
    name: 'プレミアム（個人）',
    price: 24000,
    billingCycle: 'annual',
    description: 'すべての特典＋プレビュー優先招待・アーティストとの交流機会付き個人プラン。',
    benefits: ['全コンテンツアクセス', 'プレビュー優先招待', 'アーティストトーク優先参加', '展示入場無制限', 'Funwow月1,000pt付与'],
    isActive: true,
    includesFunwowBenefits: true,
  },
  {
    id: 'plan_pre_corp',
    tier: 'premium_corporate',
    name: 'プレミアム（法人）',
    price: 96000,
    billingCycle: 'annual',
    description: '最大10名まで利用可能な法人向けプレミアムプラン。ロゴ掲載・協賛特典付き。',
    benefits: ['10名まで全コンテンツアクセス', 'プレビュー優先招待（全員）', '展示会場へのロゴ掲載', 'コレクター向け個別相談', '請求書払い対応'],
    isActive: false,
    includesFunwowBenefits: false,
  },
]

const emptyPlan: Omit<PlanDef, 'id'> = {
  tier: 'custom',
  name: '',
  price: 0,
  billingCycle: 'annual',
  description: '',
  benefits: [''],
  isActive: true,
  includesFunwowBenefits: false,
}

export default function PlansPage() {
  const [plans, setPlans] = useState<PlanDef[]>(initialPlans)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<PlanDef, 'id'>>(emptyPlan)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyPlan, benefits: [''] })
    setShowModal(true)
  }

  function openEdit(plan: PlanDef) {
    setEditingId(plan.id)
    setForm({
      tier: plan.tier,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      description: plan.description,
      benefits: [...plan.benefits],
      isActive: plan.isActive,
      includesFunwowBenefits: plan.includesFunwowBenefits,
    })
    setShowModal(true)
  }

  function updateBenefit(index: number, value: string) {
    setForm((prev) => {
      const benefits = [...prev.benefits]
      benefits[index] = value
      return { ...prev, benefits }
    })
  }

  function addBenefit() {
    setForm((prev) => ({ ...prev, benefits: [...prev.benefits, ''] }))
  }

  function removeBenefit(index: number) {
    setForm((prev) => ({ ...prev, benefits: prev.benefits.filter((_, i) => i !== index) }))
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))

    const cleanedBenefits = form.benefits.filter((b) => b.trim() !== '')

    if (editingId) {
      setPlans((prev) => prev.map((p) => p.id === editingId ? { ...p, ...form, benefits: cleanedBenefits } : p))
    } else {
      setPlans((prev) => [...prev, { id: `plan_${Date.now()}`, ...form, benefits: cleanedBenefits }])
    }

    setSaving(false)
    setShowModal(false)
  }

  function toggleActive(id: string) {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p))
  }

  function deletePlan(id: string) {
    setPlans((prev) => prev.filter((p) => p.id !== id))
  }

  const activePlans = plans.filter((p) => p.isActive)
  const inactivePlans = plans.filter((p) => !p.isActive)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プラン管理</h1>
          <p className="text-sm text-gray-500 mt-1">有効 {activePlans.length}プラン / 無効 {inactivePlans.length}プラン</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          プランを追加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-xl border p-5 relative transition-opacity ${
              plan.isActive ? 'border-gray-100' : 'border-gray-100 opacity-50'
            }`}
          >
            {/* ヘッダー */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-medium mb-1.5 ${tierColors[plan.tier]}`}>
                  {tierLabels[plan.tier]}
                </span>
                <div className="font-bold text-gray-900 text-lg">{plan.name}</div>
                <div className="text-gray-800 font-semibold mt-0.5">
                  {plan.price === 0 ? (
                    <span className="text-gray-500">無料</span>
                  ) : (
                    <>
                      ¥{plan.price.toLocaleString()}
                      <span className="text-sm font-normal text-gray-400">
                        /{plan.billingCycle === 'annual' ? '年' : '月'}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(plan)}
                  className="text-gray-400 hover:text-gray-700 transition-colors p-1"
                >
                  <PenLine className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deletePlan(plan.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-3">{plan.description}</p>

            {/* 特典リスト */}
            <ul className="space-y-1.5 mb-4">
              {plan.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            {/* フッター */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              {plan.includesFunwowBenefits && (
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                  Funwow特典付き
                </span>
              )}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-gray-400">{plan.isActive ? '有効' : '無効'}</span>
                <button
                  onClick={() => toggleActive(plan.id)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    plan.isActive ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    plan.isActive ? 'translate-x-4' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 作成 / 編集モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'プランを編集' : '新しいプラン'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プラン種別</label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value as PlanTier })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                >
                  {(Object.entries(tierLabels) as [PlanTier, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プラン名</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="例: スタンダード（個人）"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">価格（円）</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">請求サイクル</label>
                  <select
                    value={form.billingCycle}
                    onChange={(e) => setForm({ ...form, billingCycle: e.target.value as BillingCycle })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="none">なし（無料）</option>
                    <option value="monthly">月払い</option>
                    <option value="annual">年払い</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">特典・内容</label>
                  <button onClick={addBenefit} className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-full px-2.5 py-1 hover:border-gray-400 transition-colors">
                    <Plus className="w-3 h-3" />追加
                  </button>
                </div>
                <div className="space-y-2">
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => updateBenefit(i, e.target.value)}
                        placeholder="例: 会員限定投稿の閲覧"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      <button onClick={() => removeBenefit(i)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.includesFunwowBenefits}
                    onChange={(e) => setForm({ ...form, includesFunwowBenefits: e.target.checked })}
                    className="accent-gray-900 w-4 h-4"
                  />
                  Funwow特典を含む（ポイント付与など）
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-colors">
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name || saving}
                className="px-5 py-2 text-sm bg-gray-900 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '保存中…' : editingId ? '更新する' : '作成する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
