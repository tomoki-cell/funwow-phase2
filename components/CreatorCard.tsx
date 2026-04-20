import Link from 'next/link'
import Image from 'next/image'
import type { Creator } from '@/lib/mock/phase1'
import { Users } from 'lucide-react'

interface Props {
  creator: Creator
  hasommunity?: boolean
}

export default function CreatorCard({ creator, hasommunity = false }: Props) {
  return (
    <Link href={`/creators/${creator.slug}`} className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-all">
      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
        {creator.iconImageUrl && (
          <Image
            src={creator.iconImageUrl}
            alt={creator.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 leading-tight">{creator.name}</h3>
          {creator.relatedSubjectSlug && (
            <span className="flex items-center gap-0.5 text-xs text-gray-400">
              <Users className="w-3 h-3" /> コミュニティあり
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{creator.bio}</p>
      </div>
    </Link>
  )
}
