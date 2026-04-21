'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Benefit,
  BenefitType,
  MemberPlanCode,
  UsageStatus,
  mockBenefits,
  mockBenefitUsages,
  benefitTypeLabel,
  planDisplayName,
  getUserBenefitStatus,
  isTodayOrWithin2Hours,
} from '@/lib/mock/benefits'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import {
  Gift, CheckCircle, Clock, Lock, MapPin, Tag, Star, Calendar, ChevronLeft,
} from 'lucide-react'

// モック：現在ログイン中のユーザー情報
const CURRENT_USER_ID = 'u01'
const CURRENT_USER_PLAN: MemberPlanCode = 'standard_individual'

const TYPE_ICON: Record<BenefitType, React.ElementType> = {
  event_registration: Calendar,
  private_viewing:    Star,
  discount:           Tag,
  exclusive_content:  Gift,
  point_bonus:        Gift,
}

const TYPE_COLOR: Record<BenefitType, string> = {
  event_registration: 'bg-purple-50 text-purple-700',
  private_viewing:    'bg-amber-50 text-amber-700',
  discount:           'bg-green-50 text-green-700',
  exclusive_content:  'bg-blue-50 text-blue-700',
  point_bonus:        'bg-pink-50 text-pink-700',
}

const STATUS_DISPLAY: Record<UsageStatus, { label: string; cls: string }> = {
  pending:    { label: '申請中', cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved:   { label: '申込済み', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  checked_in: { label: '参加済み', cls: 'bg-green-50 text-green-700 border-green-200' },
  used:       { label: '使用済み', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
  expired:    { label: '期限切れ', cls: 'bg-red-50 text-red-400 border-red-100' },
  declined:   { label: '不承認', cls: 'bg-gray-100 text-gray-400 border-gray-200' },
}

export default function BenefitsPage() {
  const params = useParams()
  const subjectSlug = params.subjectSlug as string
  const subject = getSubjectBySlug(subjectSlug)

  const benefits = mockBenefits.filter((b) => b.subjectSlug === subjectSlug && b.isActive)

  // ユーザーの特典状況（ローカル状態で管理）
  const initialStatuses: Record<string, UsageStatus | null> = {}
  benefits.forEach((b) => {
    initialStatuses[b.id] = getUserBenefitStatus(CURRENT_USER_ID, b.id)
  })
  const [statuses, setStatuses] = useState<Record<string, UsageStatus | null>>(initialStatuses)
  const [applyingId, setApplyingId] = useState<string | null>(null)
  const [checkedInIds, setCheckedInIds] = useState<Set<string>>(new Set())

  const isMember = !!subject?.currentUserMembership
  const userPlan = CURRENT_USER_PLAN

  function canUse(benefit: Benefit): boolean {
    return benefit.applicablePlans.includes(userPlan)
  }

  async function handleApply(benefit: Benefit) {
    setApplyingId(benefit.id)
    await new Promise((r) => setTimeout(r, 600))
    const newStatus: UsageStatus = benefit.requiresApproval ? 'pending' : 'approved'
    setStatuses((prev) => ({ ...prev, [benefit.id]: newStatus }))
    setApplyingId(null)
  }

  async function handleCheckIn(benefit: Benefit) {
    setApplyingId(benefit.id)
    await new Promise((r) => setTimeout(r, 600))
    setStatuses((prev) => ({ ...prev, [benefit.id]: 'checked_in' }))
    setCheckedInIds((prev) => new Set([...prev, benefit.id]))
    setApplyingId(null)
  }

  // プラン別にフィルタリング
  const availableBenefits = benefits.filter((b) => canUse(b))
  const lockedBenefits = benefits.filter((b) => !canUse(b))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-6">
        <Link
          href={`/communities/${subjectSlug}`}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          {subject?.name ?? subjectSlug} に戻る
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <Gift className="w-5 h-5 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900">会員特典</h1>
        </div>
        <p className="text-sm text-gray-500">
          あなたのプラン（{planDisplayName[userPlan]}）で利用できる特典です
        </p>
      </div>

      {/* 非会員 */}
      {!isMember && (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 text-center mb-8">
          <Lock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-3">会員になると特典をご利用いただけます</p>
          <Link
            href={`/communities/${subjectSlug}/join`}
            className="inline-block bg-gray-900 text-white text-sm px-5 py-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            会員登録する
          </Link>
        </div>
      )}

      {/* 利用可能な特典 */}
      {availableBenefits.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            利用できる特典（{availableBenefits.length}件）
          </h2>
          <div className="space-y-4">
            {availableBenefits.map((benefit) => {
              const status = statuses[benefit.id]
              const Icon = TYPE_ICON[benefit.type]
              const isApplying = applyingId === benefit.id
              const isToday = isTodayOrWithin2Hours(benefit.eventDate)
              const isAlreadyApplied = status === 'approved' || status === 'pending' || status === 'checked_in'

              return (
                <div
                  key={benefit.id}
                  className={`bg-white rounded-2xl border p-5 transition-shadow hover:shadow-sm ${
                    status === 'checked_in' ? 'border-green-100' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[benefit.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLOR[benefit.type]}`}>
                          {benefitTypeLabel[benefit.type]}
                        </span>
                        {benefit.requiresApproval && (
                          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                            要承認
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">{benefit.description}</p>

                      {/* メタ情報 */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                        {benefit.eventDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(benefit.eventDate).toLocaleDateString('ja-JP', {
                              month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                            })}
                            {isToday && (
                              <span className="text-red-500 font-semibold ml-1">本日開催</span>
                            )}
                          </span>
                        )}
                        {benefit.eventLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {benefit.eventLocation}
                          </span>
                        )}
                        {benefit.discountRate && (
                          <span className="flex items-center gap-1">
                            <Tag className="w-3.5 h-3.5" />
                            {benefit.discountRate}% 割引
                          </span>
                        )}
                        {benefit.capacity && (
                          <span>
                            残り {benefit.capacity - (benefit.usageCount ?? 0)} / {benefit.capacity} 枠
                          </span>
                        )}
                      </div>

                      {/* アクション */}
                      {status === 'checked_in' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">参加確認済み</span>
                        </div>
                      ) : status === 'used' ? (
                        <span className="text-sm text-gray-400">使用済み</span>
                      ) : status === 'expired' ? (
                        <span className="text-sm text-red-400">期限切れ</span>
                      ) : (
                        <div className="flex items-center gap-3">
                          {/* 申込済み + 当日：参加ボタン */}
                          {status === 'approved' && benefit.type === 'event_registration' && isToday && (
                            <button
                              onClick={() => handleCheckIn(benefit)}
                              disabled={isApplying}
                              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              {isApplying ? '処理中…' : '✓ 参加する（チェックイン）'}
                            </button>
                          )}

                          {/* 申込済み */}
                          {isAlreadyApplied && !(status === 'approved' && benefit.type === 'event_registration' && isToday) && (
                            <div className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 rounded-full ${STATUS_DISPLAY[status!].cls}`}>
                              <Clock className="w-3.5 h-3.5" />
                              {STATUS_DISPLAY[status!].label}
                            </div>
                          )}

                          {/* 未申請 */}
                          {!isAlreadyApplied && (
                            <button
                              onClick={() => handleApply(benefit)}
                              disabled={isApplying}
                              className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
                            >
                              {isApplying ? '送信中…' : (
                                benefit.type === 'event_registration' ? 'イベントに申し込む' :
                                benefit.type === 'private_viewing' ? 'ビューイングを申請する' :
                                benefit.type === 'discount' ? '割引を申請する' :
                                '申請する'
                              )}
                            </button>
                          )}

                          {/* ステータス表示 */}
                          {status === 'pending' && (
                            <span className="text-xs text-gray-400">承認後に確定します</span>
                          )}
                          {status === 'approved' && benefit.type === 'event_registration' && !isToday && (
                            <span className="text-xs text-gray-400">当日チェックインが必要です</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* プランアップグレードで使える特典 */}
      {lockedBenefits.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            上位プランで利用可能
          </h2>
          <div className="space-y-3">
            {lockedBenefits.map((benefit) => {
              const Icon = TYPE_ICON[benefit.type]
              const minPlan = benefit.applicablePlans[0]
              return (
                <div key={benefit.id} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 opacity-70">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-400">{planDisplayName[minPlan]}以上</span>
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 text-center">
            <Link
              href={`/communities/${subjectSlug}/join`}
              className="inline-block text-sm text-gray-700 border border-gray-300 px-5 py-2.5 rounded-full hover:border-gray-600 transition-colors"
            >
              プランをアップグレードする
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
