import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSpaceBySlug, getExhibitionsBySpaceId } from '@/lib/mock/phase1'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import ExhibitionCard from '@/components/ExhibitionCard'
import CommunityCard from '@/components/CommunityCard'
import { MapPin, ChevronLeft, Users } from 'lucide-react'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function SpaceDetailPage({ params }: Props) {
  const { slug } = await params
  const space = getSpaceBySlug(slug)
  if (!space) notFound()

  const exhibitions = getExhibitionsBySpaceId(space.id)
  const relatedSubject = space.relatedSubjectSlug
    ? getSubjectBySlug(space.relatedSubjectSlug)
    : undefined

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
        {space.coverImageUrl && (
          <div className="relative h-56 md:h-72">
            <Image src={space.coverImageUrl} alt={space.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        )}
        <div className="absolute bottom-5 left-5 flex items-end gap-4">
          {space.iconImageUrl && (
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-white shadow-lg">
              <Image src={space.iconImageUrl} alt={space.name} fill className="object-cover" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              {space.isPartner && (
                <span className="text-xs bg-blue-500 text-white px-2.5 py-0.5 rounded-full font-medium">
                  提携スペース
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{space.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <p className="text-gray-600 leading-relaxed">{space.description}</p>
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-3">
              <MapPin className="w-4 h-4" />
              {space.address}
            </div>
          </div>

          {/* 展示一覧 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">展示</h2>
            {exhibitions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {exhibitions.map((ex) => (
                  <ExhibitionCard key={ex.id} exhibition={ex} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">現在の展示情報はありません。</p>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {/* コミュニティ（Phase2接続ポイント） */}
          {relatedSubject ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-700">このスペースのコミュニティ</h3>
              </div>
              <CommunityCard subject={relatedSubject} />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-5 text-center">
              <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">このスペースのコミュニティはまだありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
