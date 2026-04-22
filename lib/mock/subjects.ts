import type {
  Subject,
  MembershipPlanDef,
  Post,
  Event,
  CommunityMembership,
  SubjectWithStats,
} from '@/lib/types'

// ============================================================
// Mock: 作家 Subject
// ============================================================

export const mockArtistSubject: Subject = {
  id: 'sub_artist_001',
  type: 'artist',
  name: '山田 蒼',
  slug: 'aoi-yamada',
  description:
    '写真と言語を横断しながら、記憶と場所の関係を探求する作家。国内外での個展のほか、オンライントークや教室を定期開催。参加者と共に思考を深める場をつくっています。',
  coverImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
  iconImageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
  communityEnabled: true,
  isPublic: true,
  linkedCreatorId: 'creator_aoi_yamada',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2025-03-10T00:00:00Z',
}

export const mockArtistPlans: MembershipPlanDef[] = [
  {
    id: 'plan_artist_free',
    subjectId: 'sub_artist_001',
    planCode: 'free',
    name: 'フォロワー',
    description: '公開投稿・公開イベントへのアクセス。活動のアップデートをフォローできます。',
    priceAmount: 0,
    billingCycle: 'none',
    includesFunwowBaseBenefits: false,
    isActive: true,
  },
  {
    id: 'plan_artist_annual',
    subjectId: 'sub_artist_001',
    planCode: 'annual',
    name: 'サポーター（年会員）',
    description:
      '限定投稿・限定イベント（オンライン教室、トーク等）へのアクセス。Funwow月1,000ptも付与。',
    priceAmount: 12000,
    billingCycle: 'annual',
    includesFunwowBaseBenefits: true,
    isActive: true,
  },
]

export const mockArtistPosts: Post[] = [
  {
    id: 'post_a_001',
    subjectId: 'sub_artist_001',
    title: '新作シリーズ「余白の記録」展示レポート',
    body: '先日の個展を振り返って。会場で交わした言葉と、写真の間にあるものについて書きました。',
    postType: 'report',
    visibility: 'public',
    coverImageUrl: 'https://images.unsplash.com/photo-1544967919-44c1ef2f9e7e?w=800&q=80',
    publishedAt: '2025-04-10T10:00:00Z',
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-04-10T10:00:00Z',
  },
  {
    id: 'post_a_002',
    subjectId: 'sub_artist_001',
    title: '【会員限定】5月のオンライン教室について',
    body: '5月の教室テーマと参加方法をお知らせします。今回は「光と影の読み方」をテーマに2時間。',
    postType: 'announcement',
    visibility: 'members_only',
    publishedAt: '2025-04-15T10:00:00Z',
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-15T09:00:00Z',
    updatedAt: '2025-04-15T10:00:00Z',
  },
  {
    id: 'post_a_003',
    subjectId: 'sub_artist_001',
    title: '撮影記：島根の光',
    body: '先月の島根滞在で撮り溜めた写真と、そこから考えたこと。自然光と記憶の関係について。',
    postType: 'report',
    visibility: 'public',
    coverImageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    publishedAt: '2025-03-28T10:00:00Z',
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-03-28T09:00:00Z',
    updatedAt: '2025-03-28T10:00:00Z',
  },
]

export const mockArtistEvents: Event[] = [
  {
    id: 'event_a_001',
    organizerSubjectId: 'sub_artist_001',
    isFunwowHosted: false,
    title: 'オンライン教室「光と影の読み方」',
    description:
      '写真における光の質と影の構造を読み解くオンライン教室。録画アーカイブあり（会員限定）。',
    startAt: '2025-05-17T14:00:00Z',
    endAt: '2025-05-17T16:00:00Z',
    eventFormat: 'online',
    visibility: 'members_only',
    capacity: 20,
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-20T00:00:00Z',
    updatedAt: '2025-04-20T00:00:00Z',
  },
  {
    id: 'event_a_002',
    organizerSubjectId: 'sub_artist_001',
    isFunwowHosted: false,
    title: '公開トーク：作品と場所の記憶',
    description: '鑑賞者・批評家とのオープントーク。参加無料、事前申込制。',
    startAt: '2025-05-31T15:00:00Z',
    endAt: '2025-05-31T17:00:00Z',
    locationText: 'Funwow Space 代官山',
    eventFormat: 'offline',
    visibility: 'public',
    capacity: 30,
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-18T00:00:00Z',
    updatedAt: '2025-04-18T00:00:00Z',
  },
]

// ============================================================
// Mock: アートスペース Subject
// ============================================================

export const mockSpaceSubject: Subject = {
  id: 'sub_space_001',
  type: 'art_space',
  name: 'Gallery HAKU',
  slug: 'gallery-haku',
  description:
    '東京・神楽坂を拠点に、現代アートと工芸の交差点を探るギャラリー。月2回の展示と年間を通じた会員向けプログラムを運営。',
  coverImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
  iconImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
  communityEnabled: true,
  isPublic: true,
  linkedSpaceId: 'space_gallery_haku',
  createdAt: '2024-03-01T00:00:00Z',
  updatedAt: '2025-02-20T00:00:00Z',
}

