import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSubjectBySlug, getEventById } from '@/lib/mock/subjects'
import EventEntryButton from '@/components/EventEntryButton'
import { ChevronLeft, Calendar, MapPin, Video, Users, Lock } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string; eventId: string }>
}

export default async function EventDetailPage({ params }: Props) {
  const { subjectSlug, eventId } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  const event = getEventById(subjectSlug, eventId)
  if (!event) notFound()

  const membership = subject.currentUserMembership
  const isMember = !!membership

  if (event.visibility === 'members_only' && !isMember) {
    redirect(`/communities/${subjectSlug}/join`)
  }

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
        href={`/communities/${subjectSlug}/events`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        イベント一覧へ
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          {event.visibility === 'members_only' && (
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
              <Lock className="w-4 h-4" /> 会員限定イベント
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

            {event.eventFormat === 'online' && (
              <div className="flex items-center gap-3 text-gray-600">
                <Video className="w-5 h-5 flex-shrink-0 text-gray-400" />
                <span>オンライン開催</span>
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

          {/* 申し込み */}
          <div className="flex gap-3">
            <EventEntryButton
              eventId={event.id}
              isMemberOnly={event.visibility === 'members_only'}
            />
            {event.entryUrl && (
              <a
                href={event.entryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-200 text-gray-700 px-5 py-3 rounded-full text-sm font-medium hover:border-gray-400 transition-colors"
              >
                外部サイトへ
              </a>
            )}
          </div>

          {!isMember && event.visibility === 'public' && (
            <p className="text-xs text-gray-400 mt-3 text-center">
              このイベントは非会員の方も参加できます。
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <Link
          href={`/communities/${subjectSlug}`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← {subject.name} のコミュニティに戻る
        </Link>
      </div>
    </div>
  )
}
