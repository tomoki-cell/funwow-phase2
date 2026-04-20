'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  eventId: string
  isMemberOnly?: boolean
  label?: string
}

export default function EventEntryButton({ eventId, isMemberOnly = false, label }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleEntry() {
    if (state !== 'idle') return
    setState('loading')

    // TODO: Supabase EventEntry 作成
    await new Promise((r) => setTimeout(r, 900))

    setState('done')
  }

  return (
    <button
      onClick={handleEntry}
      disabled={state !== 'idle'}
      className={clsx(
        'flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-medium text-sm transition-all',
        state === 'done'
          ? 'bg-green-500 text-white cursor-default'
          : state === 'loading'
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-gray-900 text-white hover:bg-gray-700'
      )}
    >
      {state === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
      {state === 'done' && <CheckCircle className="w-4 h-4" />}
      {state === 'done'
        ? '申し込み完了！'
        : label ?? (isMemberOnly ? '参加を申し込む（会員限定）' : '参加を申し込む')}
    </button>
  )
}
