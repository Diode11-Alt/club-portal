// app/portal/(protected)/layout.tsx — Auth gate for approved members only
import { redirect } from 'next/navigation'
import Sidebar from '@/components/portal/Sidebar'
import PortalNavbar from '@/components/portal/PortalNavbar'
import { getSession, getMember } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export default async function ProtectedPortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // ── Step 1: Verify authenticated ──
    const session = await getSession()
    if (!session) redirect('/portal/login')

    // ── Step 2: Fetch and verify member ──
    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    // middleware.ts handles actual routing lockouts, but this acts as an
    // extra layout-level guard guaranteeing that if status !== 'approved',
    // they shouldn't see the portal shell (except admins evaluating others).
    if (member.status === 'pending') {
        if (!['admin', 'superadmin'].includes(member.role)) {
            // Profile complete checking is done in pending/page.tsx
            redirect('/portal/pending')
        }
    }
    if (member.status === 'rejected') redirect('/portal/login?reason=rejected')
    if ((member.status) === 'banned') redirect('/portal/login?reason=banned')

    // ── Step 3: Fetch unread count efficiently ──
    const supabase = createAdminSupabaseClient()
    const { count: unreadNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', session.user.id) // using recipient_id per DB schema
        .eq('is_read', false)

    // ── Fetch Unread Messages ──
    const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id, last_read_at')
        .eq('member_id', member.id)

    let unreadMessagesCount = 0
    if (participations && participations.length > 0) {
        const conversationIds = (participations || []).map(p => p.conversation_id)
        const { data: recentMsgs } = await supabase
            .from('messages')
            .select('conversation_id, created_at, sender_id')
            .in('conversation_id', conversationIds)
            .neq('sender_id', member.id)
            .order('created_at', { ascending: false })

        const processedConvos = new Set()
        for (const msg of (recentMsgs || [])) {
            if (processedConvos.has(msg.conversation_id)) continue
            processedConvos.add(msg.conversation_id)
            const part = (participations || []).find(p => p.conversation_id === msg.conversation_id)
            if (part && new Date(msg.created_at) > new Date(part.last_read_at || 0)) {
                unreadMessagesCount++
            }
        }
    }

    // ── Step 4: Render Shell ──
    return (
        <div className="flex min-h-screen bg-cosmic-light">
            {/* Desktop Sidebar */}
            <Sidebar
                member={member}
                unreadNotifications={unreadNotifications ?? 0}
                unreadMessages={unreadMessagesCount}
            />

            <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative overflow-hidden">
                {/* Mobile Navbar */}
                <PortalNavbar member={member} unreadMessages={unreadMessagesCount} />

                {/* Main Content Area */}
                <main className="flex-1 p-6 pb-24 md:p-10 relative z-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto mt-2 md:mt-0">
                        {children}
                    </div>
                </main>
            </div>

            {/* Background design elements across portal */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cosmic-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10 transform-gpu" />
            <div className="fixed bottom-0 left-64 w-[500px] h-[500px] bg-cosmic-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none -z-10 transform-gpu" />
        </div>
    )
}
