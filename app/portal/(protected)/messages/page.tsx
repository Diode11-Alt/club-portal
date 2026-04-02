// app/portal/messages/page.tsx — IIMS IT Club Messaging Placeholder (v4.0)
import { MessageSquare, ShieldCheck } from 'lucide-react'

export default function MessagesPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 md:p-12 animate-fade-up">
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-cosmic-brand/5 rounded-full blur-2xl scale-150 group-hover:scale-[2] transition-transform duration-700 pointer-events-none" />
                <div className="relative p-6 rounded-sm bg-white shadow-sm shadow-black/5 border border-cosmic-accent group-hover:rotate-6 transition-transform h-24 w-24 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-cosmic-brand" />
                </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#4CAF50]/10 text-[#2E7D32] font-bold text-[10px] uppercase tracking-widest mb-5 border border-[#4CAF50]/20">
                <ShieldCheck className="h-3.5 w-3.5" /> Secure Channel Active
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-cosmic-black mb-3">
                Peer-to-Peer Transmission
            </h2>
            <p className="text-cosmic-accent font-medium text-sm max-w-sm leading-relaxed">
                Select a member from the roster to establish an end-to-end encrypted direct messaging session.
            </p>

            <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-1.5 w-1.5 bg-cosmic-brand rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
            </div>
        </div>
    )
}
