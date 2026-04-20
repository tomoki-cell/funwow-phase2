import Link from 'next/link'
import type { Event } from '@/lib/types'
import { Calendar, MapPin, Video, Lock } from 'lucide-react'
import { clsx } from 'clsx'

const formatLabel: Record<Event['eventFormat'], string> = {
  online: 'オンライン',
  offline: '会場',
  hybrid: 'ハイブリッド',
}

interface EventCardProps {
  event: Event
  subjectSlug: string
  isLocked?: boolean
}

export default function EventCard({ event, subjectSlug, isLocked = false }: EventCardProps) {
  const startDate = new Date(event.startAt)
  const dateStr = startDate.toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
  const timeStr = startDate.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Link
      href={
        isLocked
          ? `/communities/${subjectSlug}/join`
          : `/communities/${subjectSlug}/events/${event.id}`
      }
      className="group block"
    >
      <div
        className={clsx(
          'bg-white rounded-xl border p-4 transition-all',
          isLocked
            ? 'border-gray-100 opacity-70'
            : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
        )}
      >
        <div className="flex items-start gap-4">
          {/* 日付ブロック */}
          <div className="flex-shrink-0 w-12 text-center">
            <div className="text-2xl font-bold text-gray-900 leading-none">
              {startDate.getDate()}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {startDate.toLocaleDateString('ja-JP', { month: 'short' })}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {event.visibility === 'members_only' && (
                <span className="text-xs text-gray-500 flex items-center gap-0.5">
                  <Lock className="w-3 h-3" /> 会員限定
                </span>
              )}
              <span className="text-xs text-gray-400">{formatLabel[event.eventFormat]}</span>
            </div>
            <h4 className="font-medium text-gray-900 leading-snug line-clamp-2 mb-2">
              {event.title}
            </h4>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {dateStr} {timeStr}〜
              </span>
              {event.locationText && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.locationText}
                </span>
              )}
              {event.eventFormat === 'online' && (
                <span className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5" />
                  オンライン
                </span>
              )}
              {event.capacity && (
                <span className="text-gray-400">定員 {event.capacity}名</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
