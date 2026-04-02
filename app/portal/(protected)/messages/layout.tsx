// app/portal/messages/layout.tsx — IIMS IT Club Messaging Shell (v4.0)
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import MessagesShell from '@/components/portal/MessagesShell'
import { getSession, getMember } from '@/lib/auth'



export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createServerClient()

    // 1. Get all conversations the member is part of
    const { data: participations } = await (supabase
        .from('conversation_participants'))
        .select('conversation_id, last_read_at')
        .eq('member_id', member.id)

    const conversationIds = participations?.map((p: any) => p.conversation_id) || []

    let formattedConversations: any[] = []

    if (conversationIds.length > 0) {
        // 2. Fetch those conversations with nested latest messages and other participants
        const { data: convs } = await (supabase
            .from('conversations'))
            .select(`
                id,
                updated_at,
                messages ( id, content, created_at, sender_id ),
                conversation_participants ( member_id, members ( id, full_name, avatar_url ) )
            `)
            .in('id', conversationIds)
            .order('updated_at', { ascending: false })
            // Limit messages to the most recent 1 per conversation
            .order('created_at', { ascending: false, referencedTable: 'messages' })
            .limit(1, { referencedTable: 'messages' })

        formattedConversations = (convs || []).map((conv: any) => {
            const otherParticipant = conv.conversation_participants?.find((p: any) => p.member_id !== member.id)
            const otherMember = otherParticipant?.members

            const latestMsg = conv.messages?.[0] || { content: 'Secure channel established.', created_at: conv.updated_at, sender_id: null }

            const myParticipation = participations?.find((p: any) => p.conversation_id === conv.id)
            const unread = latestMsg.sender_id !== member.id && latestMsg.created_at > (myParticipation?.last_read_at || '1970-01-01')

            return {
                conversation_id: conv.id,
                otherMember: {
                    id: otherMember?.id,
                    name: otherMember?.full_name || 'Unknown',
                    avatar_url: otherMember?.avatar_url
                },
                lastMessage: {
                    content: latestMsg.content,
                    created_at: latestMsg.created_at,
                    isMine: latestMsg.sender_id === member.id
                },
                unreadCount: unread ? 1 : 0
            }
        }).filter((c: any) => c.otherMember?.id)
    }

    return (
        <MessagesShell
            conversations={formattedConversations}
            memberId={member.id}
        >
            {children}
        </MessagesShell>
    )
}
