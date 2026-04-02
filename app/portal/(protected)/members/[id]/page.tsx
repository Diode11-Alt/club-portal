// app/portal/members/[id]/page.tsx — IIMS IT Club Member View
import { createServerClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { Mail, Github, Linkedin, Calendar, ShieldCheck, Trophy, Target, Zap, MessageSquare, MapPin, Terminal, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import EndorseSkillButton from '@/components/portal/profile/EndorseSkillButton'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'

type Member = any



export default async function MemberViewPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const { id } = params

    const session = await getSession()
    if (!session) redirect('/portal/login')

    // If viewing own profile, redirect to the editable central dossier
    if (session.user.id === id) {
        redirect('/portal/profile')
    }

    const supabase = createServerClient()

    const { data } = await supabase
        .from('members')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()

    const member = data
    if (!member) return notFound()

    // Get rank for profile display
    const { count: rankCount } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .gt('points', member.points || 0)

    const userRank = (rankCount || 0) + 1

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-fade-up">
            <Link href="/portal/dashboard" className="inline-flex items-center gap-2 text-cosmic-accent hover:text-cosmic-brand font-bold text-xs uppercase tracking-widest transition-all group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Directory
            </Link>

            {/* Dossier Header */}
            <section className="relative bg-cosmic-brand rounded-[3rem] p-10 md:p-14 text-white shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-black/10 rounded-full blur-3xl -translate-y-48 translate-x-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-32 -translate-x-32" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-10 lg:gap-14 text-center lg:text-left">
                    <div className="relative group/avatar">
                        <div className="p-2 bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/20 transition-transform group-hover/avatar:scale-105 shadow-sm">
                            <Avatar
                                src={member.avatar_url}
                                name={member.full_name || member.email}
                                className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] border-4 border-cosmic-brand shadow-sm"
                            />
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-cosmic-black text-white rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-sm shadow-black/20 whitespace-nowrap">
                            Points Level {Math.floor((member.points || 0) / 100) + 1}
                        </div>
                    </div>

                    <div className="flex-1 space-y-5">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest border border-white/20 shadow-sm backdrop-blur-sm">
                                <ShieldCheck className="h-3.5 w-3.5 text-cosmic-black" /> Student ID: {member.student_id || 'Not Provided'}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {member.full_name || member.email}
                            </h1>
                            <p className="text-[#FFEBEE] font-semibold text-lg max-w-lg opacity-90">
                                {member.club_post || (member.role?.toUpperCase())}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                            <span className="px-4 py-2 rounded-sm bg-cosmic-brand/50 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-cosmic-brand/50 backdrop-blur-sm">
                                <Calendar className="h-4 w-4 opacity-70" /> Joined {member.created_at ? new Date(member.created_at).getFullYear() : new Date().getFullYear()}
                            </span>
                            <span className="px-4 py-2 rounded-sm bg-cosmic-brand/50 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-cosmic-brand/50 backdrop-blur-sm">
                                <MapPin className="h-4 w-4 opacity-70" /> IIMS Campus
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 bg-[#7F0000]/40 p-8 rounded-sm backdrop-blur-md border border-white/10 min-w-[280px]">
                        <div className="text-center">
                            <span className="block text-[10px] font-bold text-[#EF9A9A] uppercase tracking-widest mb-2">Total Score</span>
                            <span className="block text-4xl font-bold text-white">{member.points}</span>
                            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Points</span>
                        </div>
                        <div className="w-px h-16 bg-white/10 self-center" />
                        <div className="text-center">
                            <span className="block text-[10px] font-bold text-[#EF9A9A] uppercase tracking-widest mb-2">Club Rank</span>
                            <span className="block text-4xl font-bold text-cosmic-black">#{userRank}</span>
                            <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Global</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                <div className="lg:col-span-2 space-y-8 md:space-y-10">
                    {/* Bio Section */}
                    <div className="bg-white rounded-[2rem] p-10 md:p-12 border border-cosmic-accent shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                            <Target className="h-40 w-40 text-cosmic-brand" />
                        </div>
                        <h3 className="text-sm font-bold text-cosmic-brand uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Terminal className="h-5 w-5 pt-0.5" /> Biography
                        </h3>
                        <p className="text-cosmic-accent font-medium text-lg leading-relaxed whitespace-pre-wrap relative z-10">
                            {member.bio || 'This member has not provided a biography yet.'}
                        </p>
                    </div>

                    {/* Skills Matrix */}
                    <div className="bg-white rounded-[2rem] p-10 border border-cosmic-accent shadow-sm">
                        <h3 className="text-sm font-bold text-cosmic-brand uppercase tracking-widest mb-8 flex items-center gap-3">
                            <Zap className="h-5 w-5" /> Technical Expertise
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {member.skills && member.skills.length > 0 ? (
                                member.skills.map((skill: string) => (
                                    <EndorseSkillButton
                                        key={skill}
                                        targetUserId={member.id}
                                        currentUserId={session.user.id}
                                        endorsements={[]}
                                        skill={skill}
                                    />
                                ))
                            ) : (
                                <div className="py-12 text-center w-full bg-cosmic-light rounded-sm border border-dashed border-cosmic-accent">
                                    <p className="text-cosmic-accent font-bold text-[10px] uppercase tracking-widest">No Technical Expertise Logged</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Intel */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-cosmic-accent shadow-sm space-y-10">
                        <h3 className="text-xs font-bold text-cosmic-brand uppercase tracking-widest mb-2">Contact Info</h3>

                        <div className="space-y-6">
                            <ContactRow icon={<Mail className="h-5 w-5" />} label="Email Address" value={member.email} />
                            <ContactRow
                                icon={<Github className="h-5 w-5" />}
                                label="GitHub Profile"
                                value={member.github_url ? new URL(member.github_url).pathname.split('/').pop() || 'Linked' : 'Not Linked'}
                                link={member.github_url}
                            />
                            <ContactRow
                                icon={<Linkedin className="h-5 w-5" />}
                                label="LinkedIn"
                                value={member.linkedin_url ? new URL(member.linkedin_url).pathname.split('/').pop() || 'Linked' : 'Not Linked'}
                                link={member.linkedin_url}
                            />
                        </div>

                        <div className="pt-8 border-t border-cosmic-accent">
                            <Link href={`/portal/messages/${member.id}`} className="bg-cosmic-brand rounded-sm p-5 flex items-center justify-between group cursor-pointer hover:bg-cosmic-dark transition-all shadow-sm shadow-[#124E66]/20">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-sm text-white">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-white mt-0.5">Send Message</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-cosmic-light border border-cosmic-accent rounded-[2rem] p-8 md:p-10 text-cosmic-black shadow-sm group cursor-pointer hover:border-cosmic-brand/30 transition-all relative overflow-hidden">
                        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Trophy className="h-32 w-32" />
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-cosmic-light text-cosmic-brand rounded-sm">
                                <Trophy className="h-6 w-6" />
                            </div>
                            <h4 className="font-bold text-lg leading-tight relative z-10">Achievements</h4>
                        </div>
                        <p className="text-cosmic-accent text-sm font-medium leading-relaxed relative z-10">View tournament certificates, CTF writeup awards, and special honors.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContactRow({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: string; link?: string }) {
    const content = (
        <div className="flex items-center gap-4 transition-transform hover:translate-x-1">
            <div className="p-3 bg-cosmic-light rounded-sm text-cosmic-accent group-hover:text-cosmic-black group-hover:bg-cosmic-brand/10 transition-colors border border-cosmic-accent group-hover:border-[#FFCDD2]">
                {icon}
            </div>
            <div className="min-w-0">
                <span className="block text-[8px] font-bold text-cosmic-accent uppercase tracking-widest mb-0.5">{label}</span>
                <span className={cn(
                    "block text-sm font-bold truncate transition-colors",
                    link ? "text-cosmic-brand group-hover:text-cosmic-black" : "text-cosmic-accent italic"
                )}>
                    {value}
                </span>
            </div>
        </div>
    )

    if (link) return <a href={link} target="_blank" className="block group w-full">{content}</a>
    return <div className="block w-full">{content}</div>
}
