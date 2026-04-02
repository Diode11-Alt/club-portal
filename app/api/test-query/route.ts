import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const supabase = createServerClient()

    // Test member relation with disambiguated relationship
    const idMember = '12ddd69e-1b31-4272-9560-79fff44259da'
    const memQuery = await supabase.from('members').select('id, full_name, skill_endorsements(id)').eq('id', idMember).maybeSingle()

    // Also test direct skill_endorsements
    const directSkills = await supabase.from('skill_endorsements').select('id, member_id, skill, created_at').limit(1)

    // Test post relation with specific failing UUID
    const idPost = '70ef33e9-54fa-4347-80c5-be79bfc500b9'
    const postQuery = await supabase.from('posts').select(`
            *,
            author:members!posts_author_id_fkey (id, full_name, avatar_url, role, club_post),
            post_reactions (*),
            post_comments (
                id, content, created_at,
                author:members!post_comments_author_id_fkey (id, full_name, avatar_url, role, club_post)
            )
        `).eq('id', idPost).maybeSingle()

    // Test direct reaction columns
    const reactions = await supabase.from('post_reactions').select('id, post_id, member_id, created_at').limit(1)

    return NextResponse.json({ memQuery, directSkills, postQuery, reactions })
}
