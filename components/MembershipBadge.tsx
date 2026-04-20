import type { MembershipPlan } from '@/lib/types'
import { clsx } from 'clsx'

export default function MembershipBadge({ plan }: { plan: MembershipPlan }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        plan === 'annual'
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-600 border-gray-300'
      )}
    >
      {plan === 'annual' ? '年会員' : 'フォロワー'}
    </span>
  )
}
