// components/portal/CTFClient.tsx — IIMS CTF Arena (v4.0)
'use client'

import { useState } from 'react'
import { Search, Trophy, Medal, Target, Zap, ChevronRight, GraduationCap } from 'lucide-react'
import CTFChallengeCard from './CTFChallengeCard'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

type CTFChallenge = any
type Member = any

interface CTFClientProps {
    challenges: (CTFChallenge & { solved: boolean })[]
    leaderboard: Pick<Member, 'id' | 'full_name' | 'points' | 'avatar_url'>[]
    userPoints: number
    userRank: number
}

const CATEGORIES = ['all', 'web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc']

export default function CTFClient({ challenges, leaderboard, userPoints, userRank }: CTFClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredChallenges = challenges.filter(c => {
        const matchesCategory = activeCategory === 'all' || c.category === activeCategory
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const totalPoints = challenges.reduce((sum, c) => sum + (c.points || 0), 0)
    const solvedCount = challenges.filter(c => c.solved).length
    const progress = Math.round((userPoints / (totalPoints || 1)) * 100) || 0

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-up">
            {/* Dashboard Stats */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-sm p-8 md:p-10 text-cosmic-black shadow-sm relative overflow-hidden group border border-cosmic-accent">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-brand/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-cosmic-brand/10 text-cosmic-brand font-bold text-[10px] uppercase tracking-widest border border-cosmic-brand/20">
                                <Target className="h-3 w-3" /> Live Operation
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                CTF <span className="text-white bg-cosmic-black px-2 rounded-sm ml-1">Arena</span>
                            </h1>
                            <p className="text-cosmic-accent text-sm max-w-sm leading-relaxed">
                                Identify vulnerabilities, exploit the systems, and capture flags to advance your rank within the IIMS IT Club hierarchy.
                            </p>
                        </div>

                        <div className="flex gap-10 bg-cosmic-light backdrop-blur-md p-8 rounded-sm border border-cosmic-accent shadow-inner">
                            <div className="text-center">
                                <span className="block text-[10px] font-bold uppercase text-cosmic-accent tracking-widest mb-2">My Score</span>
                                <span className="block text-4xl font-bold text-cosmic-brand">{userPoints}</span>
                            </div>
                            <div className="w-px h-16 bg-cosmic-accent/30" />
                            <div className="text-center">
                                <span className="block text-[10px] font-bold uppercase text-cosmic-accent tracking-widest mb-2">Global Rank</span>
                                <span className="block text-4xl font-bold text-cosmic-black">#{userRank}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-sm p-8 shadow-sm flex flex-col justify-between group border border-cosmic-accent relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-cosmic-light/50 to-transparent pointer-events-none" />

                    <div className="relative z-10 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-cosmic-black flex items-center gap-2">
                                <Zap className="h-5 w-5 text-cosmic-brand" /> Mastery
                            </h3>
                            <span className="text-2xl font-bold text-cosmic-brand">{progress}%</span>
                        </div>

                        <div className="relative h-3 bg-cosmic-light rounded-full overflow-hidden border border-cosmic-accent p-0.5">
                            <div
                                className="h-full bg-gradient-to-r from-cosmic-brand to-cosmic-dark rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className="text-cosmic-accent font-bold text-[10px] uppercase tracking-widest">
                            {solvedCount} Targets Pwned / {challenges.length} Available
                        </p>
                    </div>

                    <button className="mt-8 flex items-center justify-between w-full p-4 bg-cosmic-light hover:bg-cosmic-muted rounded-sm transition-all relative z-10 border border-cosmic-accent">
                        <span className="text-xs font-bold text-cosmic-black tracking-wide">Review Tactics</span>
                        <ChevronRight className="h-4 w-4 text-cosmic-accent" />
                    </button>
                </div>
            </section>

            {/* Challenge Navigator */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Challenge Feed */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-white p-4 rounded-sm border border-cosmic-accent shadow-sm">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-4 py-2 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all",
                                        activeCategory === cat
                                            ? "bg-cosmic-brand text-white shadow-sm"
                                            : "bg-cosmic-light text-cosmic-accent hover:bg-cosmic-muted hover:text-cosmic-black border border-cosmic-accent"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative group min-w-[240px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cosmic-accent group-focus-within:text-cosmic-brand transition-colors" />
                            <input
                                type="text"
                                placeholder="Search challenges..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-cosmic-light border border-cosmic-accent rounded-sm py-2 pl-10 pr-4 text-sm text-cosmic-black focus:border-cosmic-brand focus:ring-1 focus:ring-cosmic-brand/30 outline-none transition-all placeholder:text-cosmic-accent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredChallenges.map(challenge => (
                            <CTFChallengeCard key={challenge.id} challenge={challenge} />
                        ))}

                        {filteredChallenges.length === 0 && (
                            <div className="col-span-full py-24 rounded-sm border border-dashed border-cosmic-accent bg-white text-center shadow-inner">
                                <div className="h-16 w-16 bg-cosmic-light rounded-sm flex items-center justify-center mx-auto mb-5 border border-cosmic-accent">
                                    <Target className="h-8 w-8 text-cosmic-accent" />
                                </div>
                                <p className="text-cosmic-black font-bold text-sm uppercase tracking-widest">No Targets Detected</p>
                                <p className="text-cosmic-accent mt-2 text-xs">Adjust your search parameters.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Honor Board */}
                <div className="space-y-6">
                    <div className="bg-white rounded-sm p-6 md:p-8 border border-cosmic-accent shadow-sm sticky top-24">
                        <h3 className="font-bold text-cosmic-black flex items-center gap-2 mb-6 uppercase tracking-widest text-xs">
                            <Trophy className="h-4 w-4 text-[#FFD54F]" /> Hall of Fame
                        </h3>

                        <div className="space-y-5">
                            {leaderboard.map((member, idx) => (
                                <div key={member.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-7 h-7 flex items-center justify-center rounded-sm font-bold text-xs shadow-inner",
                                            idx === 0 ? "bg-[#FFD54F] text-[#1E1E2E]" :
                                                idx === 1 ? "bg-gray-300 text-[#1E1E2E]" :
                                                    idx === 2 ? "bg-amber-600 text-white" :
                                                        "bg-cosmic-light text-cosmic-accent border border-cosmic-accent"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {member.avatar_url ? (
                                                <Avatar src={member.avatar_url} name={member.full_name} size="xs" />
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-cosmic-light border border-cosmic-accent flex items-center justify-center">
                                                    <GraduationCap className="h-3 w-3 text-cosmic-accent" />
                                                </div>
                                            )}
                                            <span className="text-xs font-bold text-cosmic-black group-hover:text-cosmic-brand transition-colors truncate max-w-[90px]">
                                                {member.full_name?.split(' ')[0] || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-cosmic-brand">{member.points}</span>
                                </div>
                            ))}
                        </div>

                        <a href="/portal/leaderboard" className="block w-full mt-8 pt-4 text-[10px] font-bold uppercase tracking-widest text-cosmic-accent border-t border-cosmic-accent hover:text-cosmic-brand transition-colors text-center cursor-pointer">
                            View Full Grid <ChevronRight className="inline h-3 w-3 ml-1" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
