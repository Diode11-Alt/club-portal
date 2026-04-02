import { Suspense } from 'react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Team — ICEHC',
    description: 'Meet the core committee and general members of the IIMS Cybersecurity & Ethical Hacking Club.',
}

export const revalidate = 60

async function CoreCommitteeList() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('members')
        .select('id, full_name, club_post, role, bio, avatar_url, github_url, linkedin_url, skills, display_order')
        .eq('status', 'approved')
        .or('role.eq.bod,club_post.neq.null')
        .order('display_order', { ascending: true })

    if (error) {
        console.error("Error fetching core committee:", error)
    }

    const members = data || []

    if (members.length === 0) {
        return (
            <div className="py-12 text-center border-2 border-dashed border-cosmic-accent rounded-xl bg-white shadow-sm">
                <p className="text-cosmic-accent font-medium">Committee profiles are currently being synced.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
                <div key={member.id} className="bg-white rounded-[2rem] border border-cosmic-accent p-8 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-cosmic-brand/20 transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1">
                    <div className="flex items-start gap-5 mb-6">
                        <div className="relative w-[88px] h-[88px] rounded-full overflow-hidden border-4 border-cosmic-muted shadow-sm group-hover:border-white transition-colors shrink-0 bg-white">
                            {member.avatar_url ? (
                                <Image src={member.avatar_url} alt={member.full_name || 'Member'} fill className="object-cover" sizes="88px" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#D3D9D4] to-[#748D92] flex items-center justify-center text-cosmic-accent font-black text-2xl uppercase">
                                    {(member.full_name || 'M').charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="pt-2">
                            <h3 className="text-xl font-bold text-cosmic-black leading-tight tracking-tight group-hover:text-cosmic-brand transition-colors">{member.full_name || 'Anonymous'}</h3>
                            <p className="text-cosmic-brand font-semibold text-xs uppercase tracking-widest mt-1.5">{member.club_post || 'Officer'}</p>
                        </div>
                    </div>
                    {member.bio && (
                        <p className="text-[#616161] text-sm mb-8 flex-grow leading-relaxed font-medium">{member.bio}</p>
                    )}
                    
                    <div className="mt-auto space-y-5">
                        {member.skills && member.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {member.skills.slice(0, 3).map((skill: string, i: number) => (
                                    <span key={i} className="px-2.5 py-1 bg-cosmic-light text-cosmic-accent text-[11px] font-bold uppercase tracking-wider rounded-sm border border-[#EEEEEE]">
                                        {skill}
                                    </span>
                                ))}
                                {member.skills.length > 3 && (
                                    <span className="px-2.5 py-1 bg-cosmic-light text-cosmic-brand text-[11px] font-bold rounded-sm border border-[#EEEEEE]">
                                        +{member.skills.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        <div className="flex items-center gap-3 pt-5 border-t border-[var(--color-cosmic-light)]">
                            {member.github_url && (
                                <a href={member.github_url} target="_blank" rel="noreferrer" className="text-cosmic-accent hover:text-cosmic-black focus:ring-2 focus:ring-cosmic-black rounded-full p-1 transition-all outline-none">
                                    <Github className="w-5 h-5" />
                                </a>
                            )}
                            {member.linkedin_url && (
                                <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-cosmic-accent hover:text-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2] rounded-full p-1 transition-all outline-none">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

async function GeneralRoster() {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
        .from('members')
        .select('id, full_name, avatar_url, github_url, linkedin_url')
        .eq('status', 'approved')
        .neq('role', 'bod')
        .is('club_post', null)
        .order('full_name', { ascending: true })

    if (error) {
        console.error("Error fetching general roster:", error)
    }

    const members = data || []

    if (members.length === 0) {
        return (
            <div className="py-12 text-center border-2 border-dashed border-cosmic-accent rounded-xl bg-cosmic-light">
                <p className="text-cosmic-accent font-medium">Roster is currently empty.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {members.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl border border-cosmic-muted shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-4 flex items-center gap-4 hover:border-cosmic-accent hover:shadow-md transition-all group">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-cosmic-light shrink-0 border-2 border-white shadow-sm">
                         {member.avatar_url ? (
                            <Image src={member.avatar_url} alt={member.full_name || 'Member'} fill className="object-cover" sizes="48px" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#BDBDBD] font-bold text-sm uppercase">
                                {(member.full_name || 'M').charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-cosmic-black truncate text-sm group-hover:text-cosmic-brand transition-colors">{member.full_name || 'Anonymous'}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-cosmic-accent font-semibold mt-0.5">Member</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                         {member.github_url && (
                            <a href={member.github_url} target="_blank" rel="noreferrer" className="text-[#BDBDBD] hover:text-cosmic-black transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                        {member.linkedin_url && (
                            <a href={member.linkedin_url} target="_blank" rel="noreferrer" className="text-[#BDBDBD] hover:text-[#0A66C2] transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

function RosterCardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] p-8 h-[340px] border border-[#EEEEEE] animate-pulse">
                    <div className="flex gap-5">
                        <div className="w-[88px] h-[88px] bg-cosmic-light rounded-full" />
                        <div className="space-y-3 flex-1 pt-3">
                            <div className="h-5 bg-cosmic-light rounded-md w-3/4" />
                            <div className="h-4 bg-cosmic-light rounded-md w-1/2" />
                        </div>
                    </div>
                    <div className="mt-8 space-y-2">
                        <div className="h-3 bg-cosmic-light rounded-sm" />
                        <div className="h-3 bg-cosmic-light rounded-sm" />
                        <div className="h-3 bg-cosmic-light rounded-sm w-4/5" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-cosmic-light pt-32 pb-24 selection:bg-cosmic-brand selection:text-white">
            <div className="max-w-7xl mx-auto px-6 mb-20 relative z-10">
                <div className="flex items-center gap-3 mb-5">
                    <span className="h-[2px] w-8 bg-cosmic-brand"></span>
                    <span className="text-cosmic-brand font-black text-xs uppercase tracking-[0.2em]">Personnel Directory</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-cosmic-black tracking-tight mb-8">
                    Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#124E66] to-[#E53935]">Syndicate</span>
                </h1>
                <p className="text-cosmic-accent font-medium text-lg md:text-xl leading-relaxed max-w-2xl bg-white/50 p-1 rounded">
                    The operators, researchers, and engineers driving the IIMS Cybersecurity and Ethical Hacking mission forward.
                </p>
            </div>

            <section className="mb-32 relative">
                <div className="absolute top-1/2 left-0 w-full h-[600px] bg-gradient-to-b from-transparent via-[var(--color-cosmic-light)]/50 to-transparent -translate-y-1/2 -z-10 skew-y-3" />
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black text-cosmic-black tracking-tight">
                            Core Committee
                        </h2>
                    </div>
                    <Suspense fallback={<RosterCardSkeleton />}>
                        <CoreCommitteeList />
                    </Suspense>
                </div>
            </section>

            <section className="bg-white border-y border-[#EEEEEE] py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-50 to-transparent opacity-80 block -z-10" />
                
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-black text-cosmic-black mb-10 tracking-tight">
                        General Roster
                    </h2>
                    <Suspense fallback={
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="bg-white border border-[var(--color-cosmic-light)] rounded-2xl p-4 h-[84px] animate-pulse" />
                            ))}
                        </div>
                    }>
                        <GeneralRoster />
                    </Suspense>
                </div>
            </section>
        </div>
    )
}
