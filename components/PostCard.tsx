// components/PostCard.tsx
// Displays a single post in the feed.
// Shows the title, content, author name, date, and a pin badge if pinned.
// Also shows edit/delete buttons if the logged-in user is the author or an admin.

'use client'

import { Pin } from 'lucide-react'

type Post = {
    id: string
    title: string
    content: string
    author_id: string | null
    pinned: boolean
    created_at: string
    author?: { name?: string | null; email?: string | null }
}

type PostCardProps = {
    post: Post
    currentUserId: string | null
    currentUserRole: string | null
    onDelete: (postId: string) => void
    onEdit: (post: Post) => void
}

export default function PostCard({
    post,
    currentUserId,
    currentUserRole,
    onDelete,
    onEdit,
}: PostCardProps) {
    // Check if the current user can edit (only their own posts)
    const canEdit = currentUserId === post.author_id
    // Check if the current user can delete (own posts OR admin)
    const canDelete = currentUserId === post.author_id || currentUserRole === 'admin'

    // Format the date to a readable string like "Feb 19, 2026"
    const formattedDate = new Date(post.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4 transition-all hover:shadow-md">
            {/* Header: title + pinned badge */}
            <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">{post.title}</h3>
                {post.pinned && (
                    <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Pin className="w-3 h-3 fill-amber-700" />
                        Pinned
                    </span>
                )}
            </div>

            {/* Post content */}
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {post.content}
            </p>

            {/* Footer: author info + action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                {/* Author info */}
                <div className="flex items-center gap-2">
                    {/* Avatar circle with first letter of name */}
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-indigo-600">
                            {(post.author?.name || post.author?.email || '?')[0].toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-medium text-slate-700">
                            {post.author?.name || post.author?.email || 'Unknown'}
                        </span>
                        <span className="text-xs text-slate-400 ml-2">{formattedDate}</span>
                    </div>
                </div>

                {/* Action buttons (only show if user has permission) */}
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <button
                            onClick={() => onEdit(post)}
                            className="text-xs text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                            Edit
                        </button>
                    )}
                    {canDelete && (
                        <button
                            onClick={() => onDelete(post.id)}
                            className="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
