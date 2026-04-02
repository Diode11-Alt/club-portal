// app/portal/(protected)/feed/page.tsx — IIMS IT Club Feed Page (v4.0)
import { createServerClient } from '@/lib/supabase-server'
import PostComposer from '@/components/portal/PostComposer'
import FeedPost from '@/components/portal/FeedPost'
import { redirect } from 'next/navigation'
import { Rss, Sparkles } from 'lucide-react'
import Pagination from '@/components/ui/Pagination'
import { getSession, getMember } from '@/lib/auth'
import { Suspense } from 'react'
import { SkeletonFeedPage } from '@/components/Skeletons'

// Extracted Server Component for data fetching
async function FeedData({ member, currentPage, pageSize }: { member: any, currentPage: number, pageSize: number }) {
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1
    const supabase = createServerClient()

    let { data: posts, count, error } = await (supabase
        .from('posts'))
        .select('id, author_id, title, content, type, is_pinned, created_at, updated_at, author:members(id, full_name, avatar_url, role, club_post)', { count: 'exact' })
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('Core feed fetch error:', error)
        posts = []
    }

    const postIds = (posts || []).map((p: any) => p.id)
    let formattedPosts: any[] = []

    if (postIds.length > 0) {
        try {
            // EXTREME PERFORMANCE: Parallel Fetching
            const [
                { data: userLikesData },
                { data: allReactionsData },
                { data: allCommentsData }
            ] = await Promise.all([
                supabase.from('post_reactions').select('post_id').eq('member_id', member.id).in('post_id', postIds),
                supabase.from('post_reactions').select('post_id').in('post_id', postIds),
                supabase.from('post_comments').select('post_id').in('post_id', postIds)
            ])

            // EXTREME PERFORMANCE: O(1) Map Lookups instead of O(N^2) Array.filter()
            const reactionCountMap = new Map<string, number>()
            const commentCountMap = new Map<string, number>()
            const likedPostIds = new Set((userLikesData || []).map((l: any) => l.post_id))

            allReactionsData?.forEach((r: any) => {
                reactionCountMap.set(r.post_id, (reactionCountMap.get(r.post_id) || 0) + 1)
            })

            allCommentsData?.forEach((c: any) => {
                commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) || 0) + 1)
            })

            formattedPosts = (posts || []).map((p: any) => ({
                ...p,
                reaction_count: reactionCountMap.get(p.id) || 0,
                comment_count: commentCountMap.get(p.id) || 0,
                user_has_reacted: likedPostIds.has(p.id),
                author: {
                    ...p.author,
                    name: p.author?.full_name // Mapping full_name to name for UI
                }
            }))
        } catch (e) {
            console.error('Failed to resolve posts data in memory:', e)
            formattedPosts = posts || [] // Graceful fallback
        }
    }

    return (
        <div className="space-y-6">
            {formattedPosts.length > 0 ? (
                <>
                    {formattedPosts.map((post: any) => (
                        <FeedPost
                            key={post.id}
                            post={post}
                            currentMemberId={member.id}
                        />
                    ))}

                    {count && count > pageSize && (
                        <div className="pt-8">
                            <Pagination
                                page={currentPage}
                                totalPages={Math.ceil(count / pageSize)}
                                baseUrl="/portal/feed"
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="py-24 rounded-sm border border-dashed border-cosmic-accent bg-white shadow-sm text-center">
                    <div className="h-16 w-16 bg-cosmic-light rounded-sm flex items-center justify-center mx-auto mb-5 border border-cosmic-accent">
                        <Sparkles className="h-8 w-8 text-cosmic-accent" />
                    </div>
                    <p className="text-cosmic-dark font-bold text-lg mb-1">It's quiet in here.</p>
                    <p className="text-cosmic-accent font-medium text-sm">Be the first to share an update with the club.</p>
                </div>
            )}
        </div>
    )
}

export default async function FeedPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const currentPage = parseInt(params.page || '1')
    const pageSize = 10

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cosmic-light text-cosmic-brand font-bold text-[10px] uppercase tracking-widest mb-3 border border-cosmic-brand/10">
                        <Rss className="h-3.5 w-3.5" /> Club Feed
                    </div>
                    <h1 className="text-3xl font-bold text-cosmic-black leading-tight">
                        Community <span className="text-cosmic-black">Discussions</span>
                    </h1>
                    <p className="text-cosmic-accent font-medium text-sm mt-2 max-w-xl">
                        Share ideas, resources, and stay up to date with the latest ICEHC announcements.
                    </p>
                </div>
            </div>

            <PostComposer
                userRole={member.role}
                memberName={(member.full_name || 'Member').split(' ')[0]}
            />

            {/* Removed Suspense to bypass React DevTools Extension Bug */}
            <FeedData member={member} currentPage={currentPage} pageSize={pageSize} />

            <footer className="text-center pt-8 border-t border-cosmic-accent">
                <p className="text-[10px] text-cosmic-accent font-bold uppercase tracking-widest">
                    End of Feed Activity
                </p>
            </footer>
        </div>
    )
}
