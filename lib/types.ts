// ============================================================
// Funwow Phase2 - Type Definitions (MVP)
// ============================================================

export type SubjectType = 'artist' | 'art_space' | 'art_fair'

export type MembershipPlan = 'free' | 'annual'

export type MembershipStatus = 'active' | 'pending' | 'expired' | 'canceled'

export type PostVisibility = 'public' | 'members_only'

export type PostType = 'announcement' | 'report' | 'archive' | 'event_notice' | 'media_link'

export type PostStatus = 'draft' | 'published'

export type EventVisibility = 'public' | 'members_only'

export type EventFormat = 'online' | 'offline' | 'hybrid'

export type EventStatus = 'draft' | 'published' | 'closed'

export type EventEntryStatus = 'applied' | 'approved' | 'waitlisted' | 'canceled' | 'attended'

export type ParticipationType = 'event_participation' | 'visit' | 'pass_redemption'

export type SubjectRoleType = 'owner' | 'admin' | 'staff'

// Subject - 主体の最上位概念
export interface Subject {
  id: string
  type: SubjectType
  name: string
  slug: string
  description: string
  coverImageUrl?: string
  iconImageUrl?: string
  communityEnabled: boolean
  isPublic: boolean
  linkedCreatorId?: string
  linkedSpaceId?: string
  createdAt: string
  updatedAt: string
}

// MembershipPlan - プラン定義
export interface MembershipPlanDef {
  id: string
  subjectId: string
  planCode: MembershipPlan
  name: string
  description: string
  priceAmount: number
  billingCycle: 'none' | 'annual'
  includesFunwowBaseBenefits: boolean
  isActive: boolean
}

// CommunityMembership - ユーザーの参加状態
export interface CommunityMembership {
  id: string
  subjectId: string
  userId: string
  membershipPlanId: string
  planCode: MembershipPlan
  status: MembershipStatus
  joinedAt: string
  expiresAt?: string
  sourceType?: 'self_join' | 'event_entry' | 'admin_added'
}

// Post - 主体による発信
export interface Post {
  id: string
  subjectId: string
  title: string
  body: string
  postType: PostType
  visibility: PostVisibility
  coverImageUrl?: string
  externalUrl?: string
  publishedAt?: string
  status: PostStatus
  createdByUserId: string
  createdAt: string
  updatedAt: string
}

// Event - 主体が主催するイベント
export interface Event {
  id: string
  organizerSubjectId?: string
  isFunwowHosted: boolean
  title: string
  description: string
  startAt: string
  endAt: string
  locationText?: string
  eventFormat: EventFormat
  visibility: EventVisibility
  capacity?: number
  entryUrl?: string
  archiveUrl?: string
  status: EventStatus
  createdByUserId: string
  createdAt: string
  updatedAt: string
}

// EventEntry - イベント参加申込
export interface EventEntry {
  id: string
  eventId: string
  userId: string
  status: EventEntryStatus
  appliedAt: string
  attendedAt?: string
}

// MemberPass - デジタル会員証
export interface MemberPass {
  id: string
  communityMembershipId: string
  subjectId: string
  passStatus: 'active' | 'inactive' | 'expired'
  qrToken?: string
  issuedAt: string
  expiresAt?: string
}

// Participation - 参加・来場の記録
export interface Participation {
  id: string
  subjectId: string
  userId: string
  participationType: ParticipationType
  eventId?: string
  exhibitionId?: string
  spaceId?: string
  memberPassId?: string
  occurredAt: string
  sourceType?: 'user_action' | 'admin_recorded'
  note?: string
}

// SubjectRole - 主体の運営権限
export interface SubjectRole {
  id: string
  subjectId: string
  userId: string
  roleType: SubjectRoleType
  createdAt: string
}

// SubjectExhibitionLink - 主体と展示の紐づけ
export interface SubjectExhibitionLink {
  id: string
  subjectId: string
  exhibitionId: string
  relationType: 'creator_related' | 'venue_related' | 'fair_related' | 'presented_by'
  createdAt: string
}

// ============================================================
// UI用の拡張型（モック表示用）
// ============================================================

export interface SubjectWithStats extends Subject {
  plans: MembershipPlanDef[]
  memberCount: number
  postCount: number
  eventCount: number
  latestPosts: Post[]
  upcomingEvents: Event[]
  currentUserMembership?: CommunityMembership
}
