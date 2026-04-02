// components/public/EventsSection.tsx — IIMS IT Club Events Section (v4.0)
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
// Import types safely
type PublicEvent = any

export default function EventsSection({ events }: { events: PublicEvent[] }) {
    const upcomingEvents = events
        .filter(e => new Date(e.event_date || '') >= new Date())
        .slice(0, 4)

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <span className="text-cosmic-black text-xs font-semibold uppercase tracking-widest mb-4 block">Upcoming Events</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-cosmic-black">
                            Club <span className="text-cosmic-brand">Events</span>
                        </h2>
                    </div>
                    <Link
                        href="/events"
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-cosmic-brand font-semibold text-cosmic-brand hover:bg-cosmic-dark hover:text-white transition-all text-sm"
                    >
                        View All Events
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border-2 border-dashed border-cosmic-accent p-20 text-center bg-cosmic-light">
                        <Calendar className="h-12 w-12 text-cosmic-accent mx-auto mb-4" />
                        <p className="font-bold text-cosmic-black text-xl">No upcoming events scheduled.</p>
                        <p className="text-cosmic-accent mt-2 text-sm">Check back soon for upcoming workshops, CTFs, and hackathons.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

function EventCard({ event }: { event: PublicEvent }) {
    const dateObj = new Date(event.event_date || '')
    const month = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()
    const day = dateObj.getDate()

    return (
        <div className="group flex flex-col h-full bg-white border border-cosmic-accent rounded-xl overflow-hidden hover:border-cosmic-brand/20 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
            {/* Image */}
            <div className="h-48 relative overflow-hidden bg-[var(--color-cosmic-light)]">
                {event.image_url ? (
                    <img
                        src={event.image_url || ''}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#124E66]/10 to-[#212A31]/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-cosmic-black text-white rounded-lg p-2 text-center shadow-lg min-w-[52px]">
                    <span className="block text-[10px] font-bold uppercase tracking-wider leading-none">{month}</span>
                    <span className="block text-xl font-bold leading-none mt-0.5">{day}</span>
                </div>
            </div>

            <div className="flex-1 p-5 flex flex-col">
                {/* Type Tag */}
                <span className="inline-block w-fit px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-cosmic-brand/10 text-cosmic-brand border border-cosmic-brand/20 mb-3">
                    {event.type}
                </span>

                <h3 className="font-bold text-base text-cosmic-black mb-3 line-clamp-2 group-hover:text-cosmic-black transition-colors leading-snug">
                    {event.title}
                </h3>

                <div className="flex items-center gap-2 text-[#999999] text-xs mt-auto">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{event.location || 'IIMS College Campus'}</span>
                </div>
            </div>
        </div>
    )
}
