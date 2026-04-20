'use client'

import { useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  targetId: string
  targetType: 'exhibition' | 'creator' | 'space'
  initialSaved?: boolean
}

export default function SaveButton({ targetId, targetType, initialSaved = false }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse] = useState(false)

  async function handleToggle() {
    if (loading) return
    setLoading(true)

    // TODO: Supabase Save テーブルへの insert/delete
    await new Promise((r) => setTimeout(r, 400))

    setSaved((prev) => !prev)
    if (!saved) {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={clsx(
        'flex items-center justify-center gap-2 py-2.5 px-4 rounded-full border text-sm font-medium transition-all',
        saved
          ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
          : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart
          className={clsx(
            'w-4 h-4 transition-transform',
            saved && 'fill-red-400',
            pulse && 'scale-125'
          )}
        />
      )}
      {saved ? '保存済み' : '保存'}
    </button>
  )
}
