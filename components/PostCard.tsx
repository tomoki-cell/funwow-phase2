import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/lib/types'
import { Lock } from 'lucide-react'
import { clsx } from 'clsx'

const postTypeLabel: Record<Post['postType'], string> = {
  announcement: 'お知らせ',
  report: 'レポート',
  archive: 'アーカイブ',
  event_notice: 'イベント案内',
  media_link: 'メディア',
}

interface PostCardProps {
  post: Post
  subjectSlug: string
  isLocked?: boolean
}

export default function PostCard({ post, subjectSlug, isLocked = false }: PostCardProps) {
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <Link
      href={isLocked ? `/communities/${subjectSlug}/join` : `/communities/${subjectSlug}/posts/${post.id}`}
      className="group block"
    >
      <div
        className={clsx(
          'bg-white rounded-xl overflow-hidden border transition-all',
          isLocked
            ? 'border-gray-100 opacity-70 cursor-pointer'
            : 'border-gray-100 hover:border-gray-300 hover:shadow-sm'
        )}
      >
        {post.coverImageUrl && (
          <div className="relative h-40 bg-gray-100 overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className={clsx('object-cover', !isLocked && 'group-hover:scale-105 transition-transform duration-500')}
            />
            {isLocked && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
            )}
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
              {postTypeLabel[post.postType]}
            </span>
            {post.visibility === 'members_only' && (
              <span className="text-xs text-gray-500 flex items-center gap-0.5">
                <Lock className="w-3 h-3" /> 会員限定
              </span>
            )}
          </div>
          <h4
            className={clsx(
              'font-medium text-gray-900 leading-snug line-clamp-2',
              isLocked && 'blur-sm select-none'
            )}
          >
            {isLocked ? 'この投稿は会員限定です' : post.title}
          </h4>
          {publishedDate && (
            <p className="text-xs text-gray-400 mt-2">{publishedDate}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
