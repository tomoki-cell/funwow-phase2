import type { SubjectType } from '@/lib/types'
import { clsx } from 'clsx'

const labels: Record<SubjectType, string> = {
  artist: '作家',
  art_space: 'スペース',
  art_fair: 'フェア',
}

const colors: Record<SubjectType, string> = {
  artist: 'bg-amber-50 text-amber-700 border-amber-200',
  art_space: 'bg-sky-50 text-sky-700 border-sky-200',
  art_fair: 'bg-violet-50 text-violet-700 border-violet-200',
}

export default function SubjectBadge({ type }: { type: SubjectType }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        colors[type]
      )}
    >
      {labels[type]}
    </span>
  )
}
