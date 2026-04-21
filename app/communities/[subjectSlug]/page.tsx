import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import SubjectBadge from '@/components/SubjectBadge'
import MembershipBadge from '@/components/MembershipBadge'
import PostCard from '@/components/PostCard'
import EventCard from '@/components/EventCard'
import { Users, ArrowRight, CheckCircle, Gift } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export default async function CommunityDetailPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)

  if (!subject) notFound()

  const membership = subject.currentUserMembership
  const isMember = !!membership
  const isAnnual = membership?.planCode === 'annual'

  const annualPlan = subject.plans.find((p) => p.planCode === 'annual')
  const freePlan = subject.plans.find((p) => p.planCode === 'free')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* ヘッダー */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-100">
        {subject.coverImageUrl && (
          <div className="relative h-56 md:h-72">
            <Image
              src={subject.coverImageUrl}
              alt={subject.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}
        <div className="absolute bottom-5 left-5 flex items-end gap-4">
          {subject.iconImageUrl && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              <Image
                src={subject.iconImageUrl}
                alt={subject.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <SubjectBadge type={subject.type} />
              {isMember && <MembershipBadge plan={membership.planCode} />}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{subject.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-10">
          {/* 概要 */}
          <section>
            <p className="text-gray-600 leading-relaxed">{subject.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {subject.memberCount.toLocaleString()} 人のメンバー
              </span>
              <span>{subject.postCount} 投稿</span>
              <span>{subject.eventCount} イベント</span>
            </div>
          </section>

          {/* 最新投稿 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">最新の投稿</h2>
              <Link
                href={`/communities/${subjectSlug}/posts`}
                className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                すべて見る <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subject.latestPosts.map((post) => {
                const locked = post.visibility === 'members_only' && !isMember
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    subjectSlug={subjectSlug}
                    isLocked={locked}
                  />
                )
              })}
            </div>
          </section>

          {/* イベント */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">イベント</h2>
              <Link
                href={`/communities/${subjectSlug}/events`}
                className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
              >
                すべて見る <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {subject.upcomingEvents.map((event) => {
                const locked = event.visibility === 'members_only' && !isMember
                return (
                  <EventCard
                    key={event.id}
                    event={event}
                    subjectSlug={subjectSlug}
                    isLocked={locked}
                  />
                )
              })}
            </div>
          </section>
        </div>

        {/* サイドバー */}
        <div className="space-y-5">
          {/* 参加状態 / 参加CTA */}
          {isMember ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-gray-900">参加中</span>
                <MembershipBadge plan={membership.planCode} />
              </div>
              {!isAnnual && annualPlan && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    年会員になると、限定投稿・イベント・Funwow月1,000ptが使えます。
                  </p>
                  <Link
                    href={`/communities/${subjectSlug}/join`}
                    className="block w-full bg-gray-900 text-white text-center py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
                  >
                    年会員に切り替える
                    {annualPlan.priceAmount.toLocaleString()}円/年
                  </Link>
                </div>
              )}
              {/* 特典ページへの導線（会員全員） */}
              <Link
                href={`/communities/${subjectSlug}/benefits`}
                className="flex items-center justify-center gap-2 w-full border border-gray-200 text-gray-700 text-center py-2.5 rounded-full text-sm font-medium hover:border-gray-400 transition-colors mt-2"
              >
                <Gift className="w-4 h-4" />
                会員特典を見る
              </Link>
              {isAnnual && (
                <Link
                  href={`/communities/${subjectSlug}/pass`}
                  className="block w-full border border-gray-200 text-gray-700 text-center py-2.5 rounded-full text-sm font-medium hover:border-gray-400 transition-colors mt-2"
                >
                  会員証を見る
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">参加する</h3>

              {/* 年会員プラン */}
              {annualPlan && (
                <div className="bg-gray-900 text-white rounded-xl p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{annualPlan.name}</span>
                    <span className="text-sm opacity-80">
                      {annualPlan.priceAmount.toLocaleString()}円/年
                    </span>
                  </div>
                  <p className="text-xs opacity-70 leading-relaxed mb-3">
                    {annualPlan.description}
                  </p>
                  {annualPlan.includesFunwowBaseBenefits && (
                    <p className="text-xs opacity-70 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Funwow月1,000pt付与を含む
                    </p>
                  )}
                  <Link
                    href={`/communities/${subjectSlug}/join?plan=annual`}
                    className="block w-full mt-3 bg-white text-gray-900 text-center py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    年会員で参加
                  </Link>
                </div>
              )}

              {/* freeプラン */}
              {freePlan && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700">{freePlan.name}</span>
                    <span className="text-sm text-gray-500">無料</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    {freePlan.description}
                  </p>
                  <Link
                    href={`/communities/${subjectSlug}/join?plan=free`}
                    className="block w-full border border-gray-200 text-gray-700 text-center py-2 rounded-full text-sm font-medium hover:border-gray-400 transition-colors"
                  >
                    フォロワーとして参加（無料）
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 管理者導線 */}
          <div className="border-t border-gray-100 pt-4">
            <Link
              href={`/manage/${subjectSlug}`}
              className="block w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
            >
              ⚙ 管理者の方はこちら
            </Link>
          </div>

          {/* TODO: Phase1 - artist詳細ページへの導線 */}
          {/* TODO: Phase1 - space詳細ページへの導線 */}
          {/* TODO: Phase1 - exhibition詳細ページへの関連コミュニティ表示 */}
        </div>
      </div>
    </div>
  )
}
