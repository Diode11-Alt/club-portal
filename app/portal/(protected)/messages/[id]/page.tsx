// app/portal/messages/[id]/page.tsx — Direct Member Chat (v4.0)
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/portal/ChatWindow'
import { redirect, notFound } from 'next/navigation'
import { getSession, getMember } from '@/lib/auth'

interface Participation {
    conversation_id: string
}

interface ChatMessage {
    id: string
    content: string
    sender_id: string
    conversation_id: string
    created_at: string
    is_deleted: boolean
    attachment_url: string | null
    attachment_type: string | null
}



export default async function MessageThreadPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const { id } = params

    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createAdminSupabaseClient()

    // Identify 'other' member
    const { data: otherUser } = await (supabase
        .from('members'))
        .select('id, full_name, avatar_url, role, club_post')
        .eq('id', id)
        .single()

    if (!otherUser) return notFound()

    // Find the conversation ID between these two members
    const { data: participations } = await (supabase
        .from('conversation_participants'))
        .select('conversation_id')
        .in('member_id', [member.id, otherUser.id])

    const counts: Record<string, number> = {}
    let activeConvId: string | null = null

    ;(participations as Participation[] | null)?.forEach((p) => {
        counts[p.conversation_id] = (counts[p.conversation_id] || 0) + 1
        if (counts[p.conversation_id] === 2) activeConvId = p.conversation_id
    })

    // Fetch direct messages between these two using the conversation ID
    let messages: ChatMessage[] = []

    if (activeConvId) {
        const { data: msgs } = await (supabase
            .from('messages'))
            .select('*')
            .eq('conversation_id', activeConvId)
            .order('created_at', { ascending: true })

        messages = (msgs || []) as ChatMessage[]

        // Update my participant record as read since I just opened the thread
        await (supabase
            .from('conversation_participants'))
            .update({ last_read_at: new Date().toISOString() })
            .eq('conversation_id', activeConvId)
            .eq('member_id', member.id)
    }

    return (
        <ChatWindow
            initialMessages={messages}
            currentUser={{
                id: member.id,
                name: member.full_name,
                avatar_url: member.avatar_url,
                role: member.role,
                club_post: member.club_post,
            }}
            otherUser={{
                ...otherUser,
                name: otherUser.full_name // Map to generic name property for UI
            }}
            conversationId={activeConvId}
        />
    )
}
