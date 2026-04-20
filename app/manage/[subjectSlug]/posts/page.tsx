'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/mock/subjects'
import { Lock, Eye, PenLine, X, Plus, Calendar, Link2 } from 'lucide-react'
import type { Post, PostType, PostVisibility, PostStatus } from '@/lib/types'

const postTypeLabels: Record<PostType, string> = {
  announcement: 'お知らせ',
  report: 'レポート',
  archive: 'アーカイブ',
  event_notice: 'イベント告知',
  media_link: 'メディア',
}

const emptyForm = {
  title: '',
  body: '',
  postType: 'announcement' as PostType,
  visibility: 'public' as PostVisibility,
  status: 'draft' as PostStatus,
  linkedEventId: '',
}

export default function ManagePostsPage() {
  const { subjectSlug } = useParams<{ subjectSlug: string }>()
  const subject = getSubjectBySlug(subjectSlug)

  const [posts, setPosts] = useState<Post[]>(subject?.latestPosts ?? [])
  const [showModal, setShowModal] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  if (!subject) return <div className="text-gray-500">コミュニティが見つかりません</div>

  const events = subject.upcomingEvents

  function openCreate() {
    setEditingPost(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(post: Post) {
    setEditingPost(post)
    setForm({
      title: post.title,
      body: post.body,
      postType: post.postType,
      visibility: post.visibility,
      status: post.status,
      linkedEventId: '',
    })
    setShowModal(true)
  }

  async function handleSave() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))

    if (editingPost) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? { ...p, title: form.title, body: form.body, postType: form.postType, visibility: form.visibility, status: form.status }
            : p
        )
      )
    } else {
      const newPost: Post = {
        id: `post_new_${Date.now()}`,
        subjectId: subject!.id,
        title: form.title,
        body: form.body,
        postType: form.postType,
        visibility: form.visibility,
        status: form.status,
        publishedAt: form.status === 'published' ? new Date().toISOString() : undefined,
        createdByUserId: 'user_admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setPosts((prev) => [newPost, ...prev])
    }

    setSaving(false)
    setShowModal(false)
  }

  const linkedEvent = events.find((e) => e.id === form.linkedEventId)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">投稿管理</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          新しい投稿
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">タイトル</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">種別</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">公開範囲</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">ステータス</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">公開日</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium text-gray-800 line-clamp-1">{post.title}</div>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">{postTypeLabels[post.postType]}</td>
                <td className="px-5 py-3">
                  {post.visibility === 'members_only' ? (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Lock className="w-3 h-3" /> 会員限定
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Eye className="w-3 h-3" /> 公開
                    </span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      post.status === 'published'
                        ? 'text-green-600 bg-green-50 border-green-200'
                        : 'text-gray-500 bg-gray-50 border-gray-200'
                    }`}
                  >
                    {post.status === 'published' ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
                    : '—'}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => openEdit(post)}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <PenLine className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                  投稿がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 新規作成 / 編集モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editingPost ? '投稿を編集' : '新しい投稿'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* タイトル */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="投稿タイトルを入力"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* 本文 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  placeholder="投稿内容を入力"
                  rows={6}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* イベント紐づけ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  関連イベント（任意）
                </label>
                <select
                  value={form.linkedEventId}
                  onChange={(e) => setForm({ ...form, linkedEventId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white"
                >
                  <option value="">紐づけなし</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title} （{new Date(event.startAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}）
                    </option>
                  ))}
                </select>
                {linkedEvent && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{linkedEvent.title} ／ {linkedEvent.eventFormat === 'online' ? 'オンライン' : 'オフライン'}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* 種別 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">種別</label>
                  <select
                    value={form.postType}
                    onChange={(e) => setForm({ ...form, postType: e.target.value as PostType })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    {(Object.entries(postTypeLabels) as [PostType, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* 公開範囲 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">公開範囲</label>
                  <select
                    value={form.visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value as PostVisibility })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="public">公開</option>
                    <option value="members_only">会員限定</option>
                  </select>
                </div>

                {/* ステータス */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as PostStatus })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
                  >
                    <option value="draft">下書き</option>
                    <option value="published">公開する</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-full hover:border-gray-400 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title || saving}
                className="px-5 py-2 text-sm bg-gray-900 text-white rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? '保存中…' : editingPost ? '更新する' : '作成する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
