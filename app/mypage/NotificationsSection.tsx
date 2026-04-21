'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bell, ChevronDown, ChevronUp } from 'lucide-react'
import { mockNotifications, type Notification } from '@/lib/mock/notifications'

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (days >= 1) return `${days}日前`
  if (hours >= 1) return `${hours}時間前`
  if (minutes >= 1) return `${minutes}分前`
  return 'たった今'
}

export default function NotificationsSection() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
    markAsRead(id)
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-900">お知らせ</h2>
          {unreadCount > 0 && (
            <span className="text-xs font-medium text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              未読 {unreadCount}件
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            すべて既読にする
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`bg-white rounded-xl border overflow-hidden transition-colors ${
              notif.isRead ? 'border-gray-100' : 'border-gray-200 ring-1 ring-gray-100'
            }`}
          >
            <div
              className="flex items-start gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleToggle(notif.id)}
            >
              {/* 未読インジケーター */}
              <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0">
                {!notif.isRead && <div className="w-2 h-2 rounded-full bg-red-500" />}
              </div>

              {/* アイコン */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <Image
                  src={notif.subjectIconUrl}
                  alt={notif.subjectName}
                  fill
                  className="object-cover"
                />
              </div>

              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Link
                    href={`/communities/${notif.subjectSlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {notif.subjectName}
                  </Link>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{timeAgo(notif.sentAt)}</span>
                </div>
                <div
                  className={`text-sm line-clamp-1 ${
                    notif.isRead ? 'text-gray-600' : 'font-medium text-gray-900'
                  }`}
                >
                  {notif.subject}
                </div>
              </div>

              {/* 展開アイコン */}
              <div className="flex-shrink-0 text-gray-300 mt-1">
                {expandedId === notif.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* 本文展開 */}
            {expandedId === notif.id && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-50 bg-gray-50">
                <p className="text-sm text-gray-600 leading-relaxed">{notif.body}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
