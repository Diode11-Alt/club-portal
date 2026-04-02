import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })

    const params = await props.params
    const supabase = createAdminSupabaseClient()

    // Assuming member activity comprises posts, event attendances (if tracking), or points history.
    // For now we return their authored posts as their "activity" feed since we have a posts table.
    const { data: posts, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, created_at, category, is_pinned')
        .eq('author_id', params.id)
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ member_id: params.id, posts: posts || [] })
}
