import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCreatorBySlug, getExhibitionsByCreatorId } from '@/lib/mock/phase1'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import ExhibitionCard from '@/components/ExhibitionCard'
import CommunityCard from '@/components/CommunityCard'
import SaveButton from '@/components/SaveButton'
import { ChevronLeft, Users } from 'lucide-react'
import { mockCurrentUser } from '@/lib/mock/phase1'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CreatorDetailPage({ params }: Props) {
  const { slug } = await params
  const creator = getCreatorBySlug(slug)
  if (!creator) notFound()

  const exhibitions = getExhibitionsByCreatorId(creator.id)
  const relatedSubject = creator.relatedSubjectSlug
    ? getSubjectBySlug(creator.relatedSubjectSlug)
    : undefined

  const isSaved = mockCurrentUser.savedCreatorIds.includes(creator.id)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        探索へ戻る
      </Link>

      {/* ヘッダー */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gray-100">
        {creator.coverImageUrl && (
          <div className="relative h-56 md:h-64">
            <Image src={creator.coverImageUrl} alt={creator.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}
        <div className="absolute bottom-5 left-5 flex items-end gap-4">
          {creator.iconImageUrl && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image src={creator.iconImageUrl} alt={creator.name} fill className="object-cover" />
            </div>
          )}
          <div>
            <span className="text-xs text-white/70 mb-1 block">作家</span>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{creator.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
          </div>

          {/* 展示 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">参加展示</h2>
            {exhibitions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exhibitions.map((ex) => (
                  <ExhibitionCard key={ex.id} exhibition={ex} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">展示情報はありません。</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* 保存ボタン */}
          <SaveButton
            targetId={creator.id}
            targetType="creator"
            initialSaved={isSaved}
          />

          {/* コミュニティ（Phase2接続ポイント） */}
          {relatedSubject ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700">この作家のコミュニティ</h3>
              </div>
              <CommunityCard subject={relatedSubject} />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-5 text-center">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">このコミュニティはまだありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
