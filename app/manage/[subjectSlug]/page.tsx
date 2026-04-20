import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import SubjectBadge from '@/components/SubjectBadge'
import { Users, FileText, Calendar, TrendingUp, ArrowRight } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export default async function ManageDashboard({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  const stats = [
    { label: 'メンバー数', value: subject.memberCount.toLocaleString(), icon: Users, href: 'members' },
    { label: '投稿数', value: subject.postCount.toString(), icon: FileText, href: 'posts' },
    { label: 'イベント数', value: subject.eventCount.toString(), icon: Calendar, href: 'events' },
    { label: '参加履歴', value: '—', icon: TrendingUp, href: 'participations' },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <SubjectBadge type={subject.type} />
        <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
      </div>

      {/* Stats カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={`/manage/${subjectSlug}/${href}`}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-5 h-5 text-gray-400" />
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </Link>
        ))}
      </div>

      {/* 最近の投稿 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">最近の投稿</h2>
            <Link
              href={`/manage/${subjectSlug}/posts`}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              すべて見る
            </Link>
          </div>
          <div className="space-y-3">
            {subject.latestPosts.slice(0, 3).map((post) => (
              <div key={post.id} className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 line-clamp-1">{post.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {post.visibility === 'members_only' ? '会員限定' : '公開'} ·{' '}
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '未公開'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/manage/${subjectSlug}/posts`}
            className="mt-4 block w-full text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-2 hover:border-gray-300 transition-colors"
          >
            + 新しい投稿を作成
          </Link>
        </div>

        {/* 次のイベント */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">次のイベント</h2>
            <Link
              href={`/manage/${subjectSlug}/events`}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
            >
              すべて見る
            </Link>
          </div>
          <div className="space-y-3">
            {subject.upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="py-2 border-b border-gray-50 last:border-0">
                <div className="text-sm font-medium text-gray-800 line-clamp-1">{event.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {event.visibility === 'members_only' ? '会員限定' : '公開'} ·{' '}
                  {new Date(event.startAt).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
          <Link
            href={`/manage/${subjectSlug}/events`}
            className="mt-4 block w-full text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg py-2 hover:border-gray-300 transition-colors"
          >
            + 新しいイベントを作成
          </Link>
        </div>
      </div>
    </div>
  )
}
