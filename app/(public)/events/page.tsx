// app/(public)/events/page.tsx — IIMS IT Club Events Page (v4.0)
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import EventGrid from '@/components/public/EventGrid'
import { BRAND } from '@/lib/brand'

export const metadata: Metadata = {
    title: 'Events — ICEHC',
    description: 'Upcoming workshops, CTF competitions, seminars, and hackathons by ICEHC at IIMS College, Kathmandu.',
}

export const revalidate = 60

export default async function EventsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: dbEvents } = await supabase
        .from('public_events')
        .select('id, title, description, type, event_date, location, cover_image_url, is_published, slug')
        .eq('is_published', true)
        .order('event_date', { ascending: true })

    const events = (dbEvents ?? []).map((e: any) => ({
        id: e.id,
        title: e.title,
        short_desc: e.description,
        type: e.type,
        event_date: e.event_date,
        location: e.location,
        cover_image_url: e.cover_image_url,
    }))

    return (
        <div className="bg-cosmic-light min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 pb-20">
                {/* Page Header */}
                <div className="mb-12">
                    <span className="text-cosmic-black text-xs font-semibold uppercase tracking-widest mb-3 block">
                        {BRAND.clubShort}
                    </span>
                    <h1 className="font-bold text-cosmic-black text-3xl md:text-4xl mb-3">
                        Events & Activities
                    </h1>
                    <p className="text-cosmic-accent text-base max-w-xl">
                        Workshops, CTF competitions, seminars, and hackathons — all open to IIMS students.
                    </p>
                </div>

                <EventGrid events={events} />
            </div>
        </div>
    )
}
