// components/portal/ConversationList.tsx — IIMS IT Club Comms List (v4.0)
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import { useParams } from 'next/navigation'
import { cn, formatDate } from '@/lib/utils'
import { MessageSquare, Search, Filter, UserPlus, Loader2 } from 'lucide-react'

interface ConversationListProps {
    conversations: {
        conversation_id: string,
        otherMember: { id: string, name: string, avatar_url: string | null },
        lastMessage: { content: string, created_at: string, isMine: boolean },
        unreadCount: number
    }[],
    currentMemberId: string
}

interface SearchResult {
    id: string
    full_name: string
    avatar_url: string | null
    club_post: string
    role: string
}

export default function ConversationList({ conversations, currentMemberId }: ConversationListProps) {
    const params = useParams()
    const router = useRouter()
    const activeOtherId = params.id as string
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searching, setSearching] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    // Debounced member search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (!query.trim()) {
            setSearchResults([])
            setSearching(false)
            return
        }

        setSearching(true)
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/members/search?q=${encodeURIComponent(query.trim())}`)
                if (res.ok) {
                    const data = await res.json()
                    setSearchResults(data.members || [])
                }
            } catch (err) {
                console.error('Search failed:', err)
            } finally {
                setSearching(false)
            }
        }, 300)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [query])

    function handleSelectMember(memberId: string) {
        setQuery('')
        setSearchResults([])
        router.push(`/portal/messages/${memberId}`)
    }

    // Filter existing conversations by search query
    const filteredConversations = query.trim()
        ? conversations.filter(c =>
            c.otherMember.name.toLowerCase().includes(query.toLowerCase())
        )
        : conversations

    const isSearchMode = query.trim().length > 0

    return (
        <div className="w-full h-full flex flex-col">
            {/* List Header */}
            <div className="p-5 md:p-6 border-b border-cosmic-accent bg-white">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-cosmic-black font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
                        <MessageSquare className="h-4 w-4 text-cosmic-brand" />
                        Direct Messages
                    </h2>
                    <button className="p-2 rounded-sm bg-cosmic-light text-cosmic-accent hover:text-cosmic-brand hover:bg-cosmic-light transition-colors border border-transparent hover:border-cosmic-muted">
                        <Filter className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-accent group-focus-within:text-cosmic-brand transition-colors" />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="w-full bg-[var(--color-cosmic-light)] border border-transparent rounded-sm py-2.5 pl-10 pr-4 text-xs font-semibold focus:bg-white focus:border-cosmic-brand/30 focus:ring-4 focus:ring-cosmic-brand/10 transition-all outline-none text-cosmic-black placeholder:text-cosmic-accent"
                    />
                    {searching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-brand animate-spin" />
                    )}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-cosmic-light/50">
                {/* Search Results — new members to message */}
                {isSearchMode && searchResults.length > 0 && (
                    <div className="border-b border-cosmic-accent">
                        <div className="px-5 pt-4 pb-2">
                            <span className="text-[9px] font-bold text-cosmic-accent uppercase tracking-widest flex items-center gap-1.5">
                                <UserPlus className="h-3 w-3" /> New Conversation
                            </span>
                        </div>
                        {searchResults.map(member => {
                            // Skip if already in conversations
                            const existsInConversations = conversations.some(c => c.otherMember.id === member.id)
                            if (existsInConversations) return null

                            return (
                                <button
                                    key={member.id}
                                    onClick={() => handleSelectMember(member.id)}
                                    className="block w-full p-4 md:p-5 transition-all relative group border-b border-cosmic-accent/50 hover:bg-white border-l-4 border-l-transparent hover:border-l-[#212A31] text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative shrink-0">
                                            <Avatar
                                                src={member.avatar_url}
                                                name={member.full_name}
                                                className="w-11 h-11 md:w-12 md:h-12 ring-2 ring-white shadow-sm"
                                            />
                                            <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-cosmic-black border-2 border-white rounded-full flex items-center justify-center">
                                                <UserPlus className="h-2.5 w-2.5 text-white" />
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-cosmic-black truncate">
                                                {member.full_name}
                                            </h4>
                                            <span className="text-[10px] font-bold text-cosmic-black uppercase tracking-wider">
                                                {member.club_post || 'Member'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Existing Conversations */}
                {isSearchMode && filteredConversations.length > 0 && (
                    <div className="px-5 pt-4 pb-2">
                        <span className="text-[9px] font-bold text-cosmic-accent uppercase tracking-widest">
                            Existing Conversations
                        </span>
                    </div>
                )}

                {(isSearchMode ? filteredConversations : conversations).length > 0 ? (
                    (isSearchMode ? filteredConversations : conversations).map(({ otherMember, lastMessage, unreadCount }) => {
                        const isActive = activeOtherId === otherMember.id

                        return (
                            <Link
                                key={otherMember.id}
                                href={`/portal/messages/${otherMember.id}`}
                                className={cn(
                                    "block p-4 md:p-5 transition-all relative group border-b border-cosmic-accent/50",
                                    isActive
                                        ? "bg-white shadow-sm z-10 scale-[1.01] border-l-4 border-l-[#124E66]"
                                        : "hover:bg-white border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <Avatar
                                            src={otherMember.avatar_url}
                                            name={otherMember.name}
                                            className={cn(
                                                "w-11 h-11 md:w-12 md:h-12 ring-2 transition-all shadow-sm",
                                                isActive ? "ring-cosmic-brand/20" : "ring-white"
                                            )}
                                        />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-cosmic-black border-2 border-white rounded-full flex" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className={cn(
                                                "text-sm font-bold truncate transition-colors",
                                                isActive ? "text-cosmic-brand" : "text-cosmic-black"
                                            )}>
                                                {otherMember.name}
                                            </h4>
                                            <span className="text-[9px] font-bold text-cosmic-accent uppercase tracking-wider shrink-0 ml-2">
                                                {formatDate(lastMessage.created_at)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className={cn(
                                                "text-xs truncate flex-1 leading-snug",
                                                unreadCount > 0 ? "text-cosmic-black font-bold" : "text-cosmic-accent font-medium"
                                            )}>
                                                {lastMessage.isMine && "You: "}{lastMessage.content}
                                            </p>
                                            {unreadCount > 0 && (
                                                <span className="bg-cosmic-black text-white text-[9px] font-bold rounded-md px-1.5 py-0.5 shadow-sm shrink-0">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    !isSearchMode && (
                        <div className="p-10 text-center animate-fade-up flex flex-col items-center justify-center h-full">
                            <div className="w-14 h-14 bg-white rounded-sm flex items-center justify-center mb-5 shadow-sm border border-cosmic-accent">
                                <MessageSquare className="h-6 w-6 text-cosmic-accent" />
                            </div>
                            <p className="text-cosmic-dark font-bold text-sm uppercase tracking-widest">Inbox Zero</p>
                            <p className="text-cosmic-accent text-xs font-medium mt-1">Search for a member to start a conversation.</p>
                        </div>
                    )
                )}

                {isSearchMode && searchResults.length === 0 && filteredConversations.length === 0 && !searching && (
                    <div className="p-10 text-center animate-fade-up flex flex-col items-center justify-center">
                        <div className="w-14 h-14 bg-white rounded-sm flex items-center justify-center mb-5 shadow-sm border border-cosmic-accent">
                            <Search className="h-6 w-6 text-cosmic-accent" />
                        </div>
                        <p className="text-cosmic-dark font-bold text-sm uppercase tracking-widest">No Results</p>
                        <p className="text-cosmic-accent text-xs font-medium mt-1">No members found matching &ldquo;{query}&rdquo;</p>
                    </div>
                )}
            </div>
        </div>
    )
}
