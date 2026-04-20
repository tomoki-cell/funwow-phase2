const planConfig: Record<string, { label: string; style: string }> = {
  free:                 { label: 'フォロワー',           style: 'bg-white text-gray-600 border-gray-300' },
  annual:               { label: '年会員',               style: 'bg-gray-900 text-white border-gray-900' },
  standard_individual:  { label: 'スタンダード（個人）',  style: 'bg-blue-600 text-white border-blue-600' },
  standard_corporate:   { label: 'スタンダード（法人）',  style: 'bg-blue-800 text-white border-blue-800' },
  premium_individual:   { label: 'プレミアム（個人）',    style: 'bg-amber-500 text-white border-amber-500' },
  premium_corporate:    { label: 'プレミアム（法人）',    style: 'bg-amber-700 text-white border-amber-700' },
}

export default function MembershipBadge({ plan }: { plan: string }) {
  const cfg = planConfig[plan] ?? { label: plan, style: 'bg-gray-100 text-gray-600 border-gray-200' }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.style}`}>
      {cfg.label}
    </span>
  )
}
