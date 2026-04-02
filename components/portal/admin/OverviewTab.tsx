// components/portal/admin/OverviewTab.tsx — IIMS IT Club Mission Intelligence (v4.0)
'use client'

import { Users, MessageSquare, Calendar, Trophy, FileText, Zap, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function OverviewTab({ data }: { data: any }) {
    const stats = [
        { label: 'Total Members', value: data.members.length, icon: Users, color: 'text-[#1976D2]', bg: 'bg-cosmic-brand/10' },
        { label: 'Feed Posts', value: data.posts.length, icon: MessageSquare, color: 'text-[#5E35B1]', bg: 'bg-[#EDE7F6]' },
        { label: 'Missions Logged', value: data.events.length, icon: Calendar, color: 'text-[#43A047]', bg: 'bg-[#E8F5E9]' },
        { label: 'Arena Challenges', value: data.challenges.length, icon: Trophy, color: 'text-[#F57C00]', bg: 'bg-[#FFF3E0]' },
        { label: 'Archive Documents', value: data.resources.length, icon: FileText, color: 'text-cosmic-brand', bg: 'bg-cosmic-light' },
        { label: 'Pending Approvals', value: data.members.filter((m: any) => m.status === 'pending').length, icon: ShieldCheck, color: 'text-cosmic-brand', bg: 'bg-cosmic-brand/10' },
    ]

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-cosmic-accent shadow-sm hover:shadow-sm hover:border-cosmic-brand/20 transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("p-4 rounded-sm shadow-sm group-hover:scale-110 transition-transform", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                        </div>
                        <span className="block text-[10px] font-bold text-cosmic-accent uppercase tracking-widest mb-1.5">{stat.label}</span>
                        <span className="block text-4xl font-bold text-cosmic-black">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-cosmic-brand rounded-[3rem] p-10 md:p-12 text-white shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:bg-cosmic-black/10 transition-colors duration-1000" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-2xl text-center lg:text-left">
                        <h3 className="text-3xl font-bold mb-4">Administration Active</h3>
                        <p className="text-cosmic-accent font-medium leading-relaxed">
                            Welcome to the ICEHC Portal administration dashboard. You can manage members, view analytics, and control portal content from here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
