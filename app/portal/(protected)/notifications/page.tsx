// app/portal/notifications/page.tsx — IIMS IT Club System Alerts (v4.0)
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import NotificationsList from '@/components/portal/NotificationsList'
import { redirect } from 'next/navigation'
import { ShieldAlert, BellRing } from 'lucide-react'
import { getSession, getMember } from '@/lib/auth'



export default async function NotificationsPage() {
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createAdminSupabaseClient()

    // Fetch notifications using the accurate recipient_id field
    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', member.id)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-16 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-cosmic-brand/10 text-[#1976D2] font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#FFEBEE]">
                        <ShieldAlert className="h-3 w-3" /> Priority Inbox
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-cosmic-black leading-tight">
                        System <span className="text-cosmic-brand">Alerts</span>
                    </h1>
                    <p className="text-cosmic-accent font-medium text-sm mt-3 max-w-xl leading-relaxed">
                        Automated club notifications, event reminders, and important system broadcasts logged in real-time.
                    </p>
                </div>

                <div className="p-4 bg-white rounded-sm flex items-center gap-4 border border-cosmic-accent shadow-sm">
                    <BellRing className="h-6 w-6 text-cosmic-brand opacity-50" />
                    <div className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">
                        Live Feed Active
                    </div>
                </div>
            </div>

            <NotificationsList initialNotifications={(notifications || [])} />

            <footer className="text-center pt-8">
                <p className="text-[10px] text-[#BDBDBD] font-bold uppercase tracking-[0.3em]">
                    End of Notifications Log
                </p>
            </footer>
        </div>
    )
}
