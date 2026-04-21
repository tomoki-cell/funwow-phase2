import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import SubjectBadge from '@/components/SubjectBadge'
import { CheckCircle, ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export default async function MemberPassPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  const membership = subject.currentUserMembership
  if (!membership) {
    redirect(`/communities/${subjectSlug}/join`)
  }

  const isAnnual = membership.planCode === 'annual'
  const joinedDate = new Date(membership.joinedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const expiresDate = membership.expiresAt
    ? new Date(membership.expiresAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <Link
        href={`/communities/${subjectSlug}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        コミュニティに戻る
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">デジタル会員証</h1>
        <p className="text-sm text-gray-500 mt-1">来場時にスタッフへご提示ください</p>
      </div>

      {/* 会員証カード */}
      <div className="bg-gray-900 text-white rounded-3xl p-8 mb-6 relative overflow-hidden">
        {/* 背景の装飾 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">
              funwow community
            </span>
            <SubjectBadge type={subject.type} />
          </div>

          {/* 主体情報 */}
          <div className="flex items-center gap-3 mb-6">
            {subject.iconImageUrl && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                <Image
                  src={subject.iconImageUrl}
                  alt={subject.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-bold text-xl">{subject.name}</div>
              <div className="text-sm text-gray-300">
                {isAnnual ? '年会員' : 'フォロワー'}
              </div>
            </div>
          </div>

          {/* 会員情報 */}
          <div className="border-t border-white/20 pt-5 mb-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400 text-xs mb-1">参加日</div>
              <div>{joinedDate}</div>
            </div>
            {expiresDate && (
              <div>
                <div className="text-gray-400 text-xs mb-1">有効期限</div>
                <div>{expiresDate}</div>
              </div>
            )}
            <div>
              <div className="text-gray-400 text-xs mb-1">ステータス</div>
              <div className="flex items-center gap-1 text-green-400">
                <CheckCircle className="w-3.5 h-3.5" /> 有効
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs mb-1">会員ID</div>
              <div className="font-mono text-xs text-gray-400">{membership.id.slice(-8)}</div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 gap-2">
            <Image
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=funwow:pass:${membership.id}&color=111111&bgcolor=ffffff&margin=4`}
              alt="会員証QRコード"
              width={180}
              height={180}
              className="rounded-lg"
              unoptimized
            />
            <p className="text-xs text-gray-400 font-mono tracking-wider">{membership.id.slice(-12).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* Funwow基本機能バンドル表示 */}
      {isAnnual && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-3">この会員証で使えるFunwow機能</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              毎月 1,000pt 付与
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ギャラリー巡りポイント付与・利用
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              オンライントークへの参加
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-col items-center gap-3">
        <Link
          href={`/communities/${subjectSlug}`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          コミュニティページに戻る
        </Link>
        <Link
          href="/mypage"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          マイページへ
        </Link>
      </div>
    </div>
  )
}
