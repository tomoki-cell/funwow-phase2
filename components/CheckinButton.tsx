'use client'

import { useState } from 'react'
import { Stamp, CheckCircle, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  exhibitionId: string
  exhibitionTitle: string
}

export default function CheckinButton({ exhibitionId, exhibitionTitle }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [showToast, setShowToast] = useState(false)

  async function handleCheckin() {
    if (state !== 'idle') return
    setState('loading')

    // TODO: Supabase Stamp 作成 + Participation 記録
    await new Promise((r) => setTimeout(r, 900))

    setState('done')
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="relative">
      <button
        onClick={handleCheckin}
        disabled={state === 'loading'}
        className={clsx(
          'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all',
          state === 'done'
            ? 'bg-green-500 text-white cursor-default'
            : state === 'loading'
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-700'
        )}
      >
        {state === 'loading' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : state === 'done' ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <Stamp className="w-4 h-4" />
        )}
        {state === 'done' ? 'チェックイン済み' : 'チェックイン'}
      </button>

      {/* トースト通知 */}
      <div
        className={clsx(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-gray-900 text-white text-xs px-4 py-2 rounded-full whitespace-nowrap shadow-lg transition-all duration-300',
          showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'
        )}
      >
        ✅ チェックインしました！ +スタンプ
      </div>
    </div>
  )
}
