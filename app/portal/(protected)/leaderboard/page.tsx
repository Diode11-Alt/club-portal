// app/portal/leaderboard/page.tsx — IIMS IT Club Global Leaderboard (v4.0)
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Zap, Crown, Award, Target } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import Pagination from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'



export default async function LeaderboardPage(props: {
    searchParams: Promise<{ page?: string }>
}) {
    const searchParams = await props.searchParams
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const currentPage = parseInt(searchParams.page || '1')
    const pageSize = 20
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createAdminSupabaseClient()

    // Get current member for highlighting
    const { data: currentMember } = await (supabase
        .from('members'))
        .select('id, points')
        .eq('user_id', session.user.id)
        .single()

    // Fetch paginated members
    const { data, count } = await (supabase
        .from('members'))
        .select('id, full_name, avatar_url, points, role, club_post', { count: 'exact' })
        .eq('status', 'approved')
        .order('points', { ascending: false })
        .range(from, to)

    const members = (data || [])

    return (
        <div className="min-h-screen -m-6 md:-m-10 p-6 md:p-10 bg-[#0D1117]">
            <div className="max-w-5xl mx-auto space-y-10 pb-16 animate-fade-up">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#161B22] text-[#D29922] font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#30363D] shadow-sm">
                            <Trophy className="h-3.5 w-3.5" /> High Performance Log
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-[#E6EDF3] leading-tight">
                            Club <span className="text-cosmic-black">Leaderboard</span>
                        </h1>
                        <p className="text-[#8B949E] font-medium text-sm mt-3 max-w-xl leading-relaxed">
                            Global proficiency rankings based on mission success, CTF flag captures, and unit contributions.
                        </p>
                    </div>

                    <div className="bg-[#161B22] rounded-sm p-6 border border-[#30363D] shadow-sm flex items-center gap-5 group">
                        <div className="p-3 bg-[#0D1117] rounded-sm text-[#58A6FF] transition-all shadow-inner border border-[#30363D]">
                            <Zap className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-[#8B949E] uppercase tracking-widest leading-none mb-1">Total Members</span>
                            <span className="block text-2xl font-bold text-[#E6EDF3]">{count || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="bg-[#161B22] rounded-[2rem] border border-[#30363D] shadow-sm shadow-black/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#0D1117] border-b border-[#30363D]">
                                    <th className="px-6 py-5 text-[10px] font-bold text-[#8B949E] uppercase tracking-widest">Rank</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-[#8B949E] uppercase tracking-widest">Member</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-[#8B949E] uppercase tracking-widest hidden md:table-cell">Designation</th>
                                    <th className="px-6 py-5 text-[10px] font-bold text-[#8B949E] uppercase tracking-widest text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#30363D]">
                                {members.map((m: any, idx: number) => {
                                    const rank = from + idx + 1
                                    const isMe = m.id === currentMember?.id
                                    const isTop3 = rank <= 3

                                    return (
                                        <tr
                                            key={m.id}
                                            className={cn(
                                                "group transition-all hover:bg-[#0D1117] cursor-pointer",
                                                isMe && "bg-[#58A6FF]/10 hover:bg-[#58A6FF]/15"
                                            )}
                                        >
                                            <td className="px-6 py-5">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-sm flex items-center justify-center font-bold text-sm transition-all",
                                                    rank === 1 ? "bg-[#FFF9C4] text-[#F57F17] shadow-sm shadow-[#FFF9C4]/50 scale-110 border border-[#FFF59D]" :
                                                        rank === 2 ? "bg-[var(--color-cosmic-light)] text-cosmic-accent border border-cosmic-accent" :
                                                            rank === 3 ? "bg-[#FFECB3] text-[#FF8F00] border border-[#FFE082]" :
                                                                "text-[#8B949E] group-hover:text-[#E6EDF3]"
                                                )}>
                                                    {rank === 1 ? <Crown className="h-5 w-5" /> : rank}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <Link href={isMe ? '/portal/profile' : `/portal/members/${m.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                                                    <Avatar src={m.avatar_url} name={m.full_name || 'Anonymous'} size="sm" className="shadow-sm border border-cosmic-accent" />
                                                    <div className="min-w-0">
                                                        <p className={cn(
                                                            "font-bold text-sm truncate group-hover:text-cosmic-brand transition-colors",
                                                            isMe ? "text-[#58A6FF]" : "text-[#E6EDF3]"
                                                        )}>
                                                            {m.full_name || 'Anonymous Member'} {isMe && "(You)"}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-[#8B949E] uppercase tracking-widest md:hidden mt-0.5">
                                                            {m.club_post || m.role}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 hidden md:table-cell">
                                                <span className="text-[10px] font-bold text-[#8B949E] uppercase tracking-widest border border-[#30363D] px-3 py-1.5 rounded-sm bg-[#0D1117]">
                                                    {m.club_post || m.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className={cn(
                                                    "text-lg font-bold font-mono",
                                                    isTop3 ? "text-[#D29922]" : "text-[#E6EDF3]"
                                                )}>
                                                    {m.points}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {members.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="h-16 w-16 bg-cosmic-light rounded-sm flex items-center justify-center mx-auto mb-5 border border-cosmic-accent">
                                <Target className="h-8 w-8 text-cosmic-accent" />
                            </div>
                            <p className="text-[#E6EDF3] font-bold text-lg mb-1">Leaderboard Empty</p>
                            <p className="text-[#8B949E] font-medium text-sm">No approved members found.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {count && count > pageSize && (
                    <div className="py-8">
                        <Pagination
                            page={currentPage}
                            totalPages={Math.ceil(count / pageSize)}
                            baseUrl="/portal/leaderboard"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
