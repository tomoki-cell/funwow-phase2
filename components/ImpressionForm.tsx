'use client'

import { useState } from 'react'
import { MessageCircle, Loader2, CheckCircle } from 'lucide-react'

interface Props {
  exhibitionId: string
  onSubmitted?: (body: string) => Promise<void> | void
}

export default function ImpressionForm({ exhibitionId, onSubmitted }: Props) {
  const [body, setBody] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim() || state !== 'idle') return
    const text = body.trim()
    setState('loading')

    if (onSubmitted) {
      await onSubmitted(text)
    } else {
      // TODO: Supabase Impression 作成
      await new Promise((r) => setTimeout(r, 700))
    }

    setState('done')
    setBody('')
    setTimeout(() => setState('idle'), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
        <MessageCircle className="w-4 h-4" />
        感想を書く
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full text-sm text-gray-700 placeholder-gray-300 border-0 outline-none resize-none"
        rows={3}
        placeholder="この展示について感じたことを記録する..."
        disabled={state !== 'idle'}
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-300">{body.length} 文字</span>
        <button
          type="submit"
          disabled={!body.trim() || state !== 'idle'}
          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {state === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {state === 'done' && <CheckCircle className="w-3.5 h-3.5" />}
          {state === 'done' ? '投稿しました' : '投稿'}
        </button>
      </div>
    </form>
  )
}
