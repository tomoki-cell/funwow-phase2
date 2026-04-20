import { notFound } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import { Building2, Plus } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

const mockExhibitions = [
  { id: 'ex_001', title: '余白の記録', space: 'Gallery HAKU', startDate: '2025-03-01', endDate: '2025-03-30', relationType: 'creator_related' },
  { id: 'ex_002', title: '境界線の詩', space: 'Gallery HAKU', startDate: '2025-05-24', endDate: '2025-06-20', relationType: 'venue_related' },
]

const relationLabels: Record<string, string> = {
  creator_related: '作家として参加',
  venue_related: '会場として開催',
  fair_related: 'フェアとして開催',
  presented_by: '主催',
}

export default async function ExhibitionsPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">展示登録</h1>
          <p className="text-sm text-gray-500 mt-1">
            この主体に紐づく展示をFunwow探索カタログと接続します
          </p>
        </div>
        {/* TODO: 展示検索・紐づけフォーム（Supabase + Phase1 Exhibitionテーブル連携後） */}
        <button className="flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
          <Plus className="w-4 h-4" />
          展示を追加
        </button>
      </div>

      {/* TODO: Phase1 Exhibition テーブルとの接続ポイント */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-700">
        <strong>仮置き：</strong> Phase1の Exhibition テーブルと SubjectExhibitionLink を通じて紐づけます。
        現在はモックデータを表示しています。
      </div>

      <div className="space-y-3">
        {mockExhibitions.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">{ex.title}</div>
              <div className="text-sm text-gray-500 mt-0.5">
                {ex.space} ·{' '}
                {new Date(ex.startDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
                〜
                {new Date(ex.endDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">
              {relationLabels[ex.relationType]}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">
        ※ Supabase連携後、Phase1のExhibitionカタログから検索・紐づけができるようになります。
      </p>
    </div>
  )
}
