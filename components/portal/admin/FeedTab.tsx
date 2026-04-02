// components/portal/admin/FeedTab.tsx — IIMS IT Club Transmissions Ops (v4.0)
'use client'

import { useState } from 'react'
import { Trash2, Megaphone, Calendar, User, ExternalLink, Link2, Pin, Trash } from 'lucide-react'
import { deletePost } from '@/app/portal/(protected)/admin/actions'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export default function FeedTab({ posts, refresh }: { posts: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm('Purge Transmission? This action is absolute.')) return
        setIsLoading(id)
        const res = await deletePost(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Transmission purged from uplink')
            refresh()
        }
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-8 rounded-[2rem] border border-cosmic-accent shadow-sm hover:shadow-sm hover:border-cosmic-brand/20 transition-all group flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border",
                                        post.type === 'announcement' ? "bg-cosmic-light text-[#F57F17] border-[#FFECB3]" : "bg-cosmic-light text-cosmic-accent border-cosmic-accent"
                                    )}>
                                        {post.type || 'Standard'} Directive
                                    </span>
                                    {post.is_pinned && <Pin className="h-4 w-4 text-cosmic-black" />}
                                </div>
                                <span className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">
                                    {formatDate(post.created_at)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-cosmic-black group-hover:text-cosmic-brand transition-colors leading-tight">
                                    {post.title || 'Untitled Transmission'}
                                </h3>
                                <p className="text-cosmic-accent font-medium text-sm line-clamp-2 leading-relaxed">
                                    {post.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Avatar src={post.author?.avatar_url} name={post.author?.full_name || post.author?.name} size="xs" />
                                <div className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">
                                    Relayed by <span className="text-cosmic-brand">{post.author?.full_name || post.author?.name || 'System'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-3 w-full md:w-auto mt-4 md:mt-0">
                            <button
                                onClick={() => handleDelete(post.id)}
                                disabled={!!isLoading}
                                className="flex-1 md:w-14 h-14 bg-white hover:bg-cosmic-brand/10 text-[#BDBDBD] hover:text-cosmic-brand rounded-sm flex items-center justify-center transition-all border border-cosmic-accent hover:border-[#FFCDD2] shadow-sm"
                                title="Abort Transmission"
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                            <a
                                href={`/portal/feed/${post.id}`}
                                target="_blank"
                                className="flex-1 md:w-14 h-14 bg-white hover:bg-cosmic-light text-[#BDBDBD] hover:text-cosmic-brand rounded-sm flex items-center justify-center transition-all border border-cosmic-accent hover:border-cosmic-accent shadow-sm"
                                title="View Frequency"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="py-24 text-center bg-cosmic-light rounded-[3rem] border-2 border-dashed border-cosmic-accent">
                        <Megaphone className="h-12 w-12 text-[#BDBDBD] mx-auto mb-4" />
                        <p className="text-cosmic-accent font-bold text-lg uppercase tracking-widest">Uplink Silent</p>
                    </div>
                )}
            </div>
        </div>
    )
}
