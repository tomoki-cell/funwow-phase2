import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'funwow',
  description: 'アートとの出会いを、継続的な関係へ。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body className="min-h-screen bg-[#fafaf8]">
          <Nav />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
