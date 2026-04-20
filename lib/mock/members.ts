// ============================================================
// Mock: 30名の会員データ＋約100件の参加・来訪履歴
// ============================================================

export type MemberPlan = 'annual' | 'free'

export interface MockMember {
  id: string
  name: string
  email: string
  plan: MemberPlan
  joinedAt: string
  status: 'active' | 'expired'
  memo: string
}

export interface MockParticipationRecord {
  id: string
  userId: string
  type: 'event' | 'visit' | 'pass'
  label: string
  detail: string
  place: string
  occurredAt: string
}

// ============================================================
// 30名の会員
// ============================================================
export const mockMembers: MockMember[] = [
  // ヘビーユーザー（年会員・常連）
  { id: 'u01', name: '佐藤 みき', email: 'sato.miki@example.com', plan: 'annual', joinedAt: '2024-04-01', status: 'active', memo: 'VIPゲスト。毎回招待済み。' },
  { id: 'u02', name: '田中 花子', email: 'tanaka.h@example.com', plan: 'annual', joinedAt: '2024-05-15', status: 'active', memo: '' },
  { id: 'u03', name: '渡辺 美咲', email: 'watanabe.m@example.com', plan: 'annual', joinedAt: '2024-06-10', status: 'active', memo: 'ブロガー。SNS発信してくれる' },
  { id: 'u04', name: '高橋 さくら', email: 'takahashi.s@example.com', plan: 'annual', joinedAt: '2024-07-20', status: 'active', memo: '' },
  { id: 'u05', name: '小林 陽子', email: 'kobayashi.y@example.com', plan: 'annual', joinedAt: '2024-08-01', status: 'active', memo: 'アート収集家' },

  // アクティブユーザー（年会員）
  { id: 'u06', name: '加藤 健太', email: 'kato.k@example.com', plan: 'annual', joinedAt: '2024-09-10', status: 'active', memo: '' },
  { id: 'u07', name: '伊藤 直樹', email: 'ito.n@example.com', plan: 'annual', joinedAt: '2024-10-05', status: 'active', memo: '' },
  { id: 'u08', name: '山口 恵美', email: 'yamaguchi.e@example.com', plan: 'annual', joinedAt: '2024-11-20', status: 'active', memo: '' },
  { id: 'u09', name: '松本 拓海', email: 'matsumoto.t@example.com', plan: 'annual', joinedAt: '2024-12-01', status: 'active', memo: '' },
  { id: 'u10', name: '井上 奈緒', email: 'inoue.n@example.com', plan: 'annual', joinedAt: '2025-01-15', status: 'active', memo: '' },
  { id: 'u11', name: '木村 大輝', email: 'kimura.d@example.com', plan: 'annual', joinedAt: '2025-01-28', status: 'active', memo: '' },
  { id: 'u12', name: '林 真由', email: 'hayashi.m@example.com', plan: 'annual', joinedAt: '2025-02-10', status: 'active', memo: '' },

  // ミドルユーザー（フォロワー含む）
  { id: 'u13', name: '清水 俊介', email: 'shimizu.s@example.com', plan: 'free', joinedAt: '2024-08-20', status: 'active', memo: '' },
  { id: 'u14', name: '中村 あかり', email: 'nakamura.a@example.com', plan: 'free', joinedAt: '2024-09-30', status: 'active', memo: '' },
  { id: 'u15', name: '岡田 雄介', email: 'okada.y@example.com', plan: 'free', joinedAt: '2024-10-15', status: 'active', memo: '' },
  { id: 'u16', name: '藤原 里奈', email: 'fujiwara.r@example.com', plan: 'annual', joinedAt: '2025-02-20', status: 'active', memo: '' },
  { id: 'u17', name: '西村 幸太', email: 'nishimura.k@example.com', plan: 'free', joinedAt: '2025-03-01', status: 'active', memo: '' },
  { id: 'u18', name: '山田 千春', email: 'yamada.c@example.com', plan: 'free', joinedAt: '2025-03-10', status: 'active', memo: '' },
  { id: 'u19', name: '橋本 涼', email: 'hashimoto.r@example.com', plan: 'annual', joinedAt: '2025-03-15', status: 'active', memo: '' },
  { id: 'u20', name: '石田 麻衣', email: 'ishida.m@example.com', plan: 'free', joinedAt: '2025-03-20', status: 'active', memo: '' },

  // ロウエンゲージメント（来ていない or 1回だけ）
  { id: 'u21', name: '鈴木 一郎', email: 'suzuki.i@example.com', plan: 'free', joinedAt: '2025-01-10', status: 'active', memo: '' },
  { id: 'u22', name: '村上 愛', email: 'murakami.a@example.com', plan: 'free', joinedAt: '2025-02-05', status: 'active', memo: '' },
  { id: 'u23', name: '福田 翔太', email: 'fukuda.s@example.com', plan: 'free', joinedAt: '2025-02-28', status: 'active', memo: '' },
  { id: 'u24', name: '坂本 ゆい', email: 'sakamoto.y@example.com', plan: 'annual', joinedAt: '2025-03-05', status: 'active', memo: '' },
  { id: 'u25', name: '中島 浩二', email: 'nakajima.k@example.com', plan: 'free', joinedAt: '2025-04-01', status: 'active', memo: '' },

  // 新規（最近参加）
  { id: 'u26', name: '原田 恵', email: 'harada.m@example.com', plan: 'annual', joinedAt: '2025-04-05', status: 'active', memo: '' },
  { id: 'u27', name: '大野 響', email: 'ohno.h@example.com', plan: 'free', joinedAt: '2025-04-08', status: 'active', memo: '' },
  { id: 'u28', name: '野村 彩香', email: 'nomura.a@example.com', plan: 'annual', joinedAt: '2025-04-12', status: 'active', memo: '' },
  { id: 'u29', name: '長谷川 修', email: 'hasegawa.o@example.com', plan: 'free', joinedAt: '2025-04-15', status: 'active', memo: '' },
  { id: 'u30', name: '太田 美穂', email: 'ohta.m@example.com', plan: 'annual', joinedAt: '2025-04-18', status: 'active', memo: '' },
]

