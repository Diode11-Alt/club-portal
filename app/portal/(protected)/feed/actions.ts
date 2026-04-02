// app/portal/(protected)/feed/actions.ts — IIMS IT Club Feed Actions
'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { getSession, getMember } from '@/lib/auth'

const postSchema = z.object({
    content: z.string().min(1, 'Post cannot be empty').max(2000, 'Post exceeds character limit'),
    type: z.enum(['post', 'resource', 'announcement', 'question']),
    title: z.string().optional()
})

export async function createPost(prevState: unknown, formData: FormData) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const member = await getMember(session.user.id)
    if (!member) return { error: 'Member not found' }

    const content = formData.get('content') as string
    const type = formData.get('type') as string || 'post'
    const title = formData.get('title') as string || undefined // passing undefined to DB instead of null strings if empty

    const parsedTitle = title?.trim() || undefined

    const validated = postSchema.safeParse({ content, type, title: parsedTitle })
    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.content?.[0] || 'Invalid input' }
    }

    const supabase = createServerClient()
    const { error } = await supabase.from('posts').insert({
        author_id: member.id,
        content: validated.data.content,
        title: validated.data.title || null,
        type: validated.data.type,
        is_pinned: validated.data.type === 'announcement'
    })

    if (error) {
        return { error: 'Failed to create post' }
    }

    revalidatePath('/portal/feed')
    revalidatePath('/portal/dashboard')
    return { success: true }
}

export async function toggleReaction(postId: string) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const member = await getMember(session.user.id)
    if (!member) return { error: 'Member not found' }

    const supabase = createServerClient()

    // Using Rpc or direct check
    const { data: existing } = await (supabase
        .from('post_reactions'))
        .select('id')
        .eq('post_id', postId)
        .eq('member_id', member.id)
        .maybeSingle()

    if (existing) {
        await supabase.from('post_reactions').delete().eq('id', existing.id)
    } else {
        await supabase.from('post_reactions').insert({
            post_id: postId,
            member_id: member.id
        })
    }

    revalidatePath('/portal/feed')
}

export async function addComment(postId: string, content: string) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized' }

    const member = await getMember(session.user.id)
    if (!member) return { error: 'Member not found' }

    if (!content.trim()) return { error: 'Comment cannot be empty' }

    const supabase = createServerClient()
    const { error } = await supabase.from('post_comments').insert({
        post_id: postId,
        author_id: member.id,
        content: content.trim()
    })

    if (error) {
        return { error: 'Failed to add comment' }
    }

    revalidatePath('/portal/feed')
    return { success: true }
}
