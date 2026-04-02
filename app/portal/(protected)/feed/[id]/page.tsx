// app/portal/(protected)/feed/[id]/page.tsx — IIMS IT Club Single Post View (v4.0)
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { ArrowLeft, Clock, ShieldCheck, Heart, MessageSquare } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Image from 'next/image'
import { getSession, getMember } from '@/lib/auth'
import CommentForm from '@/components/portal/CommentForm'



export default async function SinglePostPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const { id } = params

    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createAdminSupabaseClient()

    // Fetch post and relations
    const { data: postData } = await supabase
        .from('posts')
        .select(`
            *,
            author:members!posts_author_id_fkey (id, full_name, avatar_url, role, club_post),
            post_reactions (id, member_id),
            post_comments (
                id, content, created_at,
                author:members!post_comments_author_id_fkey (id, full_name, avatar_url, role, club_post)
            )
        `)
        .eq('id', id)
        .maybeSingle()

    const post = postData

    if (!post) {
        return notFound()
    }

    // Check if the current user has liked this post
    const hasLiked = post.post_reactions?.some((r: any) => r.member_id === session.user.id)
    const likesCount = post.post_reactions?.length || 0
    const author = Array.isArray(post.author) ? post.author[0] : post.author

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-up pb-16">
            <Link href="/portal/feed" className="inline-flex items-center gap-2 text-cosmic-accent hover:text-cosmic-brand font-bold text-xs uppercase tracking-widest transition-all group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Intel Feed
            </Link>

            <article className="bg-white border border-cosmic-accent rounded-[2rem] shadow-sm overflow-hidden">
                <div className="p-8 md:p-10">
                    <div className="flex items-start gap-4 mb-6">
                        <Link href={`/portal/members/${post.author_id}`}>
                            <Avatar src={author?.avatar_url} name={author?.full_name} size="md" className="ring-2 ring-[#748D92] shadow-sm hover:scale-105 transition-transform" />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link href={`/portal/members/${post.author_id}`} className="flex items-center gap-2 group w-fit">
                                <h3 className="font-bold text-cosmic-black group-hover:text-cosmic-brand transition-colors">{author?.full_name}</h3>
                                {['admin', 'superadmin'].includes(author?.role) && (
                                    <ShieldCheck className="h-4 w-4 text-cosmic-brand" />
                                )}
                            </Link>
                            <div className="flex items-center gap-3 text-xs mt-1">
                                <span className="font-bold text-cosmic-black uppercase tracking-widest">{author?.club_post || author?.role}</span>
                                <span className="text-[#BDBDBD]">•</span>
                                <span className="text-cosmic-accent font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{formatDate(post.created_at)}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-cosmic-dark text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

                    {post.image_url && (
                        <div className="mt-8 relative rounded-[1.5rem] overflow-hidden border border-[#EEEEEE] bg-cosmic-light h-[600px]">
                            <Image src={post.image_url} alt="Post Attachment" fill unoptimized className="object-contain" />
                        </div>
                    )}
                </div>

                {/* Engagement Bar */}
                <div className="px-8 md:px-10 py-4 bg-cosmic-light border-t border-cosmic-accent flex items-center gap-6">
                    <div className="flex items-center gap-2 text-cosmic-accent font-bold text-sm">
                        <Heart className={`h-5 w-5 ${hasLiked ? 'fill-[#212A31] text-cosmic-black' : ''}`} />
                        <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cosmic-accent font-bold text-sm">
                        <MessageSquare className="h-5 w-5" />
                        <span>{post.post_comments?.length || 0} Comments</span>
                    </div>
                </div>
            </article>

            {/* Comments Section */}
            <div className="bg-white border border-cosmic-accent rounded-[2rem] shadow-sm p-8 md:p-10">
                <h3 className="text-xl font-bold text-cosmic-black mb-8">Discussions</h3>

                <CommentForm
                    postId={id}
                    userAvatar={member.avatar_url || undefined}
                    userName={member.full_name || undefined}
                />

                <div className="space-y-6">
                    {post.post_comments?.length > 0 ? (
                        post.post_comments.map((comment: any) => {
                            const commentAuthor = Array.isArray(comment.author) ? comment.author[0] : comment.author
                            return (
                                <div key={comment.id} className="flex gap-4 p-4 rounded-sm bg-cosmic-light border border-cosmic-accent">
                                    <Avatar src={commentAuthor?.avatar_url} name={commentAuthor?.full_name} size="sm" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-sm text-cosmic-black">{commentAuthor?.full_name}</span>
                                            <span className="text-[9px] font-bold text-cosmic-black uppercase tracking-widest">{commentAuthor?.club_post || commentAuthor?.role}</span>
                                            <span className="text-[10px] text-cosmic-accent">• {formatDate(comment.created_at)}</span>
                                        </div>
                                        <p className="text-cosmic-dark text-sm leading-relaxed">{comment.content}</p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-cosmic-accent font-medium text-sm text-center py-6">No discussions yet. Start the conversation!</p>
                    )}
                </div>
            </div>
        </div>
    )
}
