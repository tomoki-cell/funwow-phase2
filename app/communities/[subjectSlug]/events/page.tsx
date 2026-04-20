import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import EventCard from '@/components/EventCard'
import { ChevronLeft } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export default async function EventsPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  const membership = subject.currentUserMembership
  const isMember = !!membership

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href={`/communities/${subjectSlug}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        {subject.name}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">イベント</h1>

      <div className="space-y-4">
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

      {!isMember && (
        <div className="mt-10 text-center py-10 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-gray-500 mb-4">会員限定イベントは参加後に申し込めます。</p>
          <Link
            href={`/communities/${subjectSlug}/join`}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
          >
            参加する
          </Link>
        </div>
      )}
    </div>
  )
}
