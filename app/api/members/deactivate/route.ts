import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })

    const body = await req.json()
    const { reason } = body

    const supabase = createAdminSupabaseClient()

    // The user's member ID is linked via user_id
    const { data: member, error: fetchErr } = await (supabase
        .from('members'))
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (fetchErr || !member) {
        return NextResponse.json({ error: 'MEMBER_NOT_FOUND' }, { status: 404 })
    }

    const { error: updateErr } = await (supabase
        .from('members'))
        .update({
            deactivation_requested_at: new Date().toISOString(),
            deactivation_reason: reason || null
        })
        .eq('id', member.id)

    if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }

    // Attempt to log out the user from auth ?
    // The user can log out client side.

    return NextResponse.json({ success: true })
}
