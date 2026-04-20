'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import { allSubjects } from '@/lib/mock/subjects'
import SubjectBadge from '@/components/SubjectBadge'
import JoinButton from '@/components/JoinButton'
import { Suspense } from 'react'

function JoinForm({ subjectSlug }: { subjectSlug: string }) {
  const searchParams = useSearchParams()
  const defaultPlan = searchParams.get('plan') as 'free' | 'annual' | null

  const subject = allSubjects.find((s) => s.slug === subjectSlug)
  if (!subject) return null

  const annualPlan = subject.plans.find((p) => p.planCode === 'annual')
  const freePlan = subject.plans.find((p) => p.planCode === 'free')

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Link
        href={`/communities/${subjectSlug}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        コミュニティに戻る
      </Link>

      <div className="flex items-center gap-4 mb-8">
        {subject.iconImageUrl && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
            <Image src={subject.iconImageUrl} alt={subject.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <SubjectBadge type={subject.type} />
          <h1 className="text-xl font-bold text-gray-900 mt-1">{subject.name}</h1>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">参加プランを選ぶ</h2>

      <div className="space-y-4">
        {/* 年会員プラン */}
        {annualPlan && (
          <div
            className={`rounded-2xl p-6 border-2 transition-colors ${
              defaultPlan === 'annual'
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-lg">{annualPlan.name}</div>
                <div className={defaultPlan === 'annual' ? 'text-gray-300 text-sm' : 'text-gray-500 text-sm'}>
                  {annualPlan.priceAmount.toLocaleString()}円 / 年
                </div>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  defaultPlan === 'annual'
                    ? 'border-white/30 text-white/80'
                    : 'border-gray-200 text-gray-500'
                }`}
              >
                おすすめ
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed mb-4 ${
                defaultPlan === 'annual' ? 'text-gray-300' : 'text-gray-500'
              }`}
            >
              {annualPlan.description}
            </p>
            {annualPlan.includesFunwowBaseBenefits && (
              <div
                className={`flex items-center gap-1.5 text-sm mb-4 ${
                  defaultPlan === 'annual' ? 'text-green-300' : 'text-green-600'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Funwow 月1,000pt付与を含む
              </div>
            )}
            <JoinButton
              subjectSlug={subjectSlug}
              plan="annual"
              planName={annualPlan.name}
              price={annualPlan.priceAmount}
              className={
                defaultPlan === 'annual'
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
              }
            />
          </div>
        )}

        {/* freeプラン */}
        {freePlan && (
          <div className="rounded-2xl p-6 border border-gray-200 bg-white">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-gray-900">{freePlan.name}</div>
                <div className="text-gray-500 text-sm">無料</div>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{freePlan.description}</p>
            <JoinButton
              subjectSlug={subjectSlug}
              plan="free"
              planName={freePlan.name}
              price={0}
              className="border border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
            />
          </div>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        参加にはFunwowアカウントが必要です。{' '}
        <Link href="/sign-up" className="underline hover:text-gray-700">
          新規登録はこちら
        </Link>
      </p>
    </div>
  )
}

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export default async function JoinPage({ params }: Props) {
  const { subjectSlug } = await params
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-400">読み込み中...</div>}>
      <JoinForm subjectSlug={subjectSlug} />
    </Suspense>
  )
}
