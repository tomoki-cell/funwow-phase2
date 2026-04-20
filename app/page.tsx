import Link from 'next/link'
import { allSubjects } from '@/lib/mock/subjects'
import { mockExhibitions } from '@/lib/mock/phase1'
import CommunityCard from '@/components/CommunityCard'
import ExhibitionCard from '@/components/ExhibitionCard'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const featuredCommunities = allSubjects.slice(0, 3)
  const activeExhibitions = mockExhibitions
    .filter((ex) => new Date(ex.endDate) >= new Date())
    .slice(0, 3)

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
          アートとの出会いを、<br className="hidden sm:block" />継続的な関係へ。
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
          展示を探し、来場し、作家や空間との関係をつくっていく。
          コミュニティに参加して、単発の鑑賞を「縁」に変えていこう。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/explore"
            className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
          >
            展示を探す <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/communities"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:border-gray-500 transition-colors"
          >
            コミュニティを見る
          </Link>
        </div>
      </section>

      {/* 開催中の展示 */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">開催中の展示</h2>
          <Link
            href="/explore"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            すべて見る <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeExhibitions.map((ex) => (
            <ExhibitionCard key={ex.id} exhibition={ex} />
          ))}
        </div>
      </section>

      {/* おすすめコミュニティ */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">おすすめコミュニティ</h2>
            <p className="text-sm text-gray-500 mt-1">
              作家・ギャラリー・フェアと継続的な関係をつくろう
            </p>
          </div>
          <Link
            href="/communities"
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
          >
            すべて見る <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredCommunities.map((subject) => (
            <CommunityCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      {/* funwow の説明 */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl mb-4">🗺</div>
            <h3 className="font-semibold text-gray-900 mb-2">展示を探す</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              全国の展示・スペース・作家を横断的に探索。気になる展示を保存して、来場を記録しよう。
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-4">🎟</div>
            <h3 className="font-semibold text-gray-900 mb-2">ポイントを貯める</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              月額会員なら毎月1,000pt。5か所巡るとボーナスポイント。貯めたポイントはギャラリーで使える。
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="font-semibold text-gray-900 mb-2">コミュニティに参加</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              好きな作家・ギャラリー・フェアのコミュニティに参加して、継続的なつながりをつくろう。
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
