'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Exhibition } from '@/lib/mock/phase1'
import { Heart, Calendar } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  exhibition: Exhibition
  isSaved?: boolean
}

export default function ExhibitionCard({ exhibition, isSaved = false }: Props) {
  const isActive =
    new Date(exhibition.endDate) >= new Date() &&
    new Date(exhibition.startDate) <= new Date()

  const endDate = new Date(exhibition.endDate).toLocaleDateString('ja-JP', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link href={`/exhibitions/${exhibition.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-300 transition-all hover:shadow-md">
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {exhibition.coverImageUrl && (
            <Image
              src={exhibition.coverImageUrl}
              alt={exhibition.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute top-3 left-3">
            <span
              className={clsx(
                'text-xs px-2.5 py-1 rounded-full font-medium border',
                isActive
                  ? 'bg-white text-gray-900 border-gray-200'
                  : 'bg-white/70 text-gray-500 border-gray-200'
              )}
            >
              {isActive ? '開催中' : '終了'}
            </span>
          </div>
          <button
            className={clsx(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors',
              isSaved ? 'bg-red-50' : 'bg-white/80 hover:bg-white'
            )}
            onClick={(e) => e.preventDefault()}
          >
            <Heart
              className={clsx(
                'w-4 h-4',
                isSaved ? 'fill-red-400 text-red-400' : 'text-gray-400'
              )}
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-1 mb-1">
            {exhibition.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{exhibition.spaceName}</p>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
            {exhibition.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              〜 {endDate}まで
            </span>
            {exhibition.admissionFee === 0 ? (
              <span className="text-green-600">無料</span>
            ) : exhibition.admissionFee ? (
              <span>¥{exhibition.admissionFee.toLocaleString()}</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
