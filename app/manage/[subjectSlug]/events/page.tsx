import { notFound } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import { Lock, Eye, PenLine } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export default async function ManageEventsPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">イベント管理</h1>
        {/* TODO: イベント作成フォーム（Server Action） */}
        <button className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
          + 新しいイベント
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">イベント名</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">形式</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">公開範囲</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">開催日</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">定員</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {subject.upcomingEvents.map((event) => (
              <tr key={event.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-800 line-clamp-1">{event.title}</div>
                </td>
                <td className="px-5 py-3 text-gray-500 capitalize">{event.eventFormat}</td>
                <td className="px-5 py-3">
                  {event.visibility === 'members_only' ? (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Lock className="w-3 h-3" /> 会員限定
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Eye className="w-3 h-3" /> 公開
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(event.startAt).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {event.capacity ? `${event.capacity}名` : '—'}
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="text-gray-400 hover:text-gray-700 transition-colors">
                    <PenLine className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        ※ モックデータを表示しています。イベント作成・編集はSupabase連携後に実装します。
      </p>
    </div>
  )
}
