'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import type { MembershipPlan } from '@/lib/types'

interface Props {
  subjectSlug: string
  plan: MembershipPlan
  planName: string
  price: number
  label?: string
  className?: string
}

export default function JoinButton({
  subjectSlug,
  plan,
  planName,
  price,
  label,
  className,
}: Props) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  async function handleJoin() {
    if (state !== 'idle') return
    setState('loading')

    // TODO: Supabase CommunityMembership 作成 + Clerk userId 紐づけ
    // TODO: annual の場合は Stripe/課金フロー
    await new Promise((r) => setTimeout(r, 1000))

    setState('done')

    // 年会員は会員証ページへ、フォロワーはコミュニティページへ
    setTimeout(() => {
      if (plan === 'annual') {
        router.push(`/communities/${subjectSlug}/pass`)
      } else {
        router.push(`/communities/${subjectSlug}`)
      }
      router.refresh()
    }, 1500)
  }

  return (
    <button
      onClick={handleJoin}
      disabled={state !== 'idle'}
      className={clsx(
        'w-full flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all',
        state === 'done'
          ? 'bg-green-500 text-white cursor-default'
          : state === 'loading'
          ? 'opacity-60 cursor-not-allowed'
          : '',
        className
      )}
    >
      {state === 'loading' ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : state === 'done' ? (
        <CheckCircle className="w-4 h-4" />
      ) : null}
      {state === 'done'
        ? '参加しました！'
        : state === 'loading'
        ? '処理中...'
        : label ?? (plan === 'annual' ? `年会員で参加する（¥${price.toLocaleString()}/年）` : 'フォロワーとして参加（無料）')}
    </button>
  )
}
