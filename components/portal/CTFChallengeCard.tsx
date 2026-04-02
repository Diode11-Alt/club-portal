// components/portal/CTFChallengeCard.tsx — IIMS IT Club CTF Challenge Card (v4.0)
'use client'

import { useState } from 'react'
import { Flag, ShieldCheck, CheckCircle, AlertTriangle, Loader2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'

type CTFChallenge = any

interface CTFChallengeCardProps {
    challenge: CTFChallenge & { solved: boolean }
}

export default function CTFChallengeCard({ challenge }: CTFChallengeCardProps) {
    const [flagInput, setFlagInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [solved, setSolved] = useState(challenge.solved)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!flagInput.trim()) return

        setLoading(true)

        try {
            const res = await fetch('/api/ctf/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challenge_id: challenge.id,
                    flag: flagInput
                })
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'Capture failed')
            } else {
                toast.success(`Flag captured! +${challenge.points} points awarded.`)
                setSolved(true)
                setFlagInput('')
            }
        } catch (err) {
            toast.error('Network error during transmission')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={cn(
            "relative p-6 md:p-8 rounded-sm border transition-all animate-fade-up flex flex-col h-full group overflow-hidden",
            solved
                ? "bg-white border-emerald-300 shadow-sm"
                : "bg-white border-cosmic-accent hover:border-cosmic-brand/40 hover:shadow-md shadow-sm"
        )}>
            {/* Solved Overlay Decoration */}
            {solved && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-[4rem] flex items-center justify-center pointer-events-none">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border",
                            challenge.difficulty === 'easy' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                challenge.difficulty === 'medium' ? "bg-amber-50 text-amber-600 border-amber-200" :
                                    challenge.difficulty === 'hard' ? "bg-red-50 text-red-600 border-red-200" :
                                        "bg-purple-50 text-purple-600 border-purple-200 font-black"
                        )}>
                            {challenge.difficulty}
                        </span>
                        <span className="px-2.5 py-1 rounded-sm bg-cosmic-light text-cosmic-accent border border-cosmic-accent text-[10px] font-bold uppercase tracking-widest">
                            {challenge.category}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-cosmic-black group-hover:text-cosmic-brand transition-colors leading-tight">
                        {challenge.title}
                    </h3>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-cosmic-brand">{challenge.points}</div>
                    <div className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest leading-none">PTS</div>
                </div>
            </div>

            {/* Content */}
            <div className="text-cosmic-accent text-sm mb-8 flex-1 leading-relaxed">
                {challenge.description}
            </div>

            {/* Input Overlay / Footer */}
            <div className="mt-auto">
                {!solved ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Flag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-accent" />
                                <input
                                    type="text"
                                    placeholder="Flag format: ICEHC{...}"
                                    value={flagInput}
                                    onChange={(e) => setFlagInput(e.target.value)}
                                    className="w-full bg-cosmic-light border border-cosmic-accent rounded-sm pl-11 pr-4 py-3 text-sm text-cosmic-black focus:bg-white focus:ring-1 focus:ring-cosmic-brand focus:border-cosmic-brand transition-all outline-none placeholder:text-cosmic-accent"
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={!flagInput.trim()}
                                className="rounded-sm h-12 px-6 bg-cosmic-brand hover:bg-cosmic-dark text-white border-none font-bold shadow-sm"
                            >
                                Capture <ChevronRight className="inline h-4 w-4 ml-1" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-cosmic-accent font-bold uppercase tracking-widest">
                            <ShieldCheck className="h-3.5 w-3.5" /> SECURE TRANSMISSION
                        </div>
                    </form>
                ) : (
                    <div className="bg-emerald-50 rounded-sm p-4 flex items-center justify-center gap-3 text-emerald-600 border border-emerald-200 animate-fade-up">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase tracking-widest">Target Fully Compromised</span>
                    </div>
                )}
            </div>
        </div>
    )
}
