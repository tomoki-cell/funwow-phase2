import { allSubjects } from '@/lib/mock/subjects'
import CommunityCard from '@/components/CommunityCard'
import type { SubjectType } from '@/lib/types'

const typeLabels: Record<SubjectType, string> = {
  artist: '作家',
  art_space: 'スペース',
  art_fair: 'フェア',
}

export default function CommunitiesPage() {
  const groupedByType = allSubjects.reduce<Record<string, typeof allSubjects>>(
    (acc, subject) => {
      const key = subject.type
      if (!acc[key]) acc[key] = []
      acc[key].push(subject)
      return acc
    },
    {}
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">コミュニティ</h1>
        <p className="text-gray-500">
          作家・スペース・フェアのコミュニティを見つけて、継続的な関係を始めよう。
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        <button className="px-4 py-1.5 rounded-full text-sm bg-gray-900 text-white font-medium">
          すべて
        </button>
        {(Object.keys(typeLabels) as SubjectType[]).map((type) => (
          <button
            key={type}
            className="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors"
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      {/* 全件グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {allSubjects.map((subject) => (
          <CommunityCard key={subject.id} subject={subject} />
        ))}
      </div>
    </div>
  )
}
