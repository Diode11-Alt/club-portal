import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const targetUserId = params.id
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })

    const supabase = createServerClient()
    const { data: member } = await supabase.from('members').select('id, status').eq('user_id', session.user.id).single()

    if (!member || member.status !== 'approved') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 403 })

    const body = await req.json()
    const { skill } = z.object({ skill: z.string().min(1).max(50) }).parse(body)

    // Cannot endorse yourself
    if (member.id === targetUserId) {
        return NextResponse.json({ error: 'Cannot endorse yourself.' }, { status: 400 })
    }

    const { error } = await supabase.from('skill_endorsements').insert({
        member_id: targetUserId,
        endorsed_by: member.id,
        skill
    })

    if (error) {
        if (error.code === '23505') return NextResponse.json({ error: 'Already endorsed this skill.' }, { status: 400 })
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const targetUserId = params.id
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })

    const supabase = createServerClient()
    const { data } = await supabase.from('members').select('id, status').eq('user_id', session.user.id).single()
    const member = data
    if (!member || member.status !== 'approved') return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 403 })

    const body = await req.json()
    const { skill } = z.object({ skill: z.string() }).parse(body)

    const { error } = await supabase
        .from('skill_endorsements')
        .delete()
        .match({ member_id: targetUserId, endorsed_by: member.id, skill })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