export const mockSpacePlans: MembershipPlanDef[] = [
  {
    id: 'plan_space_free',
    subjectId: 'sub_space_001',
    planCode: 'free',
    name: 'フォロワー',
    description: '展示情報・公開イベントの案内を受け取れます。入場は通常料金。',
    priceAmount: 0,
    billingCycle: 'none',
    includesFunwowBaseBenefits: false,
    isActive: true,
  },
  {
    id: 'plan_space_annual',
    subjectId: 'sub_space_001',
    planCode: 'annual',
    name: 'ギャラリー会員（年会員）',
    description:
      '全展示無料入場・会員限定プレビュー・アーティストトーク優先参加。Funwow月1,000ptも付与。',
    priceAmount: 18000,
    billingCycle: 'annual',
    includesFunwowBaseBenefits: true,
    isActive: true,
  },
]

export const mockSpacePosts: Post[] = [
  {
    id: 'post_s_001',
    subjectId: 'sub_space_001',
    title: '次回展示「境界線の詩」開幕のお知らせ',
    body: '5月24日より、3名の作家による「境界線の詩」を開催。内と外、可視と不可視の間を問う展示です。',
    postType: 'announcement',
    visibility: 'public',
    coverImageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80',
    publishedAt: '2025-04-18T10:00:00Z',
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-18T09:00:00Z',
    updatedAt: '2025-04-18T10:00:00Z',
  },
  {
    id: 'post_s_002',
    subjectId: 'sub_space_001',
    title: '【会員限定】内覧会へのご招待',
    body: '5月23日18時より、年会員限定の内覧会を開催します。アーティストとのQ&Aもあります。',
    postType: 'announcement',
    visibility: 'members_only',
    publishedAt: '2025-04-20T10:00:00Z',
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-20T09:00:00Z',
    updatedAt: '2025-04-20T10:00:00Z',
  },
]

export const mockSpaceEvents: Event[] = [
  {
    id: 'event_s_001',
    organizerSubjectId: 'sub_space_001',
    isFunwowHosted: false,
    title: '会員限定プレビュー「境界線の詩」',
    description: '一般公開前日に会員だけで静かに作品と向き合う時間。アーティストによる解説あり。',
    startAt: '2025-05-23T18:00:00Z',
    endAt: '2025-05-23T20:00:00Z',
    locationText: 'Gallery HAKU（神楽坂）',
    eventFormat: 'offline',
    visibility: 'members_only',
    capacity: 15,
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-20T00:00:00Z',
    updatedAt: '2025-04-20T00:00:00Z',
  },
  {
    id: 'event_s_002',
    organizerSubjectId: 'sub_space_001',
    isFunwowHosted: false,
    title: 'オープニングトーク（公開）',
    description: '展示作家3名によるオープニングトーク。入場無料・事前申込不要。',
    startAt: '2025-05-24T16:00:00Z',
    endAt: '2025-05-24T17:30:00Z',
    locationText: 'Gallery HAKU（神楽坂）',
    eventFormat: 'offline',
    visibility: 'public',
    capacity: 40,
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-18T00:00:00Z',
    updatedAt: '2025-04-18T00:00:00Z',
  },
]

// ============================================================
// Mock: アートフェア Subject
// ============================================================

export const mockFairSubject: Subject = {
  id: 'sub_fair_001',
  type: 'art_fair',
  name: 'ARTWAVE TOKYO 2025',
  slug: 'artwave-tokyo-2025',
  description:
    '2025年秋開催予定のアートフェア。国内外50ギャラリーが集結。会員には先行入場・招待枠・会期前後のプログラムを提供。',
  coverImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
  iconImageUrl: 'https://images.unsplash.com/photo-1561069934-eee225952461?w=200&q=80',
  communityEnabled: true,
  isPublic: true,
  createdAt: '2024-06-01T00:00:00Z',
  updatedAt: '2025-04-01T00:00:00Z',
}

export const mockFairPlans: MembershipPlanDef[] = [
  {
    id: 'plan_fair_free',
    subjectId: 'sub_fair_001',
    planCode: 'free',
    name: 'フォロワー',
    description: '出展情報・公開プログラムの案内を受け取れます。',
    priceAmount: 0,
    billingCycle: 'none',
    includesFunwowBaseBenefits: false,
    isActive: true,
  },
  {
    id: 'plan_fair_annual',
    subjectId: 'sub_fair_001',
    planCode: 'annual',
    name: 'フェア会員（年会員）',
    description:
      '先行入場券・VIPオープニング招待・会期中限定プログラム優先参加。Funwow月1,000ptも付与。',
    priceAmount: 15000,
    billingCycle: 'annual',
    includesFunwowBaseBenefits: true,
    isActive: true,
  },
]

