import Link from 'next/link'
import type { Metadata } from 'next'
import { BRAND } from '@/lib/brand'

export const metadata: Metadata = {
    title: 'About — ICEHC',
    description: 'Official vision, objectives, committee, and sustainability plan of ICEHC at IIMS College.',
}

const OBJECTIVES = [
    {
        title: 'Practical Skill Development',
        desc: 'To move beyond theory by providing hands-on training in industry-standard tools (e.g., Kali Linux, Burp Suite, Wireshark) and methodologies (Penetration Testing, Network Defence).',
    },
    {
        title: 'Ethical Hacking Awareness',
        desc: 'To promote "White Hat" hacking principles and educate the student body on digital hygiene, phishing defence, and scam prevention.',
    },
    {
        title: 'Career Readiness',
        desc: 'To prepare members for professional certifications and cybersecurity careers through Capture The Flag (CTF) competitions and expert guest sessions.',
    },
    {
        title: 'Innovation & Research',
        desc: 'To encourage students to build and test their own security tools and research papers on emerging vulnerabilities.',
    },
]

const SUSTAINABILITY = [
    { title: 'Knowledge Transfer', desc: 'Mentorship pipeline — 2nd and 3rd-year students train 1st-year members in specific tools and workflows.' },
    { title: 'Documentation', desc: 'Club wiki documenting every workshop, session, resource, and CTF writeup for future members.' },
    { title: 'Faculty Integration', desc: 'Club activities integrated with the IIMS academic calendar for maximum student participation.' },
]

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            {/* Header Section */}
            <div className="max-w-4xl mx-auto px-6 mb-16">
                <div className="border-l-4 border-cosmic-brand pl-6 py-2 content-start">
                    <h1 className="text-4xl md:text-5xl font-bold text-cosmic-brand mb-4 tracking-tight">About the Club</h1>
                    <p className="text-[#4A4A4A] text-lg leading-relaxed">
                        Dedicated to advancing cybersecurity education and ethical hacking practices at IIMS College.
                    </p>
                </div>
            </div>

            {/* Vision Statement */}
            <section className="bg-cosmic-light border-y border-cosmic-accent py-20 mb-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-sm font-bold text-cosmic-brand tracking-widest uppercase mb-6">Our Vision</h2>
                    <p className="text-2xl md:text-3xl text-cosmic-brand font-medium leading-relaxed tracking-tight">
                        "To establish IIMS College as a premier hub for cybersecurity excellence in Nepal. We envision a community where students bridge the gap between theoretical computer science and real-world defense strategies, fostering a culture of ethical responsibility, digital safety, and proactive threat mitigation."
                    </p>
                </div>
            </section>

            {/* Objectives */}
            <section className="max-w-4xl mx-auto px-6 mb-24">
                <h2 className="text-2xl font-bold text-cosmic-brand mb-8 pb-4 border-b border-cosmic-accent">Core Objectives</h2>
                <div className="space-y-4">
                    {OBJECTIVES.map((obj, index) => (
                        <div key={index} className="flex flex-col md:flex-row gap-4 md:gap-8 p-6 bg-white border border-cosmic-accent group hover:border-[#4A4A4A] transition-colors">
                            <div className="text-3xl font-bold text-[var(--color-cosmic-light)] group-hover:text-cosmic-accent transition-colors min-w-[3rem]">
                                {(index + 1).toString().padStart(2, '0')}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-cosmic-brand mb-2">{obj.title}</h3>
                                <p className="text-[#4A4A4A] leading-relaxed">{obj.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 6-Month Timeline */}
            <section className="max-w-4xl mx-auto px-6 mb-24">
                <h2 className="text-2xl font-bold text-cosmic-brand mb-8 pb-4 border-b border-cosmic-accent">6-Month Roadmap</h2>
                <div className="border-l-2 border-cosmic-accent ml-3 md:ml-4 space-y-10 py-4">
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-cosmic-brand ring-4 ring-white"></div>
                        <h3 className="font-bold text-cosmic-brand mb-1">Month 1: Foundation</h3>
                        <p className="text-[#4A4A4A] text-sm">Committee formation, official charter, and first general meeting.</p>
                    </div>
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-cosmic-brand ring-4 ring-white"></div>
                        <h3 className="font-bold text-cosmic-brand mb-1">Month 2-3: Core Workshops</h3>
                        <p className="text-[#4A4A4A] text-sm">Intro to Linux, Networking Basics, and initial Web Vulnerability sessions.</p>
                    </div>
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-cosmic-brand ring-4 ring-white"></div>
                        <h3 className="font-bold text-cosmic-brand mb-1">Month 4-5: Advanced Concepts</h3>
                        <p className="text-[#4A4A4A] text-sm">CTF practice, cryptography, and guest lectures from industry professionals.</p>
                    </div>
                    <div className="relative pl-8 md:pl-12">
                        <div className="absolute left-[-4px] top-1.5 w-2 h-2 bg-cosmic-brand ring-4 ring-white"></div> {/* Square marker for milestone */}
                        <h3 className="font-bold text-cosmic-brand mb-1">Month 6: IIMS Intra-College CTF</h3>
                        <p className="text-[#4A4A4A] text-sm font-medium">Flagship event testing members' skills in a competitive environment.</p>
                    </div>
                </div>
            </section>

            {/* Sustainability */}
            <section className="bg-cosmic-light border-y border-cosmic-accent py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-cosmic-brand mb-4">Sustainability Plan</h2>
                        <p className="text-[#4A4A4A]">Ensuring long-term impact and continuous growth.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {SUSTAINABILITY.map((item, index) => (
                            <div key={index} className="bg-white p-8 border border-cosmic-accent">
                                <h3 className="text-lg font-bold text-cosmic-brand mb-3 pb-3 border-b border-[var(--color-cosmic-light)]">{item.title}</h3>
                                <p className="text-[#4A4A4A] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join CTA */}
            <section className="py-20 text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-cosmic-brand mb-6">Ready to get involved?</h2>
                    <Link
                        href="/join"
                        className="inline-block px-8 py-3 bg-cosmic-brand text-white font-bold text-sm tracking-wide rounded-sm hover:bg-cosmic-dark transition-colors"
                    >
                        Join ICEHC Today
                    </Link>
                </div>
            </section>
        </div>
    )
}
