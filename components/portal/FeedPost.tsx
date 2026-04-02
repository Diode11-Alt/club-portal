// components/portal/FeedPost.tsx — IIMS IT Club Feed Item (v4.0)
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { formatDate, cn } from '@/lib/utils'
import { MessageSquare, Heart, Share2, MoreHorizontal, Megaphone, FileText, ShieldCheck, ChevronRight, GraduationCap, Maximize2, Download } from 'lucide-react'
import { toggleReaction } from '@/app/portal/(protected)/feed/actions'
import { createClient } from '@/lib/supabase'

type Post = any

interface FeedPostProps {
    post: Post
    currentMemberId: string
}

export default function FeedPost({ post, currentMemberId }: FeedPostProps) {
    const [liked, setLiked] = useState(post.user_has_reacted)
    const [likesCount, setLikesCount] = useState(post.reaction_count || 0)
    const [commentsCount, setCommentsCount] = useState(post.comment_count || 0)

    // Real-time subscription for counts & reactions
    useEffect(() => {
        const supabase = createClient()

        const reactionChannel = supabase.channel(`post-reactions-${post.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'post_reactions',
                filter: `post_id=eq.${post.id}`
            }, async () => {
                try {
                    const { count } = await supabase
                        .from('post_reactions')
                        .select('*', { count: 'exact', head: true })
                        .eq('post_id', post.id)
                    setLikesCount(count || 0)
                } catch (e) {
                    setLikesCount(0)
                }
            })
            .subscribe()

        const commentChannel = supabase.channel(`post-comments-${post.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments',
                filter: `post_id=eq.${post.id}`
            }, async () => {
                try {
                    const { count } = await supabase
                        .from('post_comments')
                        .select('*', { count: 'exact', head: true })
                        .eq('post_id', post.id)
                    setCommentsCount(count || 0)
                } catch (e) {
                    setCommentsCount(0)
                }
            })
            .subscribe()

        return () => {
            reactionChannel.unsubscribe()
            commentChannel.unsubscribe()
        }
    }, [post.id])

    async function handleLike() {
        const newLiked = !liked
        const newCount = newLiked ? likesCount + 1 : likesCount - 1

        setLiked(newLiked)
        setLikesCount(newCount)

        await toggleReaction(post.id)
    }

    const isAnnouncement = post.type === 'announcement'
    const isResource = post.type === 'resource'
    const author = post.author || {}

    return (
        <div className={cn(
            "relative p-6 md:p-8 rounded-sm border transition-all animate-fade-up group hover:shadow-sm",
            isAnnouncement
                ? "bg-cosmic-light border-cosmic-brand/20 shadow-sm"
                : "bg-white border-cosmic-accent shadow-sm hover:border-cosmic-brand/20"
        )}>
            {/* Visual Indicator for Priority */}
            {isAnnouncement && (
                <div className="absolute -top-3 left-8 px-4 py-1 rounded-full bg-cosmic-black text-white text-[10px] font-bold uppercase tracking-widest shadow-sm flex items-center gap-2">
                    <Megaphone className="h-3 w-3" /> Priority Announcement
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    {author.avatar_url ? (
                        <Avatar
                            src={author.avatar_url}
                            name={author.name || 'Member'}
                            size="md"
                            className="ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-[var(--color-cosmic-light)] border border-cosmic-accent flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            <GraduationCap className="h-5 w-5 text-cosmic-accent" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-cosmic-black font-bold text-sm">
                                {author.name || 'Anonymous Member'}
                            </span>
                            {['admin', 'superadmin', 'bod'].includes(author.role) && (
                                <ShieldCheck className="h-4 w-4 text-cosmic-brand" />
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-cosmic-accent text-[10px] font-bold uppercase tracking-widest">
                                {formatDate(post.created_at)}
                            </span>
                            {isResource && (
                                <>
                                    <span className="h-1 w-1 rounded-full bg-cosmic-accent" />
                                    <span className="flex items-center gap-1 text-cosmic-brand text-[10px] font-bold uppercase tracking-widest">
                                        <FileText className="h-3 w-3" /> Resource
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button className="p-2 rounded-sm text-cosmic-accent hover:text-cosmic-black hover:bg-[var(--color-cosmic-light)] transition-all">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="mb-6">
                {post.title && (
                    <h3 className="text-xl font-bold text-cosmic-black mb-2 group-hover:text-cosmic-brand transition-colors">
                        {post.title}
                    </h3>
                )}
                <div className="text-cosmic-dark text-sm leading-relaxed whitespace-pre-wrap">
                    {post.content.split('\n\n[IMAGE: ')[0]}
                </div>
                {post.content.includes('\n\n[IMAGE: ') && (
                    <div className="mt-4 relative group rounded-sm overflow-hidden border border-cosmic-accent">
                        <img
                            src={post.content.split('\n\n[IMAGE: ')[1].replace(']', '')}
                            alt="Post attached image"
                            className="w-full h-auto object-cover max-h-[500px] transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-cosmic-brand/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                            <a
                                href={post.content.split('\n\n[IMAGE: ')[1].replace(']', '')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-white text-cosmic-black hover:bg-cosmic-dark hover:text-white rounded-sm transition-colors shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                            >
                                <Maximize2 className="h-4 w-4" /> Preview
                            </a>
                            <a
                                href={post.content.split('\n\n[IMAGE: ')[1].replace(']', '')}
                                download="icehc-attachment.jpg"
                                className="p-3 bg-white text-cosmic-black hover:bg-cosmic-dark hover:text-white rounded-sm transition-colors shadow-lg flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                            >
                                <Download className="h-4 w-4" /> Download
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4 sm:gap-6 pt-5 border-t border-[var(--color-cosmic-light)]">
                <div className="flex items-center gap-4 sm:gap-6">
                    <button
                        onClick={handleLike}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm text-xs font-bold transition-all",
                            liked
                                ? "text-cosmic-black bg-cosmic-brand/10 shadow-sm"
                                : "text-cosmic-accent hover:text-cosmic-black hover:bg-cosmic-brand/10"
                        )}
                    >
                        <Heart className={cn("h-4.5 w-4.5 transition-transform", liked ? "fill-current scale-110" : "group-hover:scale-110")} />
                        <span>{likesCount}</span>
                    </button>

                    <Link
                        href={`/portal/feed/${post.id}`}
                        className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-sm text-xs font-bold text-cosmic-accent hover:text-cosmic-brand hover:bg-cosmic-brand/10 transition-all"
                    >
                        <MessageSquare className="h-4.5 w-4.5" />
                        <span>{commentsCount}</span>
                    </Link>

                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-bold text-cosmic-accent hover:text-cosmic-brand hover:bg-cosmic-light transition-all">
                        <Share2 className="h-4.5 w-4.5" />
                        <span>Share</span>
                    </button>
                </div>

                <Link
                    href={`/portal/feed/${post.id}`}
                    className="p-2 rounded-full bg-[var(--color-cosmic-light)] text-cosmic-accent hover:text-cosmic-brand hover:bg-cosmic-dark/10 transition-all sm:ml-auto"
                >
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>
        </div>
    )
}
