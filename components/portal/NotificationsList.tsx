// components/portal/NotificationsList.tsx — IIMS IT Club Alerts (v4.0)
'use client'

import { useState } from 'react'
import { Bell, Check, Info, AlertCircle, MessageSquare, Trophy, Calendar, ShieldCheck, ChevronRight } from 'lucide-react'
import { markNotificationRead, markAllNotificationsRead } from '@/app/portal/(protected)/notifications/actions'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

type Notification = any

export default function NotificationsList({ initialNotifications }: { initialNotifications: Notification[] }) {
    const [notifications, setNotifications] = useState(initialNotifications)

    async function handleMarkRead(id: string) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        await markNotificationRead(id)
    }

    async function handleMarkAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        await markAllNotificationsRead()
        toast.success('All alerts marked as read')
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_message': return <MessageSquare className="h-5 w-5 text-[#1976D2]" />
            case 'ctf_new_challenge': return <Trophy className="h-5 w-5 text-[#F57F17]" />
            case 'event_reminder': return <Calendar className="h-5 w-5 text-[#388E3C]" />
            case 'announcement': return <AlertCircle className="h-5 w-5 text-cosmic-brand" />
            default: return <Info className="h-5 w-5 text-cosmic-accent" />
        }
    }

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex justify-end">
                <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold uppercase tracking-widest text-cosmic-brand hover:text-[#1976D2] transition-colors flex items-center gap-2"
                >
                    <Check className="h-4 w-4" /> Finalize All Alerts
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                            className={cn(
                                "group relative p-6 rounded-sm border transition-all cursor-pointer flex gap-5 items-center",
                                notification.is_read
                                    ? "bg-white border-[#EEEEEE] opacity-70"
                                    : "bg-white border-cosmic-accent shadow-sm shadow-black/5 hover:border-cosmic-brand/20"
                            )}
                        >
                            <div className={cn(
                                "p-3 md:p-4 rounded-sm flex-shrink-0 transition-transform group-hover:scale-105 border",
                                notification.is_read ? "bg-cosmic-light border-[#EEEEEE]" : "bg-cosmic-light shadow-sm border-cosmic-accent"
                            )}>
                                {getIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                                    <h4 className={cn(
                                        "text-sm font-bold truncate",
                                        notification.is_read ? "text-cosmic-accent" : "text-cosmic-black"
                                    )}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest flex flex-shrink-0 items-center gap-1">
                                        {formatDate(notification.created_at)}
                                    </span>
                                </div>
                                <p className="text-cosmic-accent font-medium text-sm line-clamp-1">{notification.body}</p>

                                {/* Simplified Link Handling */}
                                {notification.link && (
                                    <Link
                                        href={notification.link}
                                        className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cosmic-brand hover:text-cosmic-black transition-all group/link"
                                    >
                                        View Details <ChevronRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>

                            {!notification.is_read && (
                                <div className="h-2.5 w-2.5 rounded-full bg-cosmic-black shadow-sm flex-shrink-0 ml-2" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-24 rounded-sm border border-dashed border-cosmic-accent bg-cosmic-light text-center shadow-sm">
                        <div className="h-16 w-16 bg-white rounded-sm flex items-center justify-center mx-auto mb-5 border border-cosmic-accent">
                            <Bell className="h-8 w-8 text-[#BDBDBD]" />
                        </div>
                        <p className="text-cosmic-dark font-bold text-lg uppercase tracking-widest">Inbox Zero</p>
                        <p className="text-cosmic-accent mt-1 font-medium text-sm">No active alerts detected.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
