import { notFound, redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getSubjectBySlug, getPostById } from '@/lib/mock/subjects'
import { ChevronLeft, Lock } from 'lucide-react'

interface Props {
  params: Promise<{ subjectSlug: string; postId: string }>
}

export default async function PostDetailPage({ params }: Props) {
  const { subjectSlug, postId } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  const post = getPostById(subjectSlug, postId)
  if (!post) notFound()

  const membership = subject.currentUserMembership
  const isMember = !!membership

  if (post.visibility === 'members_only' && !isMember) {
    redirect(`/communities/${subjectSlug}/join`)
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href={`/communities/${subjectSlug}/posts`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        投稿一覧へ
      </Link>

      <article>
        {post.coverImageUrl && (
          <div className="relative h-64 rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          {publishedDate && (
            <span className="text-sm text-gray-400">{publishedDate}</span>
          )}
          {post.visibility === 'members_only' && (
            <span className="text-xs text-gray-500 flex items-center gap-0.5 border border-gray-200 px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" /> 会員限定
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
          {post.body.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {post.externalUrl && (
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 text-sm text-gray-500 underline hover:text-gray-900"
          >
            関連リンクを見る →
          </a>
        )}
      </article>

      <div className="mt-12 pt-8 border-t border-gray-100">
        <Link
          href={`/communities/${subjectSlug}`}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← {subject.name} のコミュニティに戻る
        </Link>
      </div>
    </div>
  )
}
