import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/manage(.*)'])

const GATE_COOKIE = 'funwow_gate'
const GATE_VALUE = 'funwowphase2'

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // ゲートページ自体はパスワードチェックをスキップ
  if (pathname === '/gate') {
    return NextResponse.next()
  }

  // パスワードクッキーチェック
  const gateCookie = req.cookies.get(GATE_COOKIE)
  if (!gateCookie || gateCookie.value !== GATE_VALUE) {
    return NextResponse.redirect(new URL('/gate', req.url))
  }

  // 管理画面はClerk認証必須
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
