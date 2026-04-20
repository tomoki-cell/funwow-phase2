import { notFound } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import MembershipBadge from '@/components/MembershipBadge'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

const mockMembers = [
  { id: 'u1', name: '田中 花子', plan: 'annual' as const, joinedAt: '2025-01-15', status: 'active' },
  { id: 'u2', name: '鈴木 一郎', plan: 'free' as const, joinedAt: '2025-02-20', status: 'active' },
  { id: 'u3', name: '佐藤 みき', plan: 'annual' as const, joinedAt: '2025-03-01', status: 'active' },
  { id: 'u4', name: '山本 直樹', plan: 'free' as const, joinedAt: '2025-03-10', status: 'active' },
  { id: 'u5', name: '高橋 さくら', plan: 'annual' as const, joinedAt: '2025-04-01', status: 'active' },
]

export default async function MembersPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  const annualCount = mockMembers.filter((m) => m.plan === 'annual').length
  const freeCount = mockMembers.filter((m) => m.plan === 'free').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">会員一覧</h1>
        {/* TODO: CSV エクスポート機能 */}
        <button className="text-sm border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full hover:border-gray-400 transition-colors">
          CSV 書き出し
        </button>
      </div>

      {/* サマリー */}
      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{subject.memberCount.toLocaleString()}</div>
          <div className="text-sm text-gray-500">総会員数</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{annualCount}</div>
          <div className="text-sm text-gray-500">年会員</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
          <div className="text-2xl font-bold text-gray-900">{freeCount}</div>
          <div className="text-sm text-gray-500">フォロワー</div>
        </div>
      </div>

      {/* 会員テーブル */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">名前</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">プラン</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">参加日</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody>
            {mockMembers.map((member) => (
              <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">{member.name}</td>
                <td className="px-5 py-3">
                  <MembershipBadge plan={member.plan} />
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(member.joinedAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-5 py-3">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        ※ モックデータを表示しています。Supabase 連携後に実データに切り替えます。
      </p>
    </div>
  )
}
