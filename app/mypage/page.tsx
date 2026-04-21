import Link from 'next/link'
import Image from 'next/image'
import { mockCurrentUser, mockExhibitions, mockCreators } from '@/lib/mock/phase1'
import { allSubjects, getManagedSubjects, mockCurrentUserRoles } from '@/lib/mock/subjects'
import MembershipBadge from '@/components/MembershipBadge'
import ExhibitionCard from '@/components/ExhibitionCard'
import CreatorCard from '@/components/CreatorCard'
import { CheckCircle, Coins, MapPin, ArrowRight, Settings, Gift, Clock, Calendar } from 'lucide-react'
import { mockBenefitUsages, mockBenefits, benefitTypeLabel, isTodayOrWithin2Hours } from '@/lib/mock/benefits'

// マイページで表示する参加済みコミュニティ
const mySubjects = allSubjects.filter((s) => s.currentUserMembership)
const managedSubjects = getManagedSubjects()

// 保存済み展示
const savedExhibitions = mockExhibitions.filter((ex) =>
  mockCurrentUser.savedExhibitionIds.includes(ex.id)
)

// 保存済み作家
const savedCreators = mockCreators.filter((cr) =>
  mockCurrentUser.savedCreatorIds.includes(cr.id)
)

// ログインユーザーの特典申請履歴
const MY_USER_ID = 'u01'
const myBenefitUsages = mockBenefitUsages.filter((u) => u.userId === MY_USER_ID)
const myBenefitWithDetails = myBenefitUsages.map((usage) => ({
  usage,
  benefit: mockBenefits.find((b) => b.id === usage.benefitId),
})).filter((item) => item.benefit)

// 来場履歴（モック）
const visitHistory = [
  { id: 'v1', spaceName: 'Gallery HAKU', exhibitionTitle: '余白の記録', date: '2025-03-15' },
  { id: 'v2', spaceName: 'VOID Tokyo', exhibitionTitle: '土と光のあいだ', date: '2025-04-12' },
  { id: 'v3', spaceName: 'Gallery HAKU', exhibitionTitle: 'グループ展「距離」', date: '2025-01-20' },
  { id: 'v4', spaceName: 'Nanzuka Underground', exhibitionTitle: 'After the Garden', date: '2025-05-12' },
  { id: 'v5', spaceName: 'VOID Tokyo', exhibitionTitle: 'Sound Architecture', date: '2024-12-03' },
]

