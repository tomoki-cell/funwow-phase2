import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Calendar, MapPin, Heart, Ticket, StickyNote } from 'lucide-react'
import MembershipBadge from '@/components/MembershipBadge'

interface Props {
  params: Promise<{ subjectSlug: string; memberId: string }>
}

const mockMemberDetails: Record<string, {
  id: string
  name: string
  email: string
  plan: 'annual' | 'free'
  joinedAt: string
  status: string
  memo: string
  visitHistory: { date: string; place: string; type: string }[]
  eventHistory: { date: string; eventName: string; status: string }[]
  savedItems: { name: string; type: string }[]
}> = {
  u1: {
    id: 'u1',
    name: '田中 花子',
    email: 'tanaka@example.com',
    plan: 'annual',
    joinedAt: '2025-01-15',
    status: 'active',
    memo: '',
    visitHistory: [
      { date: '2025-04-12', place: 'Gallery HAKU', type: 'チェックイン' },
      { date: '2025-03-22', place: 'Gallery HAKU', type: 'チェックイン' },
      { date: '2025-02-18', place: 'Void Tokyo', type: 'チェックイン' },
    ],
    eventHistory: [
      { date: '2025-05-23', eventName: '会員限定プレビュー「境界線の詩」', status: 'applied' },
      { date: '2025-04-20', eventName: 'オープニングトーク', status: 'attended' },
    ],
    savedItems: [
      { name: '「余白の記録」山田蒼 個展', type: '展示' },
      { name: 'Gallery HAKU', type: 'スペース' },
    ],
  },
  u2: {
    id: 'u2',
    name: '鈴木 一郎',
    email: 'suzuki@example.com',
    plan: 'free',
    joinedAt: '2025-02-20',
    status: 'active',
    memo: '',
    visitHistory: [
      { date: '2025-03-15', place: 'Gallery HAKU', type: 'チェックイン' },
    ],
    eventHistory: [
      { date: '2025-05-24', eventName: 'オープニングトーク（公開）', status: 'applied' },
    ],
    savedItems: [],
  },
  u3: {
    id: 'u3',
    name: '佐藤 みき',
    email: 'sato@example.com',
    plan: 'annual',
    joinedAt: '2025-03-01',
    status: 'active',
    memo: 'VIPゲスト。展示ごとに招待済み。',
    visitHistory: [
      { date: '2025-04-18', place: 'Gallery HAKU', type: 'チェックイン' },
      { date: '2025-04-12', place: 'Gallery HAKU', type: 'チェックイン' },
      { date: '2025-03-28', place: 'Gallery HAKU', type: 'チェックイン' },
      { date: '2025-03-10', place: 'Void Tokyo', type: 'チェックイン' },
    ],
    eventHistory: [
      { date: '2025-05-23', eventName: '会員限定プレビュー「境界線の詩」', status: 'attended' },
      { date: '2025-04-20', eventName: 'オープニングトーク', status: 'attended' },
      { date: '2025-03-15', eventName: '春の会員限定トーク', status: 'attended' },
    ],
    savedItems: [
      { name: 'Gallery HAKU', type: 'スペース' },
      { name: '山田 蒼', type: '作家' },
      { name: 'ARTWAVE TOKYO 2025', type: 'アートフェア' },
    ],
  },
  u5: {
    id: 'u5',
    name: '高橋 さくら',
    email: 'takahashi@example.com',
    plan: 'annual',
    joinedAt: '2025-04-01',
    status: 'active',
    memo: '',
    visitHistory: [
      { date: '2025-04-20', place: 'Gallery HAKU', type: 'チェックイン' },
    ],
    eventHistory: [
      { date: '2025-05-23', eventName: '会員限定プレビュー「境界線の詩」', status: 'applied' },
      { date: '2025-05-24', eventName: 'オープニングトーク（公開）', status: 'waitlisted' },
    ],
    savedItems: [{ name: 'Gallery HAKU', type: 'スペース' }],
  },
}

const statusLabels: Record<string, { label: string; style: string }> = {
  applied: { label: '申込済', style: 'text-blue-600 bg-blue-50 border-blue-200' },
  attended: { label: '参加済', style: 'text-green-600 bg-green-50 border-green-200' },
  waitlisted: { label: 'キャンセル待ち', style: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  canceled: { label: 'キャンセル', style: 'text-gray-500 bg-gray-50 border-gray-200' },
}

export default async function MemberDetailPage({ params }: Props) {
  const { subjectSlug, memberId } = await params
  const member = mockMemberDetails[memberId]

  if (!member) notFound()

  return (
    <div>
      <Link
        href={`/manage/${subjectSlug}/members`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        会員一覧に戻る
      </Link>

      <div className="grid grid-cols-3 gap-6">
        {/* 左：プロフィール */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3">
              {member.name[0]}
            </div>
            <div className="font-bold text-lg text-gray-900">{member.name}</div>
            <div className="text-sm text-gray-500 mt-0.5">{member.email}</div>
            <div className="mt-3 flex items-center gap-2">
              <MembershipBadge plan={member.plan} />
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">有効</span>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              参加日：{new Date(member.joinedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* メモ */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
              <StickyNote className="w-4 h-4" />
              管理メモ
            </div>
            {member.memo ? (
              <p className="text-sm text-gray-600">{member.memo}</p>
            ) : (
              <p className="text-xs text-gray-400">メモなし</p>
            )}
          </div>

          {/* 保存済み */}
          {member.savedItems.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-3">
                <Heart className="w-4 h-4" />
                保存済みアイテム
              </div>
              <div className="space-y-2">
                {member.savedItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-400">{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右：履歴 */}
        <div className="col-span-2 space-y-6">
          {/* 来場履歴 */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-4">
              <MapPin className="w-4 h-4" />
              来場履歴
              <span className="text-xs text-gray-400 font-normal ml-1">{member.visitHistory.length}件</span>
            </div>
            {member.visitHistory.length === 0 ? (
              <p className="text-sm text-gray-400">来場記録なし</p>
            ) : (
              <div className="space-y-2">
                {member.visitHistory.map((v, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{v.place}</span>
                      <span className="text-xs text-gray-400">{v.type}</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(v.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* イベント参加履歴 */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-4">
              <Ticket className="w-4 h-4" />
              イベント参加履歴
              <span className="text-xs text-gray-400 font-normal ml-1">{member.eventHistory.length}件</span>
            </div>
            {member.eventHistory.length === 0 ? (
              <p className="text-sm text-gray-400">参加記録なし</p>
            ) : (
              <div className="space-y-2">
                {member.eventHistory.map((e, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{e.eventName}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusLabels[e.status]?.style ?? ''}`}>
                        {statusLabels[e.status]?.label ?? e.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(e.date).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
