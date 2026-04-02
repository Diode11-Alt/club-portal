'use client'

import { useParams } from 'next/navigation'
import ConversationList from '@/components/portal/ConversationList'
import { cn } from '@/lib/utils'

interface MessagesShellProps {
    conversations: any[]
    memberId: string
    children: React.ReactNode
}

export default function MessagesShell({ conversations, memberId, children }: MessagesShellProps) {
    const params = useParams()
    const activeChatId = params.id as string

    return (
        <div className="flex bg-white rounded-sm border border-cosmic-accent overflow-hidden h-[calc(100vh-140px)] animate-fade-up">
            {/* Sidebar / Conversation List */}
            <div className={cn(
                "flex-col border-r border-cosmic-accent bg-cosmic-light shrink-0",
                "w-full lg:w-80",
                activeChatId ? "hidden lg:flex" : "flex"
            )}>
                <ConversationList
                    conversations={conversations}
                    currentMemberId={memberId}
                />
            </div>

            {/* Chat Content / Placeholder */}
            <div className={cn(
                "bg-white relative flex-col min-w-0 flex-1",
                !activeChatId ? "hidden lg:flex" : "flex"
            )}>
                {children}
            </div>
        </div>
    )
}
