// app/portal/(protected)/dashboard/page.tsx — IIMS IT Club Dashboard (v4.0)
import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { ShieldCheck, Calendar, ArrowRight, Megaphone, Terminal, Trophy, MessageSquare, ChevronRight, GraduationCap, Inbox, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import { getSession, getMember } from '@/lib/auth'
import { Suspense } from 'react'

export default async function DashboardPage() {
    const session = await getSession()
    if (!session) return null // layout handles redirect

    const member = await getMember(session.user.id)
    if (!member) return null

    const isHighPerms = ['admin', 'superadmin'].includes(member.role)

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Welcome Banner */}
            <section className="relative rounded-sm bg-cosmic-brand overflow-hidden p-8 md:p-12 shadow-sm shadow-[#124E66]/20">
                <div className="absolute top-[-50%] right-[-10%] w-[120%] h-[200%] bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD54F]/10 rounded-full blur-3xl -translate-x-32 translate-y-32" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex p-1 rounded-sm bg-white/10 backdrop-blur-md border border-white/20 shadow-inner h-20 w-20 items-center justify-center relative">
                            {member.avatar_url ? (
                                <Avatar src={member.avatar_url} name={member.full_name} size="lg" className="h-16 w-16" />
                            ) : (
                                <div className="h-16 w-16 bg-white rounded-sm flex items-center justify-center shadow-sm">
                                    <GraduationCap className="h-8 w-8 text-cosmic-brand" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Welcome, <span className="text-[#FFD54F]">{(member.full_name || 'Member').split(' ')[0]}</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <p className="text-cosmic-muted font-medium text-sm flex items-center gap-2">
                                    {member.program && (member as any).intake ? `${member.program} • ${(member as any).intake}` : 'IT Club Member'}
                                </p>
                                <span className="h-1 w-1 rounded-full bg-white/30" />
                                <span className="text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10">
                                    {member.club_post || 'General Member'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8 bg-white/10 backdrop-blur-xl px-8 py-5 rounded-sm border border-white/10 shadow-sm">
                        <div className="text-center">
                            <span className="block text-[10px] text-cosmic-muted font-bold uppercase tracking-widest mb-1.5 opacity-80">Club Points</span>
                            <span className="block text-3xl font-bold text-[#FFD54F]">{member.points || 0}</span>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center group">
                            <span className="block text-[10px] text-cosmic-muted font-bold uppercase tracking-widest mb-1.5 opacity-80">Global Rank</span>
                            <Link href="/portal/leaderboard" className="block text-2xl font-bold text-white hover:text-[#FFD54F] transition-colors">
                                <Suspense fallback={<span className="animate-pulse opacity-50">...</span>}>
                                    <UserRankLoader points={member.points || 0} />
                                </Suspense>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Announcements Feed */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-cosmic-black flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-cosmic-black" />
                            Official Announcements
                        </h2>
                        <Link href="/portal/feed" className="text-sm font-semibold text-cosmic-brand hover:underline flex items-center gap-1 group">
                            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <Suspense fallback={
                        <div className="grid grid-cols-1 gap-5">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white p-6 md:p-8 rounded-sm border border-cosmic-accent h-32" />
                            ))}
                        </div>
                    }>
                        <AnnouncementsLoader />
                    </Suspense>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    {/* Admin Shortcuts */}
                    {isHighPerms && (
                        <div className="bg-cosmic-light p-6 rounded-sm border border-cosmic-accent shadow-sm">
                            <h2 className="text-sm font-bold text-cosmic-black mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <ShieldCheck className="h-4 w-4 text-cosmic-black" />
                                Admin Shortcuts
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                <Link href="/portal/admin?tab=broadcast" className="flex items-center justify-between p-3 rounded-sm bg-white border border-cosmic-accent hover:border-cosmic-brand hover:shadow-sm transition-all group">
                                    <span className="text-sm font-semibold text-cosmic-dark group-hover:text-cosmic-brand flex items-center gap-2">
                                        <Megaphone className="h-4 w-4" /> Broadcast
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-cosmic-accent group-hover:text-cosmic-brand" />
                                </Link>
                                <Link href="/portal/admin?tab=events" className="flex items-center justify-between p-3 rounded-sm bg-white border border-cosmic-accent hover:border-cosmic-brand hover:shadow-sm transition-all group">
                                    <span className="text-sm font-semibold text-cosmic-dark group-hover:text-cosmic-brand flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Manage Events
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-cosmic-accent group-hover:text-cosmic-brand" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Events */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-cosmic-black flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-cosmic-brand" />
                                Upcoming Events
                            </h2>
                            <Link href="/portal/events" className="text-xs font-semibold text-cosmic-accent hover:text-cosmic-brand transition-colors">
                                View Calendar
                            </Link>
                        </div>

                        <Suspense fallback={
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white p-4 h-20 rounded-sm border border-cosmic-accent" />
                                ))}
                            </div>
                        }>
                            <EventsLoader />
                        </Suspense>
                    </div>

                    {/* Modules / Tools */}
                    <div className="grid grid-cols-3 gap-3">
                        <Link href="/portal/ctf" className="flex flex-col items-center justify-center p-5 rounded-sm bg-white border border-cosmic-accent hover:border-cosmic-brand hover:bg-cosmic-dark/5 transition-all group shadow-sm text-center">
                            <Terminal className="h-6 w-6 text-cosmic-dark mb-2 group-hover:text-cosmic-brand transition-colors" />
                            <span className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest group-hover:text-cosmic-brand">CTF Arena</span>
                        </Link>
                        <Link href="/portal/messages" className="flex flex-col items-center justify-center p-5 rounded-sm bg-white border border-cosmic-accent hover:border-[#0277BD] hover:bg-[#0277BD]/5 transition-all group shadow-sm text-center">
                            <MessageSquare className="h-6 w-6 text-cosmic-dark mb-2 group-hover:text-cosmic-brand transition-colors" />
                            <span className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest group-hover:text-cosmic-brand">Messages</span>
                        </Link>
                        <Link href={`/portal/members?intake=${(member as any).intake || new Date().getFullYear()}`} className="flex flex-col items-center justify-center p-5 rounded-sm bg-white border border-cosmic-accent hover:border-[#2E7D32] hover:bg-[#2E7D32]/5 transition-all group shadow-sm text-center">
                            <Users className="h-6 w-6 text-cosmic-dark mb-2 group-hover:text-[#2E7D32] transition-colors" />
                            <span className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest group-hover:text-[#2E7D32]">My Cohort</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// -----------------------------------------------------
// SUSPENSE DATA LOADERS
// -----------------------------------------------------

async function UserRankLoader({ points }: { points: number }) {
    const supabase = createServerClient()
    const { count } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .gt('points', points)

    const rank = (count || 0) + 1
    return <span>#{rank}</span>
}

async function AnnouncementsLoader() {
    const supabase = createServerClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('id, title, content, created_at, type')
        .eq('type', 'announcement')
        .order('created_at', { ascending: false })
        .limit(3)

    const announcements = posts || []

    if (announcements.length === 0) {
        return (
            <div className="bg-white p-10 rounded-sm border border-dashed border-cosmic-accent text-center flex flex-col items-center justify-center">
                <Inbox className="h-10 w-10 text-cosmic-accent mb-3" />
                <p className="text-cosmic-accent font-medium text-sm">No recent announcements from the board.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 gap-5">
            {announcements.map((post: any) => (
                <Link
                    key={post.id}
                    href={`/portal/feed/${post.id}`}
                    className="block bg-white p-6 md:p-8 rounded-sm border border-cosmic-accent shadow-sm hover:shadow-sm hover:border-cosmic-brand/20 transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-cosmic-light text-[#F57F17] text-[10px] font-bold uppercase tracking-wider border border-cosmic-brand/20">
                            Announcement
                        </span>
                        <span className="text-cosmic-accent text-xs font-semibold">
                            {formatDate(post.created_at)}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-cosmic-black mb-2 group-hover:text-cosmic-brand transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                    <p className="text-cosmic-accent text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.content}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-cosmic-brand">
                        Read details <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            ))}
        </div>
    )
}

async function EventsLoader() {
    const supabase = createServerClient()
    const { data: dbEvents } = await supabase
        .from('public_events')
        .select('id, title, type, event_date, location, is_published')
        .gte('event_date', new Date().toISOString())
        .eq('is_published', true)
        .order('event_date')
        .limit(4)

    const events = dbEvents || []

    if (events.length === 0) {
        return (
            <div className="p-5 text-center bg-cosmic-light rounded-sm border border-dashed border-cosmic-accent">
                <p className="text-xs text-cosmic-accent font-medium">No upcoming events right now.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {events.map((event: any) => (
                <Link
                    key={event.id}
                    href={`/portal/events/${event.id}`}
                    className="block bg-white p-4 rounded-sm border border-cosmic-accent hover:border-cosmic-brand/30 hover:shadow-sm transition-all group"
                >
                    <span className="block text-[10px] font-bold text-cosmic-brand uppercase tracking-wider mb-1">
                        {formatDate(event.event_date || '')}
                    </span>
                    <h4 className="font-semibold text-cosmic-black text-sm group-hover:text-cosmic-brand transition-colors line-clamp-1">
                        {event.title}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                        <span className="px-2 py-0.5 rounded-md bg-[var(--color-cosmic-light)] text-cosmic-accent text-[10px] font-bold uppercase border border-cosmic-accent">
                            {event.type}
                        </span>
                        <ChevronRight className="h-3 w-3 text-cosmic-accent group-hover:text-cosmic-brand" />
                    </div>
                </Link>
            ))}
        </div>
    )
}
