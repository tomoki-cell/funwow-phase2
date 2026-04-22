'use client'

import { useState } from 'react'
import ImpressionForm from '@/components/ImpressionForm'
import { mockCurrentUser, type Impression } from '@/lib/mock/phase1'

interface Props {
  exhibitionId: string
  initialImpressions: Impression[]
}

export default function ImpressionSection({ exhibitionId, initialImpressions }: Props) {
  const [impressions, setImpressions] = useState<Impression[]>(initialImpressions)

  async function handleSubmitted(body: string) {
    const next: Impression = {
      id: `imp_${Date.now()}`,
      exhibitionId,
      userId: mockCurrentUser.id,
      userName: mockCurrentUser.name,
      body,
      createdAt: new Date().toISOString(),
    }
    setImpressions((prev) => [next, ...prev])
    await new Promise((r) => setTimeout(r, 300))
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">感想</h2>
        <span className="text-sm text-gray-400">{impressions.length}件</span>
      </div>

      {impressions.length > 0 ? (
        <div className="space-y-4 mb-5">
          {impressions.map((imp) => (
            <div key={imp.id} className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
                  {imp.userName[0]}
                </div>
                <span className="text-sm font-medium text-gray-700">{imp.userName}</span>
                <span className="text-xs text-gray-400 ml-auto">
                  {new Date(imp.createdAt).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{imp.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-4">まだ感想はありません。</p>
      )}

      <ImpressionForm exhibitionId={exhibitionId} onSubmitted={handleSubmitted} />
    </div>
  )
}