// ============================================================
// 約100件の参加・来訪履歴
// ============================================================
export const mockParticipations: MockParticipationRecord[] = [
  // ---- u01 佐藤みき（ヘビー：10件） ----
  { id: 'p001', userId: 'u01', type: 'event', label: 'イベント参加', detail: '会員限定プレビュー「境界線の詩」', place: 'Gallery HAKU', occurredAt: '2025-05-23T18:00:00Z' },
  { id: 'p002', userId: 'u01', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-25T14:00:00Z' },
  { id: 'p003', userId: 'u01', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p004', userId: 'u01', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-02-10T13:00:00Z' },
  { id: 'p005', userId: 'u01', type: 'event', label: 'イベント参加', detail: '前回展示「静寂の間」内覧会', place: 'Gallery HAKU', occurredAt: '2025-01-18T18:00:00Z' },
  { id: 'p006', userId: 'u01', type: 'visit', label: 'チェックイン', detail: '「静寂の間」再鑑賞', place: 'Gallery HAKU', occurredAt: '2025-01-25T15:30:00Z' },
  { id: 'p007', userId: 'u01', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'SCAI THE BATHHOUSE', occurredAt: '2025-01-28T14:00:00Z' },
  { id: 'p008', userId: 'u01', type: 'event', label: 'イベント参加', detail: '2024年秋展示トーク', place: 'Gallery HAKU', occurredAt: '2024-10-25T15:00:00Z' },
  { id: 'p009', userId: 'u01', type: 'visit', label: 'チェックイン', detail: '秋展示鑑賞', place: 'Gallery HAKU', occurredAt: '2024-10-30T13:00:00Z' },
  { id: 'p010', userId: 'u01', type: 'pass', label: '会員証提示', detail: '特典利用', place: 'Gallery HAKU', occurredAt: '2024-11-05T16:00:00Z' },

  // ---- u02 田中花子（ヘビー：9件） ----
  { id: 'p011', userId: 'u02', type: 'event', label: 'イベント参加', detail: '会員限定プレビュー「境界線の詩」', place: 'Gallery HAKU', occurredAt: '2025-05-23T18:00:00Z' },
  { id: 'p012', userId: 'u02', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-26T15:00:00Z' },
  { id: 'p013', userId: 'u02', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p014', userId: 'u02', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-01-20T14:00:00Z' },
  { id: 'p015', userId: 'u02', type: 'event', label: 'イベント参加', detail: '前回展示「静寂の間」内覧会', place: 'Gallery HAKU', occurredAt: '2025-01-18T18:00:00Z' },
  { id: 'p016', userId: 'u02', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Void Tokyo', occurredAt: '2025-02-15T13:00:00Z' },
  { id: 'p017', userId: 'u02', type: 'event', label: 'イベント参加', detail: '2024年秋展示トーク', place: 'Gallery HAKU', occurredAt: '2024-10-25T15:00:00Z' },
  { id: 'p018', userId: 'u02', type: 'visit', label: 'チェックイン', detail: '秋展示鑑賞', place: 'Gallery HAKU', occurredAt: '2024-11-02T14:00:00Z' },
  { id: 'p019', userId: 'u02', type: 'pass', label: '会員証提示', detail: '特典利用', place: 'Gallery HAKU', occurredAt: '2024-12-10T15:00:00Z' },

  // ---- u03 渡辺美咲（ヘビー：8件） ----
  { id: 'p020', userId: 'u03', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },
  { id: 'p021', userId: 'u03', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-27T14:30:00Z' },
  { id: 'p022', userId: 'u03', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'NADiff a/p/a/r/t', occurredAt: '2025-04-20T15:00:00Z' },
  { id: 'p023', userId: 'u03', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p024', userId: 'u03', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-01-22T13:00:00Z' },
  { id: 'p025', userId: 'u03', type: 'event', label: 'イベント参加', detail: '2024年秋展示トーク', place: 'Gallery HAKU', occurredAt: '2024-10-25T15:00:00Z' },
  { id: 'p026', userId: 'u03', type: 'visit', label: 'チェックイン', detail: '秋展示鑑賞', place: 'Gallery HAKU', occurredAt: '2024-11-08T14:00:00Z' },
  { id: 'p027', userId: 'u03', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'The National Art Center', occurredAt: '2024-12-05T11:00:00Z' },

  // ---- u04 高橋さくら（ヘビー：7件） ----
  { id: 'p028', userId: 'u04', type: 'event', label: 'イベント参加', detail: '会員限定プレビュー「境界線の詩」', place: 'Gallery HAKU', occurredAt: '2025-05-23T18:00:00Z' },
  { id: 'p029', userId: 'u04', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p030', userId: 'u04', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-01-28T14:00:00Z' },
  { id: 'p031', userId: 'u04', type: 'event', label: 'イベント参加', detail: '前回展示「静寂の間」内覧会', place: 'Gallery HAKU', occurredAt: '2025-01-18T18:00:00Z' },
  { id: 'p032', userId: 'u04', type: 'event', label: 'イベント参加', detail: '2024年秋展示トーク', place: 'Gallery HAKU', occurredAt: '2024-10-25T15:00:00Z' },
  { id: 'p033', userId: 'u04', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Spiral Garden', occurredAt: '2024-11-20T14:00:00Z' },
  { id: 'p034', userId: 'u04', type: 'pass', label: '会員証提示', detail: '特典利用', place: 'Gallery HAKU', occurredAt: '2025-02-08T16:00:00Z' },

  // ---- u05 小林陽子（ヘビー：8件） ----
  { id: 'p035', userId: 'u05', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },
  { id: 'p036', userId: 'u05', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-06-01T14:00:00Z' },
  { id: 'p037', userId: 'u05', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p038', userId: 'u05', type: 'event', label: 'イベント参加', detail: '前回展示「静寂の間」内覧会', place: 'Gallery HAKU', occurredAt: '2025-01-18T18:00:00Z' },
  { id: 'p039', userId: 'u05', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-01-30T13:00:00Z' },
  { id: 'p040', userId: 'u05', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Taka Ishii Gallery', occurredAt: '2025-02-20T15:00:00Z' },
  { id: 'p041', userId: 'u05', type: 'event', label: 'イベント参加', detail: '2024年秋展示トーク', place: 'Gallery HAKU', occurredAt: '2024-10-25T15:00:00Z' },
  { id: 'p042', userId: 'u05', type: 'visit', label: 'チェックイン', detail: '秋展示鑑賞', place: 'Gallery HAKU', occurredAt: '2024-11-15T14:00:00Z' },

  // ---- u06 加藤健太（アクティブ：5件） ----
  { id: 'p043', userId: 'u06', type: 'event', label: 'イベント参加', detail: '会員限定プレビュー「境界線の詩」', place: 'Gallery HAKU', occurredAt: '2025-05-23T18:00:00Z' },
  { id: 'p044', userId: 'u06', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p045', userId: 'u06', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-01-25T14:00:00Z' },
  { id: 'p046', userId: 'u06', type: 'event', label: 'イベント参加', detail: '2024年秋展示トーク', place: 'Gallery HAKU', occurredAt: '2024-10-25T15:00:00Z' },
  { id: 'p047', userId: 'u06', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Void Tokyo', occurredAt: '2025-04-10T15:00:00Z' },

  // ---- u07 伊藤直樹（アクティブ：5件） ----
  { id: 'p048', userId: 'u07', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-28T14:00:00Z' },
  { id: 'p049', userId: 'u07', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p050', userId: 'u07', type: 'event', label: 'イベント参加', detail: '前回展示「静寂の間」内覧会', place: 'Gallery HAKU', occurredAt: '2025-01-18T18:00:00Z' },
  { id: 'p051', userId: 'u07', type: 'event', label: 'イベント参加', detail: '2024年秋展示トーク', place: 'Gallery HAKU', occurredAt: '2024-10-25T15:00:00Z' },
  { id: 'p052', userId: 'u07', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'NADiff a/p/a/r/t', occurredAt: '2025-02-22T13:00:00Z' },

  // ---- u08 山口恵美（アクティブ：4件） ----
  { id: 'p053', userId: 'u08', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },
  { id: 'p054', userId: 'u08', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p055', userId: 'u08', type: 'event', label: 'イベント参加', detail: '前回展示「静寂の間」内覧会', place: 'Gallery HAKU', occurredAt: '2025-01-18T18:00:00Z' },
  { id: 'p056', userId: 'u08', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'SCAI THE BATHHOUSE', occurredAt: '2025-04-05T15:00:00Z' },

  // ---- u09 松本拓海（アクティブ：4件） ----
  { id: 'p057', userId: 'u09', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-30T14:00:00Z' },
  { id: 'p058', userId: 'u09', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p059', userId: 'u09', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-02-05T13:00:00Z' },
  { id: 'p060', userId: 'u09', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Taka Ishii Gallery', occurredAt: '2025-04-18T15:00:00Z' },

  // ---- u10 井上奈緒（アクティブ：4件） ----
  { id: 'p061', userId: 'u10', type: 'event', label: 'イベント参加', detail: '会員限定プレビュー「境界線の詩」', place: 'Gallery HAKU', occurredAt: '2025-05-23T18:00:00Z' },
  { id: 'p062', userId: 'u10', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p063', userId: 'u10', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-02-12T14:00:00Z' },
  { id: 'p064', userId: 'u10', type: 'pass', label: '会員証提示', detail: '特典利用', place: 'Gallery HAKU', occurredAt: '2025-03-01T16:00:00Z' },

  // ---- u11 木村大輝（アクティブ：3件） ----
  { id: 'p065', userId: 'u11', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-25T13:00:00Z' },
  { id: 'p066', userId: 'u11', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p067', userId: 'u11', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Void Tokyo', occurredAt: '2025-04-22T14:00:00Z' },

  // ---- u12 林真由（アクティブ：3件） ----
  { id: 'p068', userId: 'u12', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },
  { id: 'p069', userId: 'u12', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p070', userId: 'u12', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'NADiff a/p/a/r/t', occurredAt: '2025-04-28T15:00:00Z' },

  // ---- u13 清水俊介（ミドル：3件） ----
  { id: 'p071', userId: 'u13', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-29T14:00:00Z' },
  { id: 'p072', userId: 'u13', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },
  { id: 'p073', userId: 'u13', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'SCAI THE BATHHOUSE', occurredAt: '2025-01-30T15:00:00Z' },

  // ---- u14 中村あかり（ミドル：2件） ----
  { id: 'p074', userId: 'u14', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-26T14:00:00Z' },
  { id: 'p075', userId: 'u14', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-01-30T13:00:00Z' },

  // ---- u15 岡田雄介（ミドル：2件） ----
  { id: 'p076', userId: 'u15', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },
  { id: 'p077', userId: 'u15', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'The National Art Center', occurredAt: '2025-02-18T11:00:00Z' },

  // ---- u16 藤原里奈（ミドル：2件） ----
  { id: 'p078', userId: 'u16', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-28T15:00:00Z' },
  { id: 'p079', userId: 'u16', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },

  // ---- u17 西村幸太（ミドル：2件） ----
  { id: 'p080', userId: 'u17', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-31T14:00:00Z' },
  { id: 'p081', userId: 'u17', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Spiral Garden', occurredAt: '2025-04-15T14:00:00Z' },

  // ---- u18 山田千春（ミドル：2件） ----
  { id: 'p082', userId: 'u18', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },
  { id: 'p083', userId: 'u18', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Void Tokyo', occurredAt: '2025-03-20T14:00:00Z' },

  // ---- u19 橋本涼（ミドル：2件） ----
  { id: 'p084', userId: 'u19', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-30T14:00:00Z' },
  { id: 'p085', userId: 'u19', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Taka Ishii Gallery', occurredAt: '2025-04-05T15:00:00Z' },

  // ---- u20 石田麻衣（ミドル：1件） ----
  { id: 'p086', userId: 'u20', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-31T13:00:00Z' },

  // ---- u21 鈴木一郎（低：1件） ----
  { id: 'p087', userId: 'u21', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },

  // ---- u22 村上愛（低：1件） ----
  { id: 'p088', userId: 'u22', type: 'visit', label: 'チェックイン', detail: '「静寂の間」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-02-28T14:00:00Z' },

  // ---- u23 福田翔太（低：1件） ----
  { id: 'p089', userId: 'u23', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'SCAI THE BATHHOUSE', occurredAt: '2025-03-10T15:00:00Z' },

  // ---- u24 坂本ゆい（低：1件） ----
  { id: 'p090', userId: 'u24', type: 'event', label: 'イベント参加', detail: '春の会員向けトーク', place: 'Gallery HAKU', occurredAt: '2025-03-15T15:00:00Z' },

  // ---- u25〜u30 新規・未来訪（0件 or 1件） ----
  { id: 'p091', userId: 'u26', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-25T15:00:00Z' },
  { id: 'p092', userId: 'u28', type: 'event', label: 'イベント参加', detail: 'オープニングトーク（公開）', place: 'Gallery HAKU', occurredAt: '2025-05-24T16:00:00Z' },
  { id: 'p093', userId: 'u30', type: 'visit', label: 'チェックイン', detail: '「境界線の詩」鑑賞', place: 'Gallery HAKU', occurredAt: '2025-05-26T14:00:00Z' },

  // ---- 追加：各ユーザーの他ギャラリー訪問 ----
  { id: 'p094', userId: 'u06', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Spiral Garden', occurredAt: '2025-04-28T14:00:00Z' },
  { id: 'p095', userId: 'u07', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Taka Ishii Gallery', occurredAt: '2025-05-10T15:00:00Z' },
  { id: 'p096', userId: 'u10', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'SCAI THE BATHHOUSE', occurredAt: '2025-04-08T14:00:00Z' },
  { id: 'p097', userId: 'u11', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'NADiff a/p/a/r/t', occurredAt: '2025-05-15T13:00:00Z' },
  { id: 'p098', userId: 'u12', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'The National Art Center', occurredAt: '2025-03-25T11:00:00Z' },
  { id: 'p099', userId: 'u13', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Void Tokyo', occurredAt: '2025-04-30T15:00:00Z' },
  { id: 'p100', userId: 'u04', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'The National Art Center', occurredAt: '2025-05-18T11:00:00Z' },
  { id: 'p101', userId: 'u05', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'SCAI THE BATHHOUSE', occurredAt: '2025-04-12T15:00:00Z' },
  { id: 'p102', userId: 'u02', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Spiral Garden', occurredAt: '2025-05-05T14:00:00Z' },
  { id: 'p103', userId: 'u01', type: 'visit', label: 'チェックイン', detail: '他ギャラリー訪問', place: 'Taka Ishii Gallery', occurredAt: '2025-04-08T15:00:00Z' },
]

// ============================================================
// ヘルパー関数
// ============================================================

/** 会員ごとの参加履歴を取得 */
export function getParticipationsByUserId(userId: string): MockParticipationRecord[] {
  return mockParticipations
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
}

/** 会員ごとの統計 */
export function getMemberStats(userId: string) {
  const records = getParticipationsByUserId(userId)
  const hakuRecords = records.filter((r) => r.place === 'Gallery HAKU')
  const otherRecords = records.filter((r) => r.place !== 'Gallery HAKU')
  const lastVisit = records.length > 0 ? records[0].occurredAt : null

  // 最終来訪からの日数
  const daysSinceLastVisit = lastVisit
    ? Math.floor((Date.now() - new Date(lastVisit).getTime()) / (1000 * 60 * 60 * 24))
    : null

  // エンゲージメントレベル
  let engagement: 'high' | 'medium' | 'low' | 'none'
  if (hakuRecords.length >= 5) engagement = 'high'
  else if (hakuRecords.length >= 3) engagement = 'medium'
  else if (hakuRecords.length >= 1) engagement = 'low'
  else engagement = 'none'

  return {
    totalCount: records.length,
    hakuCount: hakuRecords.length,
    otherCount: otherRecords.length,
    lastVisit,
    daysSinceLastVisit,
    engagement,
  }
}
