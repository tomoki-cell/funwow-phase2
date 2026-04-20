import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  getExhibitionById,
  getImpressionsForExhibition,
  mockCreators,
  mockCurrentUser,
  mockSpaces,
} from '@/lib/mock/phase1'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import CommunityCard from '@/components/CommunityCard'
import CheckinButton from '@/components/CheckinButton'
import SaveButton from '@/components/SaveButton'
import ImpressionForm from '@/components/ImpressionForm'
import { MapPin, Calendar, ChevronLeft } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ExhibitionDetailPage({ params }: Props) {
  const { id } = await params
  const exhibition = getExhibitionById(id)
  if (!exhibition) notFound()

  const impressions = getImpressionsForExhibition(id)
  const isSaved = mockCurrentUser.savedExhibitionIds.includes(id)
  const space = mockSpaces.find((s) => s.id === exhibition.spaceId)

  const exhibitionCreators = mockCreators.filter((c) =>
    exhibition.creatorIds.includes(c.id)
  )

  // 関連コミュニティ（Phase2との接続）
  const relatedSubjects = exhibition.relatedSubjectSlugs
    .map((slug) => getSubjectBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getSubjectBySlug>>[]

  const startDate = new Date(exhibition.startDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const endDate = new Date(exhibition.endDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const isActive = new Date(exhibition.endDate) >= new Date()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        探索へ戻る
      </Link>

      {/* ヘッダー画像 */}
      {exhibition.coverImageUrl && (
        <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 bg-gray-100">
          <Image
            src={exhibition.coverImageUrl}
            alt={exhibition.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-2">
            <span
              className={clsx(
                'text-sm px-3 py-1 rounded-full font-medium',
                isActive ? 'bg-white text-gray-900' : 'bg-white/70 text-gray-500'
              )}
            >
              {isActive ? '開催中' : '終了'}
            </span>
            {exhibition.admissionFee === 0 ? (
              <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full">無料</span>
            ) : exhibition.admissionFee ? (
              <span className="text-sm bg-white/80 text-gray-700 px-3 py-1 rounded-full">
                ¥{exhibition.admissionFee.toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* メイン */}
        <div className="lg:col-span-2 space-y-8">
          {/* タイトル・基本情報 */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{exhibition.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              {space && (
                <Link
                  href={`/spaces/${space.slug}`}
                  className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {exhibition.spaceName}
                </Link>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                {startDate} 〜 {endDate}
              </span>
            </div>
            {exhibition.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {exhibition.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 説明 */}
          <div>
            <p className="text-gray-600 leading-relaxed">{exhibition.description}</p>
          </div>

          {/* 参加作家 */}
          {exhibitionCreators.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">参加作家</h2>
              <div className="space-y-3">
                {exhibitionCreators.map((creator) => (
                  <Link
                    key={creator.id}
                    href={`/creators/${creator.slug}`}
                    className="group flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-all"
                  >
                    {creator.iconImageUrl && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={creator.iconImageUrl}
                          alt={creator.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{creator.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{creator.bio}</div>
                    </div>
                    {creator.relatedSubjectSlug && (
                      <span className="ml-auto text-xs text-gray-400 flex-shrink-0">
                        コミュニティあり →
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 感想 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">感想</h2>
              <span className="text-sm text-gray-400">{impressions.length}件</span>
            </div>

            {impressions.length > 0 ? (
              <div className="space-y-4 mb-5">
                {impressions.map((imp) => (
                  <div key={imp.id} className="bg-white p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
                        {imp.userName[0]}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{imp.userName}</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(imp.createdAt).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{imp.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 mb-4">まだ感想はありません。</p>
            )}

            {/* 感想投稿フォーム */}
            <ImpressionForm exhibitionId={id} />
          </div>
        </div>

        {/* サイドバー */}
        <div className="space-y-5">
          {/* 保存・チェックイン */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex gap-3">
              <SaveButton
                targetId={id}
                targetType="exhibition"
                initialSaved={isSaved}
              />
              <CheckinButton
                exhibitionId={id}
                exhibitionTitle={exhibition.title}
              />
            </div>

            {space && (
              <Link
                href={`/spaces/${space.slug}`}
                className="mt-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {space.address}
              </Link>
            )}
          </div>

          {/* 関連コミュニティ（Phase2接続ポイント） */}
          {relatedSubjects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">関連コミュニティ</h3>
              <div className="space-y-3">
                {relatedSubjects.map((subject) => (
                  <CommunityCard key={subject.id} subject={subject} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
