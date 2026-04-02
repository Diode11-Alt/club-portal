// app/portal/ctf/page.tsx — IIMS IT Club CTF Arena (v4.0)
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import CTFClient from '@/components/portal/CTFClient'
import { redirect } from 'next/navigation'
import { getSession, getMember } from '@/lib/auth'



export default async function CTFPage() {
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createAdminSupabaseClient()

    // Fetch challenges (explicitly NOT selecting the secret hash column)
    const { data: challenges } = await supabase
        .from('ctf_challenges')
        .select('id, title, description, category, difficulty, points, is_active, hint, created_at')

    const activeChallenges = (challenges || []).filter((c: Record<string, unknown>) => c.is_active)

    // Fetch user solves from ctf_solves table
    const { data: userSolves } = await supabase
        .from('ctf_solves')
        .select('challenge_id')
        .eq('member_id', member.id)

    const solvedIds = new Set(userSolves?.map((s: Record<string, unknown>) => s.challenge_id as string))

    const formattedChallenges = activeChallenges.map((c: Record<string, unknown>) => ({
        ...c,
        solved: solvedIds.has(c.id as string)
    }))

    // Fetch leaderboard (Top 10)
    // IMPORTANT: Make sure we map 'full_name' instead of 'name'
    const { data: leaderboard } = await supabase
        .from('members')
        .select('id, full_name, points, avatar_url')
        .order('points', { ascending: false })
        .limit(10)

    // Get current user rank via optimized count
    const { count: rankCount } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .gt('points', member.points || 0)

    const userRank = (rankCount || 0) + 1

    return (
        <CTFClient
            challenges={formattedChallenges}
            leaderboard={leaderboard || []}
            userPoints={member.points || 0}
            userRank={userRank}
        />
    )
}
