import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, FileText, Calendar, History, Building2, ChevronLeft, Mail, CreditCard, Gift } from 'lucide-react'
import { getSubjectBySlug, mockCurrentUserRoles } from '@/lib/mock/subjects'
import SubjectBadge from '@/components/SubjectBadge'

interface Props {
  children: React.ReactNode
  params: Promise<{ subjectSlug: string }>
}

const navItems = [
  { href: '', label: 'ダッシュボード', icon: LayoutDashboard },
  { href: '/members', label: '会員管理', icon: Users },
  { href: '/posts', label: '投稿管理', icon: FileText },
  { href: '/events', label: 'イベント管理', icon: Calendar },
  { href: '/plans', label: 'プラン管理', icon: CreditCard },
  { href: '/benefits', label: '特典管理', icon: Gift },
  { href: '/messages', label: 'メール履歴', icon: Mail },
  { href: '/participations', label: '参加履歴', icon: History },
  { href: '/exhibitions', label: '展示登録', icon: Building2 },
]

export default async function ManageLayout({ children, params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  const role = mockCurrentUserRoles.find((r) => r.subjectSlug === subjectSlug)

  const roleLabel =
    role?.roleType === 'owner' ? 'オーナー' :
    role?.roleType === 'admin' ? '管理者' :
    role?.roleType === 'staff' ? 'スタッフ' : '—'

  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* サイドバー */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        {/* サイドバーヘッダー */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="text-xs text-gray-400 tracking-widest uppercase font-medium mb-3">
            管理画面
          </div>
          {subject ? (
            <div className="flex items-center gap-3">
              {subject.iconImageUrl && (
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                  <Image
                    src={subject.iconImageUrl}
                    alt={subject.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <div className="font-semibold text-sm text-gray-900 truncate">{subject.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <SubjectBadge type={subject.type} />
                  <span className="text-xs text-gray-400">{roleLabel}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600 font-medium">{subjectSlug}</div>
          )}
        </div>

        {/* ナビゲーション */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={`/manage/${subjectSlug}${href}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Icon className="w-4 h-4 text-gray-400" />
              {label}
            </Link>
          ))}
        </nav>

        {/* フッター */}
        <div className="border-t border-gray-100 p-4 space-y-2">
          <Link
            href={`/communities/${subjectSlug}`}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            公開ページへ
          </Link>
          <Link
            href="/mypage"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            マイページへ
          </Link>
        </div>
      </aside>

      {/* メイン */}
      <main className="flex-1 p-8 bg-[#fafaf8] overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
