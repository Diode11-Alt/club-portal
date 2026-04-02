// components/portal/admin/AdminSidebar.tsx — IIMS IT Club Admin Nav (v4.0)
'use client'

import {
    Users,
    MessageSquare,
    FileText,
    Calendar,
    Trophy,
    LayoutDashboard,
    ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AdminTab = 'overview' | 'members' | 'posts' | 'events' | 'ctf' | 'documents' | 'audit'

interface AdminSidebarProps {
    activeTab: AdminTab
    onTabChange: (tab: AdminTab) => void
    currentUser?: { id: string; role: string; club_post?: string | null }
}

export default function AdminSidebar({ activeTab, onTabChange, currentUser }: AdminSidebarProps) {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'members', label: 'Members', icon: Users },
        { id: 'posts', label: 'Posts', icon: MessageSquare },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'ctf', label: 'CTF Arena', icon: Trophy },
        { id: 'documents', label: 'Documents', icon: FileText },
    ]

    if (currentUser?.role === 'superadmin') {
        tabs.push({ id: 'audit', label: 'Audit Logs', icon: ShieldAlert })
    }

    return (
        <aside className="w-72 bg-cosmic-brand h-[calc(100vh-64px)] overflow-y-auto hidden lg:flex flex-col border-r border-cosmic-brand shadow-sm z-40">
            <div className="p-8">
                <div className="flex items-center gap-3 px-4 py-3 rounded-sm bg-cosmic-black/10 border border-cosmic-black/20 mb-8 backdrop-blur-sm">
                    <ShieldAlert className="h-5 w-5 text-cosmic-black" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Admin Panel</span>
                </div>

                <nav className="space-y-1.5">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id as AdminTab)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-5 py-4 rounded-sm text-sm transition-all group relative",
                                    active
                                        ? "bg-white text-cosmic-brand font-bold shadow-sm shadow-black/10 translate-x-1"
                                        : "text-cosmic-accent font-medium hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <tab.icon className={cn("h-5 w-5 transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
                                <span className="flex-1 text-left">{tab.label}</span>
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cosmic-black rounded-r-full" />
                                )}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-white/5 bg-[#7F0000]/40 backdrop-blur-sm">
                <p className="text-[8px] font-bold text-[#EF9A9A]/60 uppercase tracking-widest leading-relaxed">
                    ICEHC Portal <br /> Administration
                </p>
            </div>
        </aside>
    )
}
