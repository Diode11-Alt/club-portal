import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, props: { params: Promise<{ intake: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })

    const params = await props.params
    const intake_year = parseInt(params.intake, 10)
    if (isNaN(intake_year)) return NextResponse.json({ error: 'INVALID_INTAKE_YEAR' }, { status: 400 })

    const supabase = createAdminSupabaseClient()
    const { data: members, error } = await supabase
        .from('members')
        .select('id, full_name, avatar_url, role, club_post, current_semester, student_id, joined_at, points, status')
        .eq('intake_year', intake_year)
        .order('points', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ intake: intake_year, count: members?.length || 0, members: members || [] })
}
