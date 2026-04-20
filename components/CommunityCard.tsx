import Link from 'next/link'
import Image from 'next/image'
import type { SubjectWithStats } from '@/lib/types'
import SubjectBadge from './SubjectBadge'
import MembershipBadge from './MembershipBadge'
import { Users } from 'lucide-react'

export default function CommunityCard({ subject }: { subject: SubjectWithStats }) {
  return (
    <Link href={`/communities/${subject.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all hover:shadow-md">
        {/* カバー画像 */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {subject.coverImageUrl && (
            <Image
              src={subject.coverImageUrl}
              alt={subject.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute top-3 left-3">
            <SubjectBadge type={subject.type} />
          </div>
          {subject.currentUserMembership && (
            <div className="absolute top-3 right-3">
              <MembershipBadge plan={subject.currentUserMembership.planCode} />
            </div>
          )}
        </div>

        <div className="p-4">
          {/* アイコン + 名前 */}
          <div className="flex items-center gap-3 mb-3">
            {subject.iconImageUrl && (
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                <Image src={subject.iconImageUrl} alt={subject.name} fill className="object-cover" />
              </div>
            )}
            <h3 className="font-semibold text-gray-900 leading-snug line-clamp-1">{subject.name}</h3>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
            {subject.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {subject.memberCount.toLocaleString()} 人
            </span>
            <span>{subject.postCount} 投稿 · {subject.eventCount} イベント</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
