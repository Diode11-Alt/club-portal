import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })

    const supabase = createServerClient()
    const { data: member, error } = await supabase
        .from('members')
        .select('id, user_id, full_name, email, role, status, club_post, joined_at, avatar_url, student_id, points, bio, is_public_profile, display_order')
        .eq('user_id', session.user.id)
        .single()

    if (error || !member) return NextResponse.json({ error: 'MEMBER_NOT_FOUND' }, { status: 404 })

    return NextResponse.json({ member })
}
