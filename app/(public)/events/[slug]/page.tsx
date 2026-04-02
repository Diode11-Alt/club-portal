// app/(public)/events/[slug]/page.tsx — IIMS Collegiate Public Event Detail
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import Image from 'next/image'
// Import types safely
type PublicEvent = any

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const { slug } = params
    const sb = await createServerSupabaseClient()

    // Improved lookup: try slug first, then ID
    let event: PublicEvent | null = null

    // Using verified table name 'public_events'
    const { data: bySlug } = await sb.from('public_events').select('*').eq('slug', slug).maybeSingle()
    if (bySlug) {
        event = bySlug as unknown as PublicEvent
    } else {
        const { data: byId } = await sb.from('public_events').select('*').eq('id', slug).maybeSingle()
        event = byId as unknown as PublicEvent
    }

    if (!event) return notFound()

    const isWorkshop = (event.type || '').toLowerCase().includes('workshop')
    const typeStyles = isWorkshop
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
        : 'bg-blue-50 text-blue-700 border-blue-100'
    const imgUrl = event.image_url
    const eventDate = event.event_date || ''

    return (
        <div className="bg-white min-h-screen">
            {/* Hero / Header */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                {imgUrl ? (
                    <Image src={imgUrl} alt={event.title} fill unoptimized className="object-cover" />
                ) : (
                    <div className="absolute inset-0 hero-grid opacity-10 bg-[#58151C]/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-[#58151C] hover:text-[#C3161C] mb-8 transition-colors font-bold text-sm group"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Mission Log
                        </Link>

                        <div className={`inline-block px-4 py-1.5 mb-6 rounded-xl border text-xs font-black uppercase tracking-widest shadow-sm ${typeStyles}`}>
                            {event.type}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-poppins font-bold text-[#111827] max-w-4xl leading-tight">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12 animate-fade-up">
                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-poppins prose-headings:font-bold prose-headings:text-[#111827] prose-p:text-[#4B5563] prose-a:text-[#C3161C] prose-strong:text-[#111827]">
                        <MarkdownRenderer content={event.description || event.short_desc || ''} />
                    </div>
                </div>

                {/* Sidebar / Info Panel */}
                <div className="space-y-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                    <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-xl lg:sticky lg:top-32">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                            <ShieldCheck className="h-6 w-6 text-[#C3161C]" />
                            <h3 className="font-poppins font-bold text-[#111827] text-xl">
                                Mission Intel
                            </h3>
                        </div>

                        <div className="space-y-6 mb-10">
                            <InfoRow icon={<Calendar className="h-5 w-5" />} label="Event Date" value={formatDate(eventDate)} />
                            <InfoRow
                                icon={<Clock className="h-5 w-5" />}
                                label="Scheduled Time"
                                value={new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                            />
                            <InfoRow icon={<MapPin className="h-5 w-5" />} label="Location" value={event.location || 'IIMS College Campus'} />
                            {event.max_attendees && (
                                <InfoRow icon={<Users className="h-5 w-5" />} label="Availability" value={`${event.max_attendees} Operatives Max`} />
                            )}
                        </div>

                        <div className="pt-2">
                            {new Date(eventDate) > new Date() ? (
                                event.meeting_link ? (
                                    <a
                                        href={event.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#C3161C] text-white font-bold rounded-2xl hover:bg-[#A31217] transition-all shadow-lg shadow-red-100 hover:scale-[1.02] active:scale-95"
                                    >
                                        Launch Mission <ExternalLink className="h-4 w-4" />
                                    </a>
                                ) : (
                                    <Link
                                        href="/portal/login"
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-[#58151C] text-white font-bold rounded-2xl hover:bg-[#431015] transition-all shadow-lg active:scale-95"
                                    >
                                        Register for Mission
                                        <ChevronRight className="h-5 w-5" />
                                    </Link>
                                )
                            ) : (
                                <div className="w-full py-4 bg-gray-200 text-gray-500 font-bold rounded-2xl text-center cursor-not-allowed">
                                    Mission Concluded
                                </div>
                            )}
                        </div>

                        <p className="mt-6 text-center text-xs text-gray-400 font-medium">
                            Join the portal to track your points and participation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4 group">
            <div className="mt-1 p-2 rounded-lg bg-white text-[#C3161C] shadow-sm group-hover:bg-[#C3161C] group-hover:text-white transition-all">
                {icon}
            </div>
            <div>
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</span>
                <span className="block text-sm font-bold text-[#111827]">{value}</span>
            </div>
        </div>
    )
}
