// ============================================================
// Funwow Phase1 - Mock Data
// ============================================================

export interface Exhibition {
  id: string
  title: string
  spaceId: string
  spaceName: string
  startDate: string
  endDate: string
  description: string
  coverImageUrl?: string
  admissionFee: number | null
  creatorIds: string[]
  relatedSubjectSlugs: string[]
  tags: string[]
}

export interface Space {
  id: string
  name: string
  slug: string
  address: string
  description: string
  coverImageUrl?: string
  iconImageUrl?: string
  isPartner: boolean
  relatedSubjectSlug?: string
}

export interface Creator {
  id: string
  name: string
  slug: string
  bio: string
  coverImageUrl?: string
  iconImageUrl?: string
  relatedSubjectSlug?: string
}

export interface FunwowEvent {
  id: string
  title: string
  description: string
  startAt: string
  endAt: string
  format: 'online' | 'offline' | 'hybrid'
  locationText?: string
  isMemberOnly: boolean
  coverImageUrl?: string
  capacity?: number
}

export interface Impression {
  id: string
  exhibitionId: string
  userId: string
  userName: string
  body: string
  createdAt: string
}

export interface ViewingHistoryItem {
  id: string
  userId: string
  exhibitionId: string
  viewedAt: string
}

// ============================================================
// Exhibitions
// ============================================================

export const mockExhibitions: Exhibition[] = [
  {
    id: 'ex_001',
    title: '余白の記録',
    spaceId: 'sp_001',
    spaceName: 'Gallery HAKU',
    startDate: '2025-03-01',
    endDate: '2025-03-30',
    description:
      '写真家・山田蒼の個展。記憶と場所の関係をテーマに、光と影で構成された新作シリーズを展示。空白そのものが語りかける、静謐な空間体験。',
    coverImageUrl: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=1200&q=80',
    admissionFee: 800,
    creatorIds: ['cr_001'],
    relatedSubjectSlugs: ['aoi-yamada', 'gallery-haku'],
    tags: ['写真', '個展', '現代アート'],
  },
  {
    id: 'ex_002',
    title: '境界線の詩',
    spaceId: 'sp_001',
    spaceName: 'Gallery HAKU',
    startDate: '2025-05-24',
    endDate: '2025-06-20',
    description:
      '内と外、可視と不可視の境界をテーマにした3人展。絵画・立体・映像が交差するグループ展。',
    coverImageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&q=80',
    admissionFee: 0,
    creatorIds: ['cr_002', 'cr_003'],
    relatedSubjectSlugs: ['gallery-haku'],
    tags: ['グループ展', '絵画', '立体', '映像'],
  },
  {
    id: 'ex_003',
    title: '土と光のあいだ',
    spaceId: 'sp_002',
    spaceName: 'VOID Tokyo',
    startDate: '2025-04-05',
    endDate: '2025-04-27',
    description:
      '陶芸家・中村拓の初の大規模個展。土という素材を通じて、素材と時間の関係を探る。',
    coverImageUrl: 'https://images.unsplash.com/photo-1482029255085-35a4a48b7084?w=1200&q=80',
    admissionFee: 1000,
    creatorIds: ['cr_004'],
    relatedSubjectSlugs: [],
    tags: ['陶芸', '工芸', '個展'],
  },
  {
    id: 'ex_004',
    title: 'After the Garden',
    spaceId: 'sp_003',
    spaceName: 'Nanzuka Underground',
    startDate: '2025-05-10',
    endDate: '2025-06-08',
    description:
      '植物・自然・廃墟をテーマにした国際グループ展。アジア・ヨーロッパの5作家による混合メディア作品。',
    coverImageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1200&q=80',
    admissionFee: 0,
    creatorIds: ['cr_002', 'cr_005'],
    relatedSubjectSlugs: [],
    tags: ['国際展', 'ミクストメディア', '植物'],
  },
  {
    id: 'ex_005',
    title: '光の建築 —— ガラスと影',
    spaceId: 'sp_002',
    spaceName: 'VOID Tokyo',
    startDate: '2025-06-15',
    endDate: '2025-07-13',
    description:
      '建築家とガラス作家がコラボレーションした空間インスタレーション。光の通り道を設計する展覧会。',
    coverImageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80',
    admissionFee: 1200,
    creatorIds: ['cr_003'],
    relatedSubjectSlugs: [],
    tags: ['インスタレーション', 'ガラス', '建築'],
  },
]

