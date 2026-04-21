// ============================================================
// Benefits (会員特典) Mock Data
// ============================================================

export type BenefitType =
  | 'event_registration'  // イベント申込・参加確認
  | 'private_viewing'     // プライベートビューイング
  | 'discount'            // 割引特典
  | 'exclusive_content'   // 限定コンテンツ・特典
  | 'point_bonus'         // ポイントボーナス

export type MemberPlanCode =
  | 'free'
  | 'standard_individual'
  | 'standard_corporate'
  | 'premium_individual'
  | 'premium_corporate'
  | 'annual'

export type UsageStatus =
  | 'pending'      // 申請中（承認待ち）
  | 'approved'     // 承認済み・未使用
  | 'checked_in'   // イベント当日参加確認済み
  | 'used'         // 使用済み
  | 'expired'      // 期限切れ
  | 'declined'     // 不承認

export interface Benefit {
  id: string
  subjectSlug: string
  title: string
  description: string
  type: BenefitType
  applicablePlans: MemberPlanCode[]  // 利用可能な会員プラン
  requiresApproval: boolean           // 管理者承認が必要か（false = 即承認）
  discountRate?: number               // 割引率（discount typeのみ）
  eventId?: string                    // 紐づくイベントID
  eventDate?: string                  // イベント日時（ISO）
  eventLocation?: string
  capacity?: number                   // 定員（nullで無制限）
  usageCount?: number                 // 現在の申請数
  isActive: boolean
  expiresAt?: string                  // 特典有効期限
}

export interface BenefitUsage {
  id: string
  benefitId: string
  userId: string
  userName: string
  userPlan: MemberPlanCode
  status: UsageStatus
  appliedAt: string
  usedAt?: string
  adminNote?: string
}

// ============================================================
// 特典定義（Gallery HAKU）
// ============================================================
export const mockBenefits: Benefit[] = [
  {
    id: 'b_001',
    subjectSlug: 'gallery-haku',
    title: '会員限定プレビュー「光の建築」',
    description: '一般公開前日の特別内覧会。作家・キュレーターによるレクチャー付き。ドリンク提供あり。',
    type: 'event_registration',
    applicablePlans: ['standard_individual', 'standard_corporate', 'premium_individual', 'premium_corporate', 'annual'],
    requiresApproval: false,
    eventId: 'ev_001',
    eventDate: '2026-04-20T18:00:00Z',
    eventLocation: 'Gallery HAKU（神楽坂）',
    capacity: 30,
    usageCount: 22,
    isActive: true,
  },
  {
    id: 'b_002',
    subjectSlug: 'gallery-haku',
    title: 'プライベートビューイング申請',
    description: 'ギャラリーの通常営業時間外に、プライベートな鑑賞の場を設けます。コレクターや法人のお客様のご招待にもご利用いただけます。',
    type: 'private_viewing',
    applicablePlans: ['premium_individual', 'premium_corporate'],
    requiresApproval: true,
    capacity: undefined,
    usageCount: 3,
    isActive: true,
  },
  {
    id: 'b_003',
    subjectSlug: 'gallery-haku',
    title: 'ギャラリーグッズ 10% 割引',
    description: 'ギャラリーショップのカタログ・グッズ・アーティストグッズを10%割引でご購入いただけます。',
    type: 'discount',
    applicablePlans: ['standard_individual', 'standard_corporate', 'premium_individual', 'premium_corporate', 'annual'],
    requiresApproval: false,
    discountRate: 10,
    isActive: true,
  },
  {
    id: 'b_004',
    subjectSlug: 'gallery-haku',
    title: 'アーティストトーク 優先席',
    description: 'イベント定員が満席になった場合でも、会員は優先的にご参加いただけます。前列席のご予約も可能。',
    type: 'event_registration',
    applicablePlans: ['standard_individual', 'standard_corporate', 'premium_individual', 'premium_corporate', 'annual'],
    requiresApproval: false,
    eventId: 'ev_002',
    eventDate: '2026-05-10T14:00:00Z',
    eventLocation: 'Gallery HAKU（神楽坂）',
    capacity: 20,
    usageCount: 8,
    isActive: true,
  },
  {
    id: 'b_005',
    subjectSlug: 'gallery-haku',
    title: 'オープンスタジオ見学（月1回）',
    description: 'プレミアム会員限定。提携アーティストのスタジオを少人数でご訪問いただけます。制作現場のお話が直接聞けます。',
    type: 'private_viewing',
    applicablePlans: ['premium_individual', 'premium_corporate'],
    requiresApproval: true,
    capacity: 6,
    usageCount: 4,
    isActive: true,
  },
  {
    id: 'b_006',
    subjectSlug: 'gallery-haku',
    title: '展覧会カタログ 無料送付',
    description: '開催中の展覧会カタログを毎回お送りします。プレミアム会員には過去カタログのバックナンバーも1冊お選びいただけます。',
    type: 'exclusive_content',
    applicablePlans: ['premium_individual', 'premium_corporate'],
    requiresApproval: false,
    isActive: true,
  },
  {
    id: 'b_007',
    subjectSlug: 'gallery-haku',
    title: 'Funwow ポイント 200pt ボーナス',
    description: 'チェックインのたびに通常10ptに加え200ptが追加付与されます（月3回まで）。',
    type: 'point_bonus',
    applicablePlans: ['standard_individual', 'standard_corporate', 'premium_individual', 'premium_corporate', 'annual'],
    requiresApproval: false,
    isActive: true,
  },
]

