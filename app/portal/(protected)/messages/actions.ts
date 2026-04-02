// app/portal/(protected)/messages/actions.ts — Direct Messaging Actions (v4.0)
'use server'

import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getSession, getMember } from '@/lib/auth'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Ensures a conversation exists between two members.
 * Returns the conversation_id.
 */
async function getOrCreateConversation(supabase: SupabaseClient, memberId1: string, memberId2: string) {
    if (memberId1 === memberId2) return null

    // 1. Find if a conversation already exists
    // We look for conversations where both members are participants.
    // An elegant way is to find conversation_ids for member1, and intersect with member2.
    const { data: p1 } = await supabase.from('conversation_participants').select('conversation_id').eq('member_id', memberId1)
    const { data: p2 } = await supabase.from('conversation_participants').select('conversation_id').eq('member_id', memberId2)

    const c1 = new Set(p1?.map((p: { conversation_id: string }) => p.conversation_id) || [])
    const c2 = p2?.map((p: { conversation_id: string }) => p.conversation_id) || []

    // Find intersection
    const existingConvId = c2.find((id: string) => c1.has(id))

    if (existingConvId) {
        return existingConvId
    }

    // 2. If it doesn't exist, create it
    const { data: newConv, error: convError } = await (supabase
        .from('conversations'))
        .insert({})
        .select('id')
        .single()

    if (convError || !newConv) {
        return null
    }

    // 3. Add participants
    await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, member_id: memberId1 },
        { conversation_id: newConv.id, member_id: memberId2 }
    ])

    return newConv.id
}

export async function sendMessage(receiverId: string, content: string, attachmentUrl?: string, attachmentType?: string) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized uplink' }

    if (!content.trim() && !attachmentUrl) return { error: 'Empty transmission payload' }

    const member = await getMember(session.user.id)
    if (!member) return { error: 'Operative identity not found' }

    if (member.id === receiverId) return { error: 'Cannot message yourself' }

    const supabase = createAdminSupabaseClient()

    // 1. Get or create conversation
    const conversationId = await getOrCreateConversation(supabase, member.id, receiverId)
    if (!conversationId) return { error: 'Failed to establish secure channel' }

    // 2. Insert message
    const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: member.id,
        content: content.trim() || 'File transmission',
        attachment_url: attachmentUrl || null,
        attachment_type: attachmentType || null
    })

    if (error) {
        return { error: 'Transmission failed' }
    }

    // 3. Update conversation last_updated (Optional but good practice)
    await supabase.from('conversations').update({ updated_at: new Date().toISOString() }).eq('id', conversationId)

    revalidatePath(`/portal/messages/${receiverId}`)
    revalidatePath('/portal/messages')
    return { success: true }
}

export async function markAsRead(conversationId: string) {
    const session = await getSession()
    if (!session) return

    const member = await getMember(session.user.id)
    if (!member) return

    const supabase = createAdminSupabaseClient()

    await (supabase
        .from('conversation_participants'))
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('member_id', member.id)
}
