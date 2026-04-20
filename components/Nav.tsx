'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, UserButton, SignInButton } from '@clerk/nextjs'
import { clsx } from 'clsx'
import { Search } from 'lucide-react'

const navLinks = [
  { href: '/explore', label: '探索' },
  { href: '/communities', label: 'コミュニティ' },
]

export default function Nav() {
  const pathname = usePathname()
  const { isSignedIn, isLoaded } = useUser()

  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight flex-shrink-0">
          funwow
        </Link>

        <nav className="flex items-center gap-1 mx-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'px-4 py-1.5 rounded-full text-sm transition-colors',
                pathname?.startsWith(href)
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-500 hover:text-gray-900'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            className="text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="探索"
          >
            <Search className="w-5 h-5" />
          </Link>

          {/* 認証状態に応じて切り替え */}
          {!isLoaded ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : isSignedIn ? (
            <>
              <Link
                href="/mypage"
                className={clsx(
                  'text-sm transition-colors',
                  pathname?.startsWith('/mypage')
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                マイページ
              </Link>
              {/* Clerk の UserButton（アバター＋ドロップダウン） */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8',
                    userButtonPopoverCard: 'rounded-2xl shadow-lg border border-gray-100',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/sign-up"
                className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm hover:bg-gray-700 transition-colors"
              >
                登録
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
