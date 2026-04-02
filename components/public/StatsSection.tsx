// components/public/StatsSection.tsx — IIMS IT Club Light Stats (v4.0)
import { Users, Calendar, Shield, Code2 } from 'lucide-react'

export default function StatsSection() {
    return (
        <section className="py-16 bg-cosmic-light border-y border-cosmic-accent">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Users className="h-6 w-6 text-cosmic-black" />}
                        value="120+"
                        label="Active Members"
                    />
                    <StatCard
                        icon={<Calendar className="h-6 w-6 text-cosmic-black" />}
                        value="30+"
                        label="Events Hosted"
                    />
                    <StatCard
                        icon={<Shield className="h-6 w-6 text-cosmic-black" />}
                        value="50+"
                        label="CTF Solves"
                    />
                    <StatCard
                        icon={<Code2 className="h-6 w-6 text-cosmic-black" />}
                        value="5+"
                        label="Years Active"
                    />
                </div>
            </div>
        </section>
    )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="bg-white border border-cosmic-accent rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-cosmic-brand/20 transition-all duration-200 group">
            <div className="flex justify-center mb-3">
                {icon}
            </div>
            <div className="font-bold text-4xl text-cosmic-brand mb-1 group-hover:text-cosmic-black transition-colors">
                {value}
            </div>
            <div className="text-cosmic-accent text-xs font-semibold uppercase tracking-widest">
                {label}
            </div>
        </div>
    )
}
