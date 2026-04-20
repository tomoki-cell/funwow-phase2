import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getEventById } from '@/lib/mock/phase1'
import EventEntryButton from '@/components/EventEntryButton'
import { ChevronLeft, Calendar, MapPin, Video, Users, Lock } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function FunwowEventDetailPage({ params }: Props) {
  const { id } = await params
  const event = getEventById(id)
  if (!event) notFound()

  const startDate = new Date(event.startAt)
  const endDate = new Date(event.endAt)
  const dateStr = startDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
  const startTime = startDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  const endTime = endDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        探索へ戻る
      </Link>

      {/* funwow主催バッジ */}
      <div className="inline-flex items-center gap-1.5 text-sm font-medium bg-gray-900 text-white px-3 py-1 rounded-full mb-4">
        <span className="text-xs">funwow主催</span>
      </div>

      {event.coverImageUrl && (
        <div className="relative h-56 rounded-2xl overflow-hidden mb-8 bg-gray-100">
          <Image src={event.coverImageUrl} alt={event.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {event.isMemberOnly && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Lock className="w-4 h-4" />
            有料会員限定イベント
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
          {event.title}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 text-gray-600">
            <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
            <div>
              <div className="font-medium">{dateStr}</div>
              <div className="text-sm text-gray-400">
                {startTime} 〜 {endTime}
              </div>
            </div>
          </div>

          {event.locationText && (
            <div className="flex items-start gap-3 text-gray-600">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400" />
              <span>{event.locationText}</span>
            </div>
          )}

          {event.format === 'online' && (
            <div className="flex items-center gap-3 text-gray-600">
              <Video className="w-5 h-5 flex-shrink-0 text-gray-400" />
              <span>オンライン開催</span>
            </div>
          )}

          {event.format === 'hybrid' && (
            <div className="flex items-center gap-3 text-gray-600">
              <Video className="w-5 h-5 flex-shrink-0 text-gray-400" />
              <span>ハイブリッド開催</span>
            </div>
          )}

          {event.capacity && (
            <div className="flex items-center gap-3 text-gray-600">
              <Users className="w-5 h-5 flex-shrink-0 text-gray-400" />
              <span>定員 {event.capacity}名</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-6 mb-6">
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </div>

        <div className="space-y-3">
          <EventEntryButton eventId={event.id} isMemberOnly={event.isMemberOnly} />
          {event.isMemberOnly && (
            <p className="text-xs text-center text-gray-400">
              このイベントはfunwow有料会員限定です。
              <Link href="/mypage" className="underline ml-1 hover:text-gray-700">
                会員ページへ
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