export default function MyPage() {
  const isPaidMember = mockCurrentUser.planType === 'paid'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* プロフィール */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
          {mockCurrentUser.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{mockCurrentUser.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {isPaidMember ? (
              <span className="text-xs bg-gray-900 text-white px-2.5 py-0.5 rounded-full font-medium">
                有料会員
              </span>
            ) : (
              <span className="text-xs border border-gray-300 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                無料会員
              </span>
            )}
            <span className="text-sm text-gray-400">
              {new Date(mockCurrentUser.joinedAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
              })}から
            </span>
          </div>
        </div>
      </div>

      {/* Funwow 会員ステータス */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 mb-10">
        <div className="grid grid-cols-3 gap-6">
          {/* ポイント */}
          <div>
            <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5" /> 保有ポイント
            </div>
            <div className="text-2xl font-bold">{mockCurrentUser.pointBalance.toLocaleString()}</div>
            <div className="text-xs text-gray-400">pt</div>
          </div>

          {/* スタンプ */}
          <div>
            <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> 来場スタンプ
            </div>
            <div className="text-2xl font-bold">{mockCurrentUser.stampCount}</div>
            <div className="text-xs text-gray-400">
              / 5 で+1,000pt{' '}
              <span className="text-green-400">
                ({Math.floor(mockCurrentUser.stampCount / 5)}回達成)
              </span>
            </div>
          </div>

          {/* 会員プラン */}
          <div>
            <div className="text-gray-400 text-xs mb-1">月額会員</div>
            {isPaidMember ? (
              <div>
                <div className="text-lg font-bold">有効</div>
                <div className="text-xs text-gray-400">毎月 1,000pt 付与</div>
                {/* TODO: Supabase 会員解約・変更処理 */}
              </div>
            ) : (
              <Link
                href="#"
                className="text-sm text-green-400 underline hover:text-green-300 transition-colors"
              >
                有料会員になる
              </Link>
            )}
          </div>
        </div>

        {/* ポイント利用・履歴 */}
        {/* TODO: Phase1 PointLedger の表示 */}
        <div className="border-t border-white/10 mt-5 pt-4 flex justify-end">
          <Link
            href="#"
            className="text-xs text-gray-400 hover:text-gray-200 flex items-center gap-1 transition-colors"
          >
            ポイント履歴 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 管理しているコミュニティ */}
      {managedSubjects.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">管理しているコミュニティ</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {managedSubjects.map((subject) => {
              const role = mockCurrentUserRoles.find((r) => r.subjectSlug === subject.slug)
              return (
                <div key={subject.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {subject.iconImageUrl && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={subject.iconImageUrl} alt={subject.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{subject.name}</div>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {role?.roleType === 'owner' ? 'オーナー' : role?.roleType === 'admin' ? '管理者' : 'スタッフ'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-3 text-center text-xs">
                    <div className="bg-gray-50 rounded-lg py-2">
                      <div className="font-bold text-gray-900">{subject.memberCount}</div>
                      <div className="text-gray-400">メンバー</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg py-2">
                      <div className="font-bold text-gray-900">{subject.postCount}</div>
                      <div className="text-gray-400">投稿</div>
                    </div>
                  </div>
                  <Link
                    href={`/manage/${subject.slug}`}
                    className="block w-full text-center bg-gray-900 text-white text-sm py-2 rounded-full hover:bg-gray-700 transition-colors font-medium"
                  >
                    管理画面を開く
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 特典・申請状況 */}
      {myBenefitWithDetails.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900">特典・申請状況</h2>
            </div>
            <Link
              href="/communities/gallery-haku/benefits"
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              特典一覧 <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {myBenefitWithDetails.map(({ usage, benefit }) => {
              const isToday = isTodayOrWithin2Hours(benefit!.eventDate)
              const showCheckinBtn =
                usage.status === 'approved' &&
                benefit!.type === 'event_registration' &&
                isToday

              return (
                <div
                  key={usage.id}
                  className={`bg-white rounded-xl border p-4 ${showCheckinBtn ? 'border-green-200' : 'border-gray-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs text-gray-400">{benefitTypeLabel[benefit!.type]}</span>
                        {isToday && usage.status === 'approved' && (
                          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                            本日開催
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-gray-900 text-sm">{benefit!.title}</div>
                      {benefit!.eventDate && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(benefit!.eventDate).toLocaleDateString('ja-JP', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>

                    {/* ステータス / アクション */}
                    {usage.status === 'checked_in' ? (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium flex-shrink-0">
                        <CheckCircle className="w-4 h-4" />
                        参加済み
                      </div>
                    ) : usage.status === 'used' ? (
                      <span className="text-xs text-gray-400 flex-shrink-0">使用済み</span>
                    ) : usage.status === 'pending' ? (
                      <div className="flex items-center gap-1.5 text-xs text-yellow-600 border border-yellow-200 bg-yellow-50 px-2.5 py-1 rounded-full flex-shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                        承認待ち
                      </div>
                    ) : showCheckinBtn ? (
                      <Link
                        href={`/communities/gallery-haku/benefits`}
                        className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-green-700 transition-colors flex-shrink-0"
                      >
                        参加する
                      </Link>
                    ) : (
                      <span className="text-xs text-blue-600 border border-blue-200 bg-blue-50 px-2.5 py-1 rounded-full flex-shrink-0">
                        申込済み
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* 参加中のコミュニティ（Phase2との接続） */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">参加中のコミュニティ</h2>
            <Link
              href="/communities"
              className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              すべて見る <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {mySubjects.length > 0 ? (
            <div className="space-y-4">
              {mySubjects.map((subject) => (
                <div key={subject.id} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100">
                  {subject.iconImageUrl && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={subject.iconImageUrl} alt={subject.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{subject.name}</div>
                    {subject.currentUserMembership && (
                      <MembershipBadge plan={subject.currentUserMembership.planCode} />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {subject.currentUserMembership?.planCode === 'annual' && (
                      <Link
                        href={`/communities/${subject.slug}/pass`}
                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded-full hover:border-gray-400 transition-colors"
                      >
                        会員証
                      </Link>
                    )}
                    <Link
                      href={`/communities/${subject.slug}`}
                      className="text-xs bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      開く
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-400 mb-3">まだコミュニティに参加していません</p>
              <Link
                href="/communities"
                className="text-sm text-gray-700 underline hover:text-gray-900"
              >
                コミュニティを探す
              </Link>
            </div>
          )}
        </section>

        {/* 来場履歴 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">来場履歴</h2>
            <span className="text-sm text-gray-400">{visitHistory.length}件</span>
          </div>
          <div className="space-y-2">
            {visitHistory.map((visit) => (
              <div
                key={visit.id}
                className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">
                    {visit.exhibitionTitle}
                  </div>
                  <div className="text-xs text-gray-400">{visit.spaceName}</div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(visit.date).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 保存済み */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">保存した展示</h2>
        {savedExhibitions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedExhibitions.map((ex) => (
              <ExhibitionCard key={ex.id} exhibition={ex} isSaved />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">保存した展示はありません。</p>
        )}
      </section>

      {savedCreators.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">保存した作家</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedCreators.map((cr) => (
              <CreatorCard key={cr.id} creator={cr} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
