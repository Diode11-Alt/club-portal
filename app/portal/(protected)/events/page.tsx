// app/portal/events/page.tsx — IIMS IT Club Event Registry (v4.0)
import { createServerClient } from '@/lib/supabase-server'
import EventCard from '@/components/portal/EventCard'
import { redirect } from 'next/navigation'
import { Calendar, Search, Filter, Loader2 } from 'lucide-react'
import { getSession, getMember } from '@/lib/auth'



export default async function PortalEventsPage() {
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createServerClient()

    // Fetch events from verified 'public_events' table
    const { data: events } = await supabase
        .from('public_events')
        .select('id, title, description, type, event_date, end_date, location, meeting_link, cover_image_url, is_published, max_attendees')
        .eq('is_published', true)
        .order('event_date', { ascending: true })

    // Fetch RSVPs for current member
    const { data: userRsvps } = await supabase
        .from('event_rsvps')
        .select('event_id, status')
        .eq('member_id', member.id)

    const rsvpMap = new Map((userRsvps || []).map((r: any) => [r.event_id, r.status]))

    const formattedEvents = (events || []).map((e: any) => ({
        ...e,
        user_rsvp: rsvpMap.get(e.id)
    }))

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-16 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-cosmic-light text-cosmic-brand font-bold text-[10px] uppercase tracking-widest mb-3 border border-cosmic-accent">
                        <Calendar className="h-3 w-3" /> Registry
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-cosmic-black leading-tight">
                        Event <span className="text-cosmic-black">Registry</span>
                    </h1>
                    <p className="text-cosmic-accent font-medium text-sm mt-3 max-w-xl leading-relaxed">
                        Central coordination for upcoming workshops, seminars, and club-wide meetups.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-accent" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="bg-white border border-cosmic-accent rounded-sm py-2.5 pl-10 pr-4 text-sm font-semibold focus:ring-4 focus:ring-cosmic-brand/10 focus:border-cosmic-brand/30 transition-all outline-none text-cosmic-black placeholder:text-cosmic-accent"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-cosmic-accent rounded-sm text-cosmic-accent hover:text-cosmic-brand hover:bg-cosmic-light transition-all">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Grid of Events */}
            <div className="grid grid-cols-1 gap-6 md:gap-8">
                {formattedEvents.length > 0 ? (
                    formattedEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="py-24 rounded-sm border border-dashed border-cosmic-accent bg-cosmic-light shadow-sm text-center">
                        <div className="h-16 w-16 bg-white rounded-sm flex items-center justify-center mx-auto mb-5 border border-cosmic-accent">
                            <Loader2 className="h-8 w-8 text-[#BDBDBD]" />
                        </div>
                        <p className="text-cosmic-dark font-bold text-lg uppercase tracking-widest">Calendar Empty</p>
                        <p className="text-cosmic-accent mt-1 text-sm font-medium">No official events are currently scheduled.</p>
                    </div>
                )}
            </div>

            <footer className="text-center pt-8">
                <p className="text-[10px] text-[#BDBDBD] font-bold uppercase tracking-[0.3em]">
                    End of Registry Log
                </p>
            </footer>
        </div>
    )
}
