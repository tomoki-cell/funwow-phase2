'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function GatePage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)

    if (password === 'funwowphase2') {
      document.cookie = `funwow_gate=funwowphase2; path=/; max-age=${60 * 60 * 24 * 30}`
      router.push('/')
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold tracking-widest text-gray-900 mb-1">FUNWOW</div>
          <div className="text-sm text-gray-400">プレビュー版</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              アクセスコード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              placeholder="パスワードを入力"
              autoFocus
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors ${
                error ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 mt-1.5">パスワードが違います</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full bg-gray-900 text-white rounded-full py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '確認中…' : '入る'}
          </button>
        </form>
      </div>
    </div>
  )
}
