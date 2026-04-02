// components/public/HeroSection.tsx — IIMS IT Club Hero (v4.0)
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { BRAND } from '@/lib/brand'
import dynamic from 'next/dynamic'

const HeroTerminal = dynamic(() => import('@/components/public/HeroTerminal'), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-[#0D1117] animate-pulse rounded-xl border border-[#30363D]" />
})

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#124E66] via-[#124E66] to-[#7F0000]">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            {/* Gradient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FFD54F]/15 rounded-full blur-[120px] pointer-events-none transform-gpu" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
                <div className="lg:col-span-3">
                    <p className="text-white/60 uppercase tracking-[0.2em] text-xs font-semibold mb-5">IIMS COLLEGE · KATHMANDU · EST. 2026</p>
                    <h1 className="font-bold text-5xl md:text-7xl tracking-tight text-white leading-[1.05]">
                        Hack Ethically.<br />Defend Relentlessly.
                    </h1>
                    <p className="text-white/70 text-lg md:text-xl max-w-2xl mt-6 mb-10 leading-relaxed font-medium">
                        Official cybersecurity club of IIMS College. We bridge the gap between theoretical CS and real-world defense — one challenge at a time.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                        <Link
                            href="/portal/login"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-cosmic-brand font-bold text-base hover:bg-[#FFD54F] hover:text-[#7F0000] transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl shadow-red-900/30 active:scale-95"
                        >
                            Join ICEHC
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                        >
                            Learn More
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
                        <HeroStat value="9" label="Founding Members" />
                        <HeroStat value="6" label="Monthly Events" />
                        <HeroStat value="CTF" label="Competitions" />
                        <HeroStat value="BCS 2026" label="Intake" />
                    </div>
                </div>

                <div className="lg:col-span-2 bg-[#0D1117] border border-[#30363D] rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="h-3 w-3 rounded-full bg-yellow-400" />
                        <span className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="ml-2 text-[#8B949E] text-xs font-mono">icehc@iims:~$</span>
                    </div>
                    <HeroTerminal />
                </div>
            </div>
        </section>
    )
}

function HeroStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="bg-white/8 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
            <div className="font-bold text-2xl text-white mb-1 font-mono">{value}</div>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-widest">{label}</div>
        </div>
    )
}
