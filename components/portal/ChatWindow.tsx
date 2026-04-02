// components/portal/ChatWindow.tsx — IIMS IT Club Chat Interface (v4.0)
'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, MoreVertical, ShieldCheck, ChevronDown, CheckCheck, Lock, Paperclip, FileText, Download } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from '@/app/portal/(protected)/messages/actions'
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'

interface ChatWindowProps {
    initialMessages: any[]
    currentUser: any
    otherUser: any
    conversationId: string | null
}

export default function ChatWindow({ initialMessages, currentUser, otherUser, conversationId }: ChatWindowProps) {
    const [messages, setMessages] = useState<any[]>(initialMessages)
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [attachment, setAttachment] = useState<{ url: string, type: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const supabase = createClient()

    useEffect(() => {
        // Only Subscribe if there's an established conversation channel
        if (!conversationId) return

        const channel = supabase
            .channel(`member-chat:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const newMsg = payload.new
                // Prevent duplicate processing if it's our own optimistic message
                if (newMsg.sender_id !== currentUser.id) {
                    setMessages(prev => [...prev, newMsg])
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId, currentUser.id])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function scrollToBottom() {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if ((!input.trim() && !attachment) || sending || uploading) return

        const content = input
        const currentAttachment = attachment

        setInput('')
        setAttachment(null)
        setSending(true)

        // Optimistic update
        const tempId = crypto.randomUUID()
        const optimisticMsg = {
            id: tempId,
            content: content || 'File transmission',
            attachment_url: currentAttachment?.url || null,
            attachment_type: currentAttachment?.type || null,
            sender_id: currentUser.id,
            conversation_id: conversationId,
            created_at: new Date().toISOString(),
            is_deleted: false,
        }

        setMessages(prev => [...prev, optimisticMsg])

        // Server Action
        const res = await sendMessage(otherUser.id, content, currentAttachment?.url || undefined, currentAttachment?.type || undefined)
        setSending(false)

        if (res?.error) {
            // Rollback optimistic message upon hard failure
            setMessages(prev => prev.filter(m => m.id !== tempId))
            console.error('Transmission failed:', res.error)
        }
    }

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 10 * 1024 * 1024) {
            alert('File exceeds 10MB limit')
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/messages/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')

            setAttachment({ url: data.url, type: data.type })
        } catch (err: any) {
            console.error('File upload err:', err)
            alert(err.message || 'Upload failed')
        } finally {
            setUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Dynamic Header */}
            <header className="h-[72px] md:h-20 flex items-center justify-between px-6 md:px-8 border-b border-cosmic-accent bg-white/90 backdrop-blur-md sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/portal/messages" className="lg:hidden p-2 -ml-2 text-cosmic-accent hover:bg-[var(--color-cosmic-light)] rounded-sm">
                        <ChevronDown className="h-5 w-5 rotate-90" />
                    </Link>
                    <div className="relative">
                        <Avatar src={otherUser.avatar_url} name={otherUser.name} size="md" className="ring-2 ring-[#D3D9D4] shadow-sm" />
                        <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-[#4CAF50] border-2 border-white rounded-full" />
                    </div>
                    <div>
                        <h3 className="text-cosmic-black font-bold text-sm leading-none flex items-center gap-2">
                            {otherUser.name}
                            {['admin', 'superadmin'].includes(otherUser.role) && (
                                <ShieldCheck className="h-4 w-4 text-cosmic-brand" />
                            )}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-cosmic-accent mt-1.5 block">
                            {otherUser.club_post || 'Member'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-sm text-cosmic-accent hover:text-cosmic-brand hover:bg-cosmic-light transition-all">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 bg-cosmic-light/30 custom-scrollbar" ref={scrollRef}>
                <div className="py-8 text-center">
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cosmic-brand/5 border border-cosmic-brand/10 text-[10px] font-bold text-cosmic-brand uppercase tracking-widest">
                        <Lock className="h-3 w-3" /> End-to-End Encrypted Session
                    </span>
                </div>

                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === currentUser.id
                    const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id)
                    const isContinuous = idx > 0 && messages[idx - 1].sender_id === msg.sender_id

                    return (
                        <div key={msg.id} className={cn("flex group animate-fade-up", isMe ? 'justify-end' : 'justify-start', isContinuous ? 'mt-2' : '')}>
                            <div className={cn("flex gap-3 max-w-[85%] sm:max-w-[75%]", isMe && 'flex-row-reverse')}>
                                {!isMe && (
                                    <div className="w-8 flex-shrink-0 flex items-end mb-1">
                                        {showAvatar ? (
                                            <Avatar src={otherUser.avatar_url} name={otherUser.name} size="xs" className="ring-2 ring-white shadow-sm" />
                                        ) : (
                                            <div className="w-8" />
                                        )}
                                    </div>
                                )}

                                <div className={cn("space-y-1.5", isMe ? 'items-end' : 'items-start')}>
                                    <div className={cn(
                                        "px-5 py-3 rounded-sm font-medium text-sm leading-relaxed shadow-sm transition-all",
                                        isMe
                                            ? 'bg-cosmic-brand text-white rounded-br-sm'
                                            : 'bg-white text-cosmic-black border border-cosmic-accent rounded-bl-sm'
                                    )}>
                                        {msg.attachment_url && (
                                            <div className="mb-2">
                                                {msg.attachment_type === 'jpg' || msg.attachment_type === 'jpeg' || msg.attachment_type === 'png' ? (
                                                    <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer">
                                                        <img src={msg.attachment_url} alt="Attachment" className="max-w-full rounded-sm max-h-48 object-cover border border-white/20" />
                                                    </a>
                                                ) : (
                                                    <a href={msg.attachment_url} target="_blank" rel="noopener noreferrer" className={cn(
                                                        "flex items-center gap-3 p-3 rounded-sm border transition-all text-left",
                                                        isMe ? "bg-white/10 border-white/20 hover:bg-white/20" : "bg-[var(--color-cosmic-light)] border-cosmic-accent hover:bg-[#EEEEEE]"
                                                    )}>
                                                        <div className={cn("p-2 rounded-sm", isMe ? "bg-white/20" : "bg-white")}>
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0 pr-4">
                                                            <div className="font-bold text-xs truncate uppercase tracking-wider text-inherit">Encrypted Document</div>
                                                            <div className="text-[10px] opacity-70 uppercase tracking-widest mt-0.5">{msg.attachment_type} File</div>
                                                        </div>
                                                        <Download className="h-4 w-4 opacity-50" />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        {msg.content !== 'File transmission' && msg.content}
                                    </div>
                                    <div className={cn("flex items-center gap-1.5 text-[10px] font-bold text-cosmic-accent uppercase tracking-wider px-1", isMe && "flex-row-reverse")}>
                                        {formatDate(msg.created_at)}
                                        {isMe && (
                                            <CheckCheck className="h-3.5 w-3.5 text-[#4CAF50]/60" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Action Bar */}
            <footer className="p-4 md:p-6 bg-white border-t border-cosmic-accent sticky bottom-0 z-10 shrink-0">
                <form onSubmit={handleSend} className="max-w-5xl mx-auto flex flex-col gap-3">
                    {attachment && (
                        <div className="flex items-center gap-3 p-3 bg-cosmic-light border border-cosmic-accent rounded-sm self-start">
                            <FileText className="h-5 w-5 text-cosmic-brand" />
                            <span className="text-sm font-bold text-cosmic-black">File Attached</span>
                            <button type="button" onClick={() => setAttachment(null)} className="text-xs text-cosmic-black font-bold uppercase tracking-widest hover:underline ml-2">Remove</button>
                        </div>
                    )}
                    <div className="flex gap-3 md:gap-4">
                        <div className="flex-1 relative flex items-center bg-[var(--color-cosmic-light)] rounded-sm border-transparent focus-within:bg-white focus-within:border-cosmic-brand/30 focus-within:ring-4 focus-within:ring-cosmic-brand/10 transition-all">
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.doc,.png,.jpg,.jpeg" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading || sending}
                                className="p-3.5 md:p-4 text-cosmic-accent hover:text-cosmic-brand transition-colors disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1 bg-transparent py-3.5 md:py-4 pr-5 md:pr-6 text-cosmic-black font-medium text-sm outline-none"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={(!input.trim() && !attachment) || sending || uploading}
                            className="h-12 w-12 md:h-[54px] md:w-[54px] rounded-sm bg-cosmic-black text-white flex items-center justify-center shadow-sm shadow-[#212A31]/20 hover:bg-[#C62828] hover:shadow-sm active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-cosmic-black transition-all shrink-0"
                        >
                            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-1" />}
                        </button>
                    </div>
                </form>
            </footer>
        </div>
    )
}