// ============================================================
// Spaces
// ============================================================

export const mockSpaces: Space[] = [
  {
    id: 'sp_001',
    name: 'Gallery HAKU',
    slug: 'gallery-haku',
    address: '東京都新宿区神楽坂3-2-1',
    description:
      '2018年創業。現代アートと工芸の交差点を探るギャラリー。月2回程度の展示を開催し、会員プログラムを通じた継続的な関係性を大切にしています。',
    coverImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
    isPartner: true,
    relatedSubjectSlug: 'gallery-haku',
  },
  {
    id: 'sp_002',
    name: 'VOID Tokyo',
    slug: 'void-tokyo',
    address: '東京都渋谷区神南1-12-3',
    description:
      '渋谷公園通りに位置するコンテンポラリーアートスペース。実験的な作品・パフォーマンス・コラボレーションを中心に紹介。',
    coverImageUrl: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=200&q=80',
    isPartner: false,
    relatedSubjectSlug: undefined,
  },
  {
    id: 'sp_003',
    name: 'Nanzuka Underground',
    slug: 'nanzuka-underground',
    address: '東京都渋谷区神宮前3-30-10',
    description:
      '国際的な現代アーティストの作品を紹介するギャラリー。ポップカルチャーとファインアートの境界を探る展示で知られる。',
    coverImageUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1be?w=200&q=80',
    isPartner: false,
  },
]

// ============================================================
// Creators
// ============================================================

export const mockCreators: Creator[] = [
  {
    id: 'cr_001',
    name: '山田 蒼',
    slug: 'aoi-yamada',
    bio: '写真と言語を横断しながら、記憶と場所の関係を探求する作家。国内外での個展多数。',
    coverImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    relatedSubjectSlug: 'aoi-yamada',
  },
  {
    id: 'cr_002',
    name: '木村 凛',
    slug: 'rin-kimura',
    bio: '油絵と映像を使った作品を制作。国境・記憶・身体をテーマに国際的に活動。',
    coverImageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    relatedSubjectSlug: undefined,
  },
  {
    id: 'cr_003',
    name: '松本 海',
    slug: 'kai-matsumoto',
    bio: 'ガラスと光を素材にしたインスタレーション作品で知られる彫刻家。建築との協働多数。',
    coverImageUrl: 'https://images.unsplash.com/photo-1513031300226-c8fb12de9ade?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    relatedSubjectSlug: undefined,
  },
  {
    id: 'cr_004',
    name: '中村 拓',
    slug: 'taku-nakamura',
    bio: '土・釉薬・窯変を探求する陶芸家。伝統技法と現代的な感覚を融合させた作品を制作。',
    coverImageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    relatedSubjectSlug: undefined,
  },
  {
    id: 'cr_005',
    name: 'Lena Park',
    slug: 'lena-park',
    bio: 'ソウル・東京を拠点に活動するマルチメディアアーティスト。自然・デジタル・身体の交差を探る。',
    coverImageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&q=80',
    iconImageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=80',
    relatedSubjectSlug: undefined,
  },
]

// ============================================================
// Funwow Events (Funwow主催)
// ============================================================

