// app/portal/events/[id]/page.tsx — Detailed Mission Intel (v4.0)
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getSession, getMember } from '@/lib/auth'
import Image from 'next/image'

type Event = any



export default async function PortalEventDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const { id } = params

    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createAdminSupabaseClient()

    // Fetch event details from the verified 'public_events' table
    const { data: eventData } = await supabase
        .from('public_events')
        .select('*')
        .eq('id', id)
        .single()

    if (!eventData) return notFound()
    const event = eventData

    // Fetch attendees count
    const { count: attendeeCount } = await supabase
        .from('event_rsvps')
        .select('id', { count: 'exact' })
        .eq('event_id', params.id)
        .eq('status', 'going')

    const eventDate = event.event_date

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-up pb-12">
            {/* Navigation */}
            <Link href="/portal/events" className="inline-flex items-center gap-2 text-cosmic-accent hover:text-cosmic-brand font-bold text-xs uppercase tracking-widest transition-all group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Registry
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-cosmic-brand/10 text-[#1976D2] font-bold text-[10px] uppercase tracking-widest mb-4 border border-[#BBDEFB]">
                            Event Category: {event.type}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-cosmic-black leading-tight">
                            {event.title}
                        </h1>
                    </div>

                    {event.cover_image_url && (
                        <div className="relative rounded-sm overflow-hidden border border-cosmic-accent shadow-sm aspect-video group">
                            <Image
                                src={event.cover_image_url}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                    )}

                    <div className="bg-white rounded-sm p-8 md:p-10 border border-cosmic-accent shadow-sm prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-cosmic-black prose-p:text-cosmic-accent prose-p:font-medium prose-strong:text-cosmic-black prose-a:text-cosmic-brand">
                        <MarkdownRenderer content={event.description || ''} />
                    </div>
                </div>

                {/* Intelligence Sidebar */}
                <div className="space-y-6">
                    <div className="bg-cosmic-brand rounded-sm p-8 text-white shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform" />

                        <h3 className="font-bold text-xl mb-8 flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-cosmic-black" />
                            Event Details
                        </h3>

                        <div className="space-y-6">
                            <IntelRow icon={<Calendar className="h-5 w-5" />} label="Execution Date" value={formatDate(eventDate)} />
                            <IntelRow
                                icon={<Clock className="h-5 w-5" />}
                                label="Time"
                                value={`${new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                            />
                            <IntelRow icon={<MapPin className="h-5 w-5" />} label="Location" value={event.location || 'IIMS College Campus'} />
                            <IntelRow icon={<Users className="h-5 w-5" />} label="Attendees" value={`${attendeeCount || 0} Registered`} />
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/10">
                            {event.meeting_link && (
                                <a
                                    href={event.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-cosmic-black text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-cosmic-dark transition-all hover:scale-[1.02] shadow-sm shadow-black/20"
                                >
                                    Meeting Link <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="bg-cosmic-light rounded-[2rem] p-6 border border-cosmic-accent flex items-center justify-between group cursor-pointer hover:bg-white transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-sm bg-white text-cosmic-brand shadow-sm group-hover:bg-cosmic-dark group-hover:text-white transition-all border border-cosmic-accent group-hover:border-cosmic-brand">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-cosmic-accent text-[10px] font-bold uppercase tracking-widest">Roster</span>
                                <span className="block text-sm font-bold text-cosmic-black">Browse Attendees</span>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-[#BDBDBD] group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function IntelRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 text-cosmic-accent">
                {icon}
            </div>
            <div>
                <span className="block text-[9px] font-bold text-cosmic-accent/80 uppercase tracking-widest mb-1">{label}</span>
                <span className="block text-sm font-bold text-white tracking-wide">{value}</span>
            </div>
        </div>
    )
}
