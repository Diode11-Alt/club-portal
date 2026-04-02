// app/api/members/search/route.ts — Member Search API
import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getSession, getMember } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const member = await getMember(session.user.id)
    if (!member) {
        return NextResponse.json({ error: 'Not a member' }, { status: 403 })
    }

    const q = req.nextUrl.searchParams.get('q')
    if (!q || q.trim().length < 1) {
        return NextResponse.json({ members: [] })
    }

    const supabase = createAdminSupabaseClient()

    const { data, error } = await supabase
        .from('members')
        .select('id, full_name, avatar_url, club_post, role')
        .eq('status', 'approved')
        .neq('id', member.id)
        .ilike('full_name', `%${q.trim()}%`)
        .limit(10)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ members: data || [] })
}
