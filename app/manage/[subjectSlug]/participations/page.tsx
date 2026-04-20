import { notFound } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

const mockParticipations = [
  { id: 'p1', userName: '田中 花子', type: 'event_participation', label: 'イベント参加', detail: 'オンライン教室「光と影の読み方」', occurredAt: '2025-04-10T14:00:00Z' },
  { id: 'p2', userName: '鈴木 一郎', type: 'visit', label: '来場', detail: 'Gallery HAKU（神楽坂）', occurredAt: '2025-04-08T12:00:00Z' },
  { id: 'p3', userName: '佐藤 みき', type: 'pass_redemption', label: '会員証提示', detail: '特典利用', occurredAt: '2025-04-05T16:30:00Z' },
  { id: 'p4', userName: '高橋 さくら', type: 'event_participation', label: 'イベント参加', detail: '公開トーク：作品と場所の記憶', occurredAt: '2025-03-31T15:00:00Z' },
]

const typeColors: Record<string, string> = {
  event_participation: 'text-blue-600 bg-blue-50 border-blue-200',
  visit: 'text-green-600 bg-green-50 border-green-200',
  pass_redemption: 'text-purple-600 bg-purple-50 border-purple-200',
}

export default async function ParticipationsPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">参加履歴</h1>
        <p className="text-sm text-gray-500 mt-1">
          イベント参加・来場・会員証提示の記録
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">種別</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">ユーザー</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">内容</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">日時</th>
            </tr>
          </thead>
          <tbody>
            {mockParticipations.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[p.type] ?? 'text-gray-500 bg-gray-50 border-gray-200'}`}>
                    {p.label}
                  </span>
                </td>
                <td className="px-5 py-3 font-medium text-gray-800">{p.userName}</td>
                <td className="px-5 py-3 text-gray-500">{p.detail}</td>
                <td className="px-5 py-3 text-gray-400">
                  {new Date(p.occurredAt).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        ※ モックデータを表示しています。Supabase連携後に実データに切り替えます。
      </p>
    </div>
  )
}
