// components/portal/EventCard.tsx — IIMS IT Club Event Card (v4.0)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, Users, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toggleRsvp } from '@/app/portal/(protected)/events/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Event = any

interface EventCardProps {
    event: Event & { user_rsvp?: string }
}

export default function EventCard({ event }: EventCardProps) {
    const [rsvpStatus, setRsvpStatus] = useState(event.user_rsvp || null)
    const isCTF = (event.type || '').toLowerCase().includes('ctf')
    const eventDate = event.event_date

    async function handleRsvp(status: 'going' | 'maybe' | 'not_going') {
        const oldStatus = rsvpStatus
        const newStatus = status === 'not_going' ? null : status
        setRsvpStatus(newStatus)

        const res = await toggleRsvp(event.id, status)
        if (res?.error) {
            toast.error(res.error)
            setRsvpStatus(oldStatus)
        } else {
            toast.success(`RSVP updated: ${status.replace('_', ' ').toUpperCase()}`)
        }
    }

    return (
        <div className="group bg-white rounded-sm border border-cosmic-accent p-6 md:p-8 shadow-sm hover:shadow-sm hover:border-cosmic-brand/20 transition-all animate-fade-up flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Visual Indicator / Date */}
            <div className="flex-shrink-0 w-full md:w-32 h-32 rounded-sm bg-cosmic-light flex flex-col items-center justify-center text-center border border-cosmic-accent group-hover:bg-cosmic-dark group-hover:text-white transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest text-cosmic-accent group-hover:text-white/70 mb-1">
                    {new Date(eventDate).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-3xl font-bold leading-none text-cosmic-black group-hover:text-white">
                    {new Date(eventDate).getDate()}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-cosmic-black group-hover:text-white/90 transition-colors">
                    {new Date(eventDate).getFullYear()}
                </span>
            </div>

            {/* Main Details */}
            <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                        isCTF
                            ? "bg-cosmic-brand/10 text-cosmic-brand border-[#FFCDD2]"
                            : "bg-cosmic-brand/10 text-[#1976D2] border-[#BBDEFB]"
                    )}>
                        {event.type}
                    </span>
                    {rsvpStatus && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cosmic-light border border-[#FFECB3] text-[#F57F17] text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck className="h-3 w-3" /> RSVP: {rsvpStatus === 'going' ? 'Confirmed' : 'Interested'}
                        </span>
                    )}
                </div>

                <Link href={`/portal/events/${event.id}`} className="block">
                    <h3 className="text-2xl font-bold text-cosmic-black group-hover:text-cosmic-brand transition-colors leading-tight">
                        {event.title}
                    </h3>
                </Link>

                <div className="flex flex-wrap gap-5 text-xs font-semibold text-cosmic-accent">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-cosmic-accent" />
                        {new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-cosmic-accent" />
                        {event.location || 'IIMS College Campus'}
                    </div>
                </div>

                <p className="text-cosmic-accent font-medium text-sm leading-relaxed line-clamp-2 max-w-2xl">
                    {event.short_desc || (event.description?.substring(0, 150) + '...')}
                </p>
            </div>

            {/* Control Panel */}
            <div className="flex flex-col gap-3 min-w-[180px] justify-center pt-5 md:pt-0 border-t md:border-t-0 md:border-l border-cosmic-accent md:pl-8">
                <button
                    onClick={() => handleRsvp('going')}
                    className={cn(
                        "w-full h-12 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm focus:ring-4 focus:ring-cosmic-brand/20",
                        rsvpStatus === 'going'
                            ? "bg-cosmic-brand text-white shadow-[#124E66]/30"
                            : "bg-white text-cosmic-brand border-2 border-cosmic-brand hover:bg-cosmic-light"
                    )}
                >
                    {rsvpStatus === 'going' ? 'Registered' : 'Register Now'}
                </button>

                <button
                    onClick={() => handleRsvp(rsvpStatus === 'maybe' ? 'not_going' : 'maybe')}
                    className={cn(
                        "w-full h-12 rounded-sm text-xs font-bold uppercase tracking-widest transition-all focus:ring-4 focus:ring-[#748D92]",
                        rsvpStatus === 'maybe'
                            ? "bg-cosmic-light text-[#F57F17] border-2 border-[#FFE082]"
                            : "bg-[var(--color-cosmic-light)] text-cosmic-accent hover:bg-[#EEEEEE] hover:text-cosmic-dark"
                    )}
                >
                    {rsvpStatus === 'maybe' ? 'Tentative' : 'Interested'}
                </button>

                <Link
                    href={`/portal/events/${event.id}`}
                    className="flex items-center justify-center gap-2 text-cosmic-accent font-bold text-[10px] uppercase tracking-widest mt-2 hover:text-cosmic-brand transition-colors group/link"
                >
                    Event Details <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