export const mockFairPosts: Post[] = [
  {
    id: 'post_f_001',
    subjectId: 'sub_fair_001',
    title: '出展ギャラリー第一弾発表',
    body: '国内外から選ばれた50ギャラリーの中から、今回は15ギャラリーを先行発表。',
    postType: 'announcement',
    visibility: 'public',
    coverImageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80',
    publishedAt: '2025-04-01T10:00:00Z',
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-01T09:00:00Z',
    updatedAt: '2025-04-01T10:00:00Z',
  },
  {
    id: 'post_f_002',
    subjectId: 'sub_fair_001',
    title: '【会員限定】先行入場チケットの取得方法',
    body: '年会員の方向けに先行入場の手順をご案内します。',
    postType: 'announcement',
    visibility: 'members_only',
    publishedAt: '2025-04-15T10:00:00Z',
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-15T09:00:00Z',
    updatedAt: '2025-04-15T10:00:00Z',
  },
]

export const mockFairEvents: Event[] = [
  {
    id: 'event_f_001',
    organizerSubjectId: 'sub_fair_001',
    isFunwowHosted: false,
    title: 'VIPオープニングナイト',
    description: '年会員・招待客限定のオープニングナイト。シャンパンレセプション付き。',
    startAt: '2025-10-09T18:00:00Z',
    endAt: '2025-10-09T21:00:00Z',
    locationText: '東京国際フォーラム',
    eventFormat: 'offline',
    visibility: 'members_only',
    capacity: 200,
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-01T00:00:00Z',
    updatedAt: '2025-04-01T00:00:00Z',
  },
  {
    id: 'event_f_002',
    organizerSubjectId: 'sub_fair_001',
    isFunwowHosted: false,
    title: 'プレビュートーク：今年のアートシーン',
    description: 'キュレーター・コレクター・ギャラリストによるパネルトーク。一般参加可能。',
    startAt: '2025-09-20T14:00:00Z',
    endAt: '2025-09-20T16:00:00Z',
    eventFormat: 'online',
    visibility: 'public',
    capacity: 100,
    status: 'published',
    createdByUserId: 'user_admin',
    createdAt: '2025-04-05T00:00:00Z',
    updatedAt: '2025-04-05T00:00:00Z',
  },
]

// ============================================================
// Mock memberships - ログインユーザーの状態例
// ============================================================

export const mockCurrentUserMemberships: Record<string, CommunityMembership> = {
  // 作家コミュニティのフォロワー
  'sub_artist_001': {
    id: 'mem_artist_001',
    subjectId: 'sub_artist_001',
    userId: 'user_current',
    membershipPlanId: 'plan_artist_free',
    planCode: 'free',
    status: 'active',
    joinedAt: '2026-03-12T00:00:00Z',
    sourceType: 'self_join',
  },
  // アートスペースの年会員
  'sub_space_001': {
    id: 'mem_001',
    subjectId: 'sub_space_001',
    userId: 'user_current',
    membershipPlanId: 'plan_space_annual',
    planCode: 'annual',
    status: 'active',
    joinedAt: '2026-02-01T00:00:00Z',
    expiresAt: '2027-02-01T00:00:00Z',
    sourceType: 'self_join',
  },
}

// ============================================================
// 全Subject一覧
// ============================================================

export const allSubjects: SubjectWithStats[] = [
  {
    ...mockArtistSubject,
    plans: mockArtistPlans,
    memberCount: 142,
    postCount: 28,
    eventCount: 6,
    latestPosts: mockArtistPosts,
    upcomingEvents: mockArtistEvents,
    currentUserMembership: mockCurrentUserMemberships['sub_artist_001'],
  },
  {
    ...mockSpaceSubject,
    plans: mockSpacePlans,
    memberCount: 89,
    postCount: 15,
    eventCount: 4,
    latestPosts: mockSpacePosts,
    upcomingEvents: mockSpaceEvents,
    currentUserMembership: mockCurrentUserMemberships['sub_space_001'],
  },
  {
    ...mockFairSubject,
    plans: mockFairPlans,
    memberCount: 310,
    postCount: 9,
    eventCount: 3,
    latestPosts: mockFairPosts,
    upcomingEvents: mockFairEvents,
    currentUserMembership: undefined,
  },
]

// ============================================================
// ログインユーザーが管理者として持つ SubjectRole（モック）
// ============================================================
export const mockCurrentUserRoles: { subjectSlug: string; roleType: 'owner' | 'admin' | 'staff' }[] = [
  { subjectSlug: 'gallery-haku', roleType: 'owner' },
  { subjectSlug: 'aoi-yamada', roleType: 'owner' },
]

export const mockMonthlyMembershipRevenueBySubjectSlug: Record<string, number> = {
  'gallery-haku': 324000,
}

export function getSubjectBySlug(slug: string): SubjectWithStats | undefined {
  return allSubjects.find((s) => s.slug === slug)
}

export function getManagedSubjects(): SubjectWithStats[] {
  return mockCurrentUserRoles
    .map((r) => allSubjects.find((s) => s.slug === r.subjectSlug))
    .filter(Boolean) as SubjectWithStats[]
}

export function getPostById(subjectSlug: string, postId: string): Post | undefined {
  const subject = getSubjectBySlug(subjectSlug)
  return subject?.latestPosts.find((p) => p.id === postId)
}

export function getEventById(subjectSlug: string, eventId: string): Event | undefined {
  const subject = getSubjectBySlug(subjectSlug)
  return subject?.upcomingEvents.find((e) => e.id === eventId)
}
