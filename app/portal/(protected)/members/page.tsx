// app/portal/(protected)/members/page.tsx — IIMS IT Club Member Directory
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Search, ShieldCheck, MessageSquare, MapPin, Calendar } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { getSession, getMember } from '@/lib/auth'



export default async function MembersDirectoryPage() {
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createAdminSupabaseClient()

    const { data: members, error } = await supabase
        .from('members')
        .select('id, full_name, avatar_url, club_post, role, bio, skills, points, joined_at')
        .eq('status', 'approved')
        .order('points', { ascending: false })

    if (error) console.error("MEMBERS QUERY ERROR:", error)

    const allMembers = (members || [])

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cosmic-light text-cosmic-brand font-bold text-[10px] uppercase tracking-widest mb-3 border border-cosmic-accent shadow-sm">
                        <Users className="h-3.5 w-3.5" /> Member Directory
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-cosmic-black leading-tight">
                        Club <span className="text-cosmic-black">Members</span>
                    </h1>
                    <p className="text-cosmic-accent font-medium text-sm mt-3 max-w-xl leading-relaxed">
                        Browse approved ICEHC members. Click on a member to view their profile, skills, and send them a message.
                    </p>
                </div>

                <div className="bg-white rounded-sm p-6 border border-cosmic-accent shadow-sm flex items-center gap-5">
                    <div className="p-3 bg-cosmic-light text-cosmic-brand rounded-sm shadow-inner">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold text-cosmic-accent uppercase tracking-widest leading-none mb-1">Active Members</span>
                        <span className="block text-2xl font-bold text-cosmic-black">{allMembers.length}</span>
                    </div>
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allMembers.map((m: any) => {
                    const isMe = m.id === member.id
                    const level = Math.floor((m.points || 0) / 100) + 1

                    return (
                        <Link
                            key={m.id}
                            href={isMe ? '/portal/profile' : `/portal/members/${m.id}`}
                            className="group bg-white rounded-sm border border-cosmic-accent shadow-sm hover:shadow-sm hover:border-cosmic-brand/20 transition-all overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="bg-cosmic-brand p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-black/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <Avatar
                                        src={m.avatar_url}
                                        name={m.full_name || 'Member'}
                                        className="w-14 h-14 rounded-sm border-2 border-white/20 shadow-sm group-hover:scale-105 transition-transform"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-white font-bold text-sm truncate flex items-center gap-2">
                                            {m.full_name || 'Anonymous'}
                                            {isMe && (
                                                <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full">You</span>
                                            )}
                                            {['admin', 'superadmin'].includes(m.role) && (
                                                <ShieldCheck className="h-3.5 w-3.5 text-cosmic-black shrink-0" />
                                            )}
                                        </h3>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                                            {m.club_post || 'General Member'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-4">
                                {/* Bio Preview */}
                                <p className="text-cosmic-accent text-xs font-medium line-clamp-2 leading-relaxed min-h-[2.5rem]">
                                    {m.bio || 'No biography set.'}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5">
                                    {m.skills && m.skills.length > 0 ? (
                                        m.skills.slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="px-2.5 py-1 rounded-md bg-cosmic-light text-cosmic-accent border border-cosmic-accent text-[9px] font-bold uppercase tracking-wider">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[9px] font-bold text-cosmic-accent uppercase tracking-widest">No skills listed</span>
                                    )}
                                    {m.skills && m.skills.length > 3 && (
                                        <span className="px-2.5 py-1 rounded-md bg-cosmic-light text-cosmic-brand text-[9px] font-bold">
                                            +{m.skills.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Footer Stats */}
                                <div className="flex items-center justify-between pt-3 border-t border-[var(--color-cosmic-light)]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-cosmic-brand">{m.points || 0} pts</span>
                                        <span className="text-[9px] text-cosmic-accent font-bold uppercase">Level {level}</span>
                                    </div>
                                    {!isMe && (
                                        <span className="text-[9px] font-bold text-cosmic-black uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MessageSquare className="h-3 w-3" /> Message
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {allMembers.length === 0 && (
                <div className="bg-white rounded-sm border border-cosmic-accent p-16 text-center">
                    <div className="h-16 w-16 bg-cosmic-light rounded-sm flex items-center justify-center mx-auto mb-5 border border-cosmic-accent">
                        <Users className="h-8 w-8 text-cosmic-accent" />
                    </div>
                    <p className="text-cosmic-dark font-bold text-lg mb-1">No Members Yet</p>
                    <p className="text-cosmic-accent font-medium text-sm">Be the first to join ICEHC!</p>
                </div>
            )}
        </div>
    )
}