export const mockFunwowEvents: FunwowEvent[] = [
  {
    id: 'fev_001',
    title: 'ギャラリー巡りツアー：神楽坂編',
    description:
      'funwowスタッフが案内する神楽坂エリアのギャラリー巡りツアー。3スペースを約2時間で巡ります。',
    startAt: '2025-05-18T13:00:00Z',
    endAt: '2025-05-18T15:00:00Z',
    format: 'offline',
    locationText: '神楽坂エリア（集合場所は参加者に別途連絡）',
    isMemberOnly: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    capacity: 12,
  },
  {
    id: 'fev_002',
    title: 'キュレーターとの対話：現代アートの見方',
    description:
      '現代アートを「読む」ための視点と方法をキュレーターが解説するオンライントーク。質疑応答あり。',
    startAt: '2025-05-25T14:00:00Z',
    endAt: '2025-05-25T16:00:00Z',
    format: 'online',
    isMemberOnly: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=800&q=80',
    capacity: 50,
  },
  {
    id: 'fev_003',
    title: '写真家・山田蒼 × Funwow トーク',
    description:
      '作家・山田蒼を迎えた特別トーク。制作プロセスと、場所と記憶の関係性について。',
    startAt: '2025-06-07T15:00:00Z',
    endAt: '2025-06-07T17:00:00Z',
    format: 'hybrid',
    locationText: 'Funwow Space 代官山 ＋ オンライン配信',
    isMemberOnly: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    capacity: 30,
  },
]

// ============================================================
// Impressions (感想)
// ============================================================

export const mockImpressions: Impression[] = [
  {
    id: 'imp_001',
    exhibitionId: 'ex_001',
    userId: 'user_a',
    userName: 'ゆきな',
    body: '光の使い方が本当に独特で、写真なのに絵画みたいな深みがあった。静かに長居したくなる展示。',
    createdAt: '2025-03-15T10:00:00Z',
  },
  {
    id: 'imp_002',
    exhibitionId: 'ex_001',
    userId: 'user_b',
    userName: 'しんじ',
    body: '「余白」というテーマがそのまま空間になってた。余分なものが全部取り除かれた感じ。',
    createdAt: '2025-03-10T14:00:00Z',
  },
  {
    id: 'imp_003',
    exhibitionId: 'ex_003',
    userId: 'user_c',
    userName: 'はるか',
    body: '土の質感と光の組み合わせが美しかった。陶芸の展示でこんなに空間を感じたのは初めて。',
    createdAt: '2025-04-12T11:30:00Z',
  },
]

// ============================================================
// User mock (ログイン中ユーザー)
// ============================================================

export const mockCurrentUser = {
  id: 'user_current',
  name: '田中 花子',
  email: 'hanako@example.com',
  planType: 'paid' as 'free' | 'paid',
  pointBalance: 2400,
  joinedAt: '2024-11-01',
  stampCount: 8,
  savedExhibitionIds: ['ex_001', 'ex_004'],
  savedCreatorIds: ['cr_001'],
}

export const mockViewingHistory: ViewingHistoryItem[] = [
  { id: 'vh_001', userId: 'user_current', exhibitionId: 'ex_001', viewedAt: '2026-04-19T14:20:00Z' },
  { id: 'vh_002', userId: 'user_current', exhibitionId: 'ex_003', viewedAt: '2026-04-12T11:30:00Z' },
  { id: 'vh_003', userId: 'user_current', exhibitionId: 'ex_004', viewedAt: '2026-03-22T16:10:00Z' },
  { id: 'vh_004', userId: 'user_current', exhibitionId: 'ex_002', viewedAt: '2026-03-15T13:05:00Z' },
]

// ============================================================
// Helpers
// ============================================================

export function getExhibitionById(id: string): Exhibition | undefined {
  return mockExhibitions.find((e) => e.id === id)
}

export function getSpaceBySlug(slug: string): Space | undefined {
  return mockSpaces.find((s) => s.slug === slug)
}

export function getCreatorBySlug(slug: string): Creator | undefined {
  return mockCreators.find((c) => c.slug === slug)
}

export function getEventById(id: string): FunwowEvent | undefined {
  return mockFunwowEvents.find((e) => e.id === id)
}

export function getExhibitionsBySpaceId(spaceId: string): Exhibition[] {
  return mockExhibitions.filter((e) => e.spaceId === spaceId)
}

export function getExhibitionsByCreatorId(creatorId: string): Exhibition[] {
  return mockExhibitions.filter((e) => e.creatorIds.includes(creatorId))
}

export function getImpressionsForExhibition(exhibitionId: string): Impression[] {
  return mockImpressions.filter((i) => i.exhibitionId === exhibitionId)
}

export function getViewingHistoryByUserId(userId: string): ViewingHistoryItem[] {
  return mockViewingHistory
    .filter((h) => h.userId === userId)
    .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
}
