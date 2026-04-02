// components/public/DomainsSection.tsx — IIMS College Programs/Pillars
import { BookOpen, Monitor, Briefcase, FlaskConical, Globe, Shield, ArrowRight } from 'lucide-react'

const PROGRAMS = [
    { id: 'bba', title: 'Business Administration', icon: Briefcase, desc: 'Develop strategic thinking, leadership, and management skills for the modern business world.', color: 'bg-blue-500' },
    { id: 'bit', title: 'Information Technology', icon: Monitor, desc: 'Master cutting-edge technologies in software development, networking, and systems design.', color: 'bg-purple-500' },
    { id: 'csit', title: 'Computer Science', icon: Globe, desc: 'Deep dive into algorithms, data structures, AI, and computational theory.', color: 'bg-emerald-500' },
    { id: 'cyber', title: 'Cybersecurity', icon: Shield, desc: 'Learn to protect critical digital infrastructure through ethical hacking and security research.', color: 'bg-red-500' },
    { id: 'mba', title: 'MBA Program', icon: BookOpen, desc: 'Advanced strategic management and entrepreneurial leadership for working professionals.', color: 'bg-amber-500' },
    { id: 'research', title: 'Research & Innovation', icon: FlaskConical, desc: 'Collaborate on groundbreaking research projects with faculty and industry partners.', color: 'bg-indigo-500' },
]

export default function DomainsSection() {
    return (
        <section className="py-24 bg-[var(--color-cosmic-light)]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-cosmic-brand text-xs font-bold uppercase tracking-widest mb-4 block">Academic Excellence</span>
                        <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#1A1A2E] mb-4">
                            Our <span className="text-cosmic-brand">Programs</span>
                        </h2>
                        <p className="text-[#444444] text-lg font-medium leading-relaxed">
                            Designed to equip students with the knowledge and skills needed to excel in today's competitive landscape.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="h-1 w-24 bg-[#F4C542] rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PROGRAMS.map((program, index) => (
                        <div
                            key={program.id}
                            className="group relative p-8 rounded-xl bg-white border border-[#EEEEEE] hover:border-cosmic-brand/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`p-3.5 rounded-xl ${program.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                                    <program.icon className="h-6 w-6" />
                                </div>
                                <span className="font-poppins font-black text-4xl text-gray-100 group-hover:text-cosmic-brand/10 transition-colors leading-none select-none">
                                    0{index + 1}
                                </span>
                            </div>

                            <h3 className="font-poppins font-bold text-xl text-[#1A1A2E] mb-3 group-hover:text-cosmic-brand transition-colors">
                                {program.title}
                            </h3>
                            <p className="text-[#666666] text-sm leading-relaxed mb-6 flex-1">
                                {program.desc}
                            </p>

                            <div className="pt-4 border-t border-[var(--color-cosmic-light)] flex items-center gap-2 text-sm font-bold text-cosmic-brand opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                Read More
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
