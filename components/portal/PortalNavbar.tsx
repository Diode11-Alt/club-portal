// components/portal/PortalNavbar.tsx — IIMS IT Club Mobile Topbar (v4.0)
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ShieldCheck, LogOut, LayoutDashboard, MessageSquare, Calendar, FileText, Terminal, User, Bell, Rss, GraduationCap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import Avatar from '@/components/ui/Avatar'
import { BRAND } from '@/lib/brand'
// Import types safely
type Member = any

const NAV_ITEMS = [
    { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portal/feed', label: 'Feed', icon: Rss },
    { href: '/portal/events', label: 'Events', icon: Calendar },
    { href: '/portal/ctf', label: 'CTF Arena', icon: Terminal },
    { href: '/portal/resources', label: 'Documents', icon: FileText },
    { href: '/portal/messages', label: 'Messages', icon: MessageSquare },
    { href: '/portal/notifications', label: 'Notifications', icon: Bell },
    { href: '/portal/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/portal/profile', label: 'Profile', icon: User },
]

export default function PortalNavbar({ member, unreadMessages = 0 }: { member: Member, unreadMessages?: number }) {
    const pathname = usePathname()

    const isAdmin = member.role === 'admin' || member.role === 'superadmin'

    // Minimal top layout: Brand + Profile
    return (
        <>
            {/* Top Navigation Bar */}
            <nav className="md:hidden sticky top-0 z-[60] bg-white border-b border-cosmic-accent shadow-sm">
                <div className="flex items-center justify-between px-5 h-14">
                    <Link href="/portal/dashboard" className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-sm bg-cosmic-brand flex items-center justify-center shadow-inner">
                            <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-cosmic-black text-sm tracking-tight">{BRAND.clubShort}</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link href="/portal/notifications" className={cn(
                            "p-2 rounded-full transition-colors relative",
                            pathname.includes('/notifications') ? "bg-cosmic-light text-cosmic-brand" : "text-cosmic-accent hover:bg-[var(--color-cosmic-light)]"
                        )}>
                            <Bell className="h-5 w-5" />
                        </Link>
                        <Link href="/portal/profile">
                            <Avatar src={member.avatar_url} name={member.name} size="sm" className="ring-2 ring-[#748D92]" />
                        </Link>
                    </div>
                </div>

                {/* Secondary Horizontal Scroll Menu */}
                <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-2 border-t border-[var(--color-cosmic-light)] bg-cosmic-light">
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + '/')
                        // Exclude bottom nav items from top scroll (Dashboard, Feed, Messages, Resources)
                        if (['/portal/dashboard', '/portal/feed', '/portal/messages', '/portal/resources'].includes(href)) return null

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                                    active
                                        ? 'bg-cosmic-brand text-white shadow-sm shadow-[#124E66]/20'
                                        : 'bg-white text-cosmic-accent border border-cosmic-accent'
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </Link>
                        )
                    })}
                    {isAdmin && (
                        <Link href="/portal/admin" className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-cosmic-brand/10 text-cosmic-brand border border-[#FFCDD2] shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5" /> Admin
                        </Link>
                    )}
                </div>
            </nav>

            {/* Sticky Bottom Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-cosmic-accent pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-16 px-2">
                    {[
                        { href: '/portal/dashboard', label: 'Home', icon: LayoutDashboard },
                        { href: '/portal/feed', label: 'Feed', icon: Rss },
                        { href: '/portal/messages', label: 'Chat', icon: MessageSquare },
                        { href: '/portal/resources', label: 'Docs', icon: FileText }
                    ].map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + '/')
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex flex-col items-center justify-center w-16 h-full gap-1 transition-all',
                                    active ? 'text-cosmic-brand' : 'text-cosmic-accent hover:text-cosmic-accent'
                                )}
                            >
                                <div className={cn("p-1.5 rounded-sm transition-all relative", active ? 'bg-cosmic-light' : '')}>
                                    <Icon className={cn("h-5 w-5", active && "fill-[#124E66]/10")} />
                                    {href === '/portal/messages' && unreadMessages > 0 && (
                                        <span className="absolute top-1 right-1 h-2 w-2 bg-cosmic-brand rounded-full ring-2 ring-white"></span>
                                    )}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