// ============================================================
// 利用申請履歴（モック）
// ============================================================
export const mockBenefitUsages: BenefitUsage[] = [
  // --- 現在ログインユーザー（u01 = 佐藤みき）の申請 ---
  {
    id: 'bu_001',
    benefitId: 'b_001',
    userId: 'u01',
    userName: '佐藤みき',
    userPlan: 'standard_individual',
    status: 'approved',
    appliedAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 'bu_002',
    benefitId: 'b_003',
    userId: 'u01',
    userName: '佐藤みき',
    userPlan: 'standard_individual',
    status: 'used',
    appliedAt: '2026-03-20T14:00:00Z',
    usedAt: '2026-03-22T15:00:00Z',
  },
  {
    id: 'bu_003',
    benefitId: 'b_004',
    userId: 'u01',
    userName: '佐藤みき',
    userPlan: 'standard_individual',
    status: 'pending',
    appliedAt: '2026-04-18T09:00:00Z',
  },

  // --- 他会員の申請（管理画面で見える） ---
  {
    id: 'bu_004',
    benefitId: 'b_001',
    userId: 'u02',
    userName: '田中健司',
    userPlan: 'standard_individual',
    status: 'approved',
    appliedAt: '2026-04-09T11:00:00Z',
  },
  {
    id: 'bu_005',
    benefitId: 'b_001',
    userId: 'u03',
    userName: '山田花子',
    userPlan: 'premium_individual',
    status: 'checked_in',
    appliedAt: '2026-04-08T12:00:00Z',
    usedAt: '2026-04-20T18:15:00Z',
  },
  {
    id: 'bu_006',
    benefitId: 'b_002',
    userId: 'u04',
    userName: '鈴木一朗',
    userPlan: 'premium_individual',
    status: 'pending',
    appliedAt: '2026-04-15T10:30:00Z',
  },
  {
    id: 'bu_007',
    benefitId: 'b_002',
    userId: 'u05',
    userName: '伊藤美咲',
    userPlan: 'premium_corporate',
    status: 'approved',
    appliedAt: '2026-04-01T09:00:00Z',
    adminNote: '4/25 18:00-19:30で調整済み',
  },
  {
    id: 'bu_008',
    benefitId: 'b_003',
    userId: 'u06',
    userName: '中村大輝',
    userPlan: 'standard_individual',
    status: 'used',
    appliedAt: '2026-03-10T13:00:00Z',
    usedAt: '2026-03-15T16:00:00Z',
  },
  {
    id: 'bu_009',
    benefitId: 'b_005',
    userId: 'u07',
    userName: '小林さゆり',
    userPlan: 'premium_individual',
    status: 'approved',
    appliedAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 'bu_010',
    benefitId: 'b_001',
    userId: 'u08',
    userName: '渡辺隆',
    userPlan: 'standard_individual',
    status: 'approved',
    appliedAt: '2026-04-11T15:00:00Z',
  },
  {
    id: 'bu_011',
    benefitId: 'b_004',
    userId: 'u09',
    userName: '加藤恵子',
    userPlan: 'annual',
    status: 'approved',
    appliedAt: '2026-04-14T09:00:00Z',
  },
  {
    id: 'bu_012',
    benefitId: 'b_006',
    userId: 'u10',
    userName: '松本悟',
    userPlan: 'premium_individual',
    status: 'used',
    appliedAt: '2026-03-01T10:00:00Z',
    usedAt: '2026-03-05T14:00:00Z',
  },
]

// ============================================================
// ヘルパー関数
// ============================================================

export function getBenefitsBySubject(subjectSlug: string): Benefit[] {
  return mockBenefits.filter((b) => b.subjectSlug === subjectSlug && b.isActive)
}

export function getUserBenefitUsages(userId: string): BenefitUsage[] {
  return mockBenefitUsages.filter((u) => u.userId === userId)
}

export function getBenefitUsages(benefitId: string): BenefitUsage[] {
  return mockBenefitUsages.filter((u) => u.benefitId === benefitId)
}

export function getUserBenefitStatus(
  userId: string,
  benefitId: string
): UsageStatus | null {
  const usage = mockBenefitUsages.find(
    (u) => u.userId === userId && u.benefitId === benefitId
  )
  return usage?.status ?? null
}

export function isTodayOrWithin2Hours(isoDate?: string): boolean {
  if (!isoDate) return false
  const event = new Date(isoDate)
  const now = new Date()
  const diffMs = event.getTime() - now.getTime()
  // イベント開始2時間前〜終了3時間後
  return diffMs >= -3 * 60 * 60 * 1000 && diffMs <= 2 * 60 * 60 * 1000
}

export const benefitTypeLabel: Record<BenefitType, string> = {
  event_registration: 'イベント',
  private_viewing: 'プライベートビューイング',
  discount: '割引特典',
  exclusive_content: '限定コンテンツ',
  point_bonus: 'ポイントボーナス',
}

export const planDisplayName: Record<MemberPlanCode, string> = {
  free: 'フリー',
  annual: '年会員',
  standard_individual: 'スタンダード（個人）',
  standard_corporate: 'スタンダード（法人）',
  premium_individual: 'プレミアム（個人）',
  premium_corporate: 'プレミアム（法人）',
}
