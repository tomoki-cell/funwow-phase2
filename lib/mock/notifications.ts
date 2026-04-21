export interface Notification {
  id: string
  subjectSlug: string
  subjectName: string
  subjectIconUrl: string
  subject: string
  body: string
  sentAt: string
  isRead: boolean
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    subjectSlug: 'gallery-haku',
    subjectName: 'Gallery HAKU',
    subjectIconUrl: 'https://images.unsplash.com/photo-1578926288207-32356a8b04c4?w=80&h=80&fit=crop',
    subject: '【Gallery HAKU】5月展示「境界線の詩」のご案内',
    body: 'いつもGallery HAKUをご支援いただきありがとうございます。5月24日より「境界線の詩」を開催いたします。ぜひご来場ください。',
    sentAt: '2026-04-20T10:00:00Z',
    isRead: false,
  },
  {
    id: 'notif_002',
    subjectSlug: 'gallery-haku',
    subjectName: 'Gallery HAKU',
    subjectIconUrl: 'https://images.unsplash.com/photo-1578926288207-32356a8b04c4?w=80&h=80&fit=crop',
    subject: '【会員限定】5月23日プレビューへのご招待',
    body: '年会員の皆様へ。一般公開前日5月23日18時より、会員限定プレビューを開催します。アーティストとのQ&Aもございます。',
    sentAt: '2026-04-15T14:00:00Z',
    isRead: false,
  },
  {
    id: 'notif_003',
    subjectSlug: 'gallery-haku',
    subjectName: 'Gallery HAKU',
    subjectIconUrl: 'https://images.unsplash.com/photo-1578926288207-32356a8b04c4?w=80&h=80&fit=crop',
    subject: '新メンバーへようこそ！Gallery HAKUコミュニティのご案内',
    body: 'コミュニティへのご参加ありがとうございます。当ギャラリーのコミュニティでは、展示のお知らせや会員限定イベントをお届けします。',
    sentAt: '2026-03-28T09:00:00Z',
    isRead: true,
  },
]
