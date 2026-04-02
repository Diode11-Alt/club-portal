// components/public/TeamSection.tsx — IIMS IT Club Team Section (v4.0)
import Avatar from '@/components/ui/Avatar'
// Import types safely
type TeamMember = any
import { Users, Star } from 'lucide-react'

export default function TeamSection({ team }: { team: TeamMember[] }) {
    if (team.length === 0) return null

    return (
        <section className="py-24 bg-cosmic-light">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 animate-fade-up">
                    <span className="text-cosmic-black text-xs font-semibold uppercase tracking-widest mb-4 block">Our People</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-cosmic-black mb-4">
                        Meet the <span className="text-cosmic-brand">Team</span>
                    </h2>
                    <p className="text-cosmic-accent max-w-xl mx-auto text-lg leading-relaxed">
                        Passionate student leaders and cybersecurity enthusiasts driving ICEHC forward.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {team.map((member) => (
                        <div key={member.id} className="group text-center animate-fade-up">
                            <div className="relative inline-block mb-5">
                                <div className="relative">
                                    <Avatar
                                        src={member.image_url}
                                        name={member.name}
                                        size="lg"
                                        className="w-28 h-28 md:w-36 md:h-36 mx-auto ring-4 ring-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
                                    />
                                    {(member.club_post?.toLowerCase().includes('lead') || member.club_post?.toLowerCase().includes('president')) && (
                                        <div className="absolute -top-1 -right-1 bg-[#F4C542] p-1.5 rounded-lg shadow-md">
                                            <Star className="h-3.5 w-3.5 text-[#1A1A2E]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="font-bold text-lg text-cosmic-black group-hover:text-cosmic-black transition-colors mb-1">
                                {member.name}
                            </h3>
                            <p className="text-cosmic-accent text-xs font-semibold tracking-wider uppercase">
                                {member.club_post || member.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
