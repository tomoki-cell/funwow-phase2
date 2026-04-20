import { notFound } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import { Lock, Eye, PenLine } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export default async function ManagePostsPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">投稿管理</h1>
        {/* TODO: 投稿作成フォーム（Server Action） */}
        <button className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
          + 新しい投稿
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">タイトル</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">公開範囲</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">ステータス</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">公開日</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {subject.latestPosts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-800 line-clamp-1">{post.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{post.postType}</div>
                </td>
                <td className="px-5 py-3">
                  {post.visibility === 'members_only' ? (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Lock className="w-3 h-3" /> 会員限定
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Eye className="w-3 h-3" /> 公開
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      post.status === 'published'
                        ? 'text-green-600 bg-green-50 border-green-200'
                        : 'text-gray-500 bg-gray-50 border-gray-200'
                    }`}
                  >
                    {post.status === 'published' ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : '—'}
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
        ※ モックデータを表示しています。投稿作成・編集フォームはSupabase連携後に実装します。
      </p>
    </div>
  )
}
