import Link from 'next/link'
import Image from 'next/image'
import { mockExhibitions, mockSpaces, mockCreators, mockFunwowEvents, mockCurrentUser } from '@/lib/mock/phase1'
import ExhibitionCard from '@/components/ExhibitionCard'
import CreatorCard from '@/components/CreatorCard'
import { ArrowRight, MapPin, Calendar, Video } from 'lucide-react'

export default function ExplorePage() {
  const activeExhibitions = mockExhibitions.filter(
    (ex) => new Date(ex.endDate) >= new Date()
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">探索</h1>
      <p className="text-gray-500 mb-10">展示・スペース・作家・イベントを見つけよう。</p>

      {/* 開催中の展示 */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">開催中の展示</h2>
          <Link
            href="#"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            すべて見る <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeExhibitions.map((ex) => (
            <ExhibitionCard
              key={ex.id}
              exhibition={ex}
              isSaved={mockCurrentUser.savedExhibitionIds.includes(ex.id)}
            />
          ))}
        </div>
      </section>

      {/* スペース */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">スペース</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mockSpaces.map((space) => (
            <Link
              key={space.id}
              href={`/spaces/${space.slug}`}
              className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-all"
            >
              {space.iconImageUrl && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={space.iconImageUrl}
                    alt={space.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <div className="font-semibold text-gray-900 text-sm leading-tight">{space.name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  {space.address.split('東京都').join('').split('区')[0]}区
                </div>
                {space.isPartner && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                    提携
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 作家 */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">作家</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </section>

      {/* Funwow Events */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-gray-900">イベント</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFunwowEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-all overflow-hidden"
            >
              {event.coverImageUrl && (
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={event.coverImageUrl}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {event.isMemberOnly && (
                    <div className="absolute top-2 left-2">
                      <span className="text-xs bg-gray-900 text-white px-2 py-0.5 rounded-full">
                        会員限定
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 leading-snug text-sm line-clamp-2 mb-2">
                  {event.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(event.startAt).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  {event.format === 'online' && (
                    <span className="flex items-center gap-1">
                      <Video className="w-3.5 h-3.5" /> オンライン
                    </span>
                  )}
                  {event.locationText && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{event.locationText.split('　')[0]}</span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
