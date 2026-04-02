// components/portal/admin/CTFTab.tsx — IIMS IT Club Arena Operations (v4.0)
'use client'

import { useState } from 'react'
import { Trophy, Target, Shield, Globe, Cpu, Key, Plus, Edit2, Trash2, Eye, EyeOff, BarChart3, X } from 'lucide-react'
import { updateChallengeStatus } from '@/app/portal/(protected)/admin/actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const emptyForm = {
    title: '',
    description: '',
    category: 'web' as string,
    difficulty: 'easy' as string,
    points: '',
    flag: '',
    hint: '',
    is_active: true,
}

export default function CTFTab({ challenges, refresh }: { challenges: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [submitting, setSubmitting] = useState(false)

    async function handleToggleStatus(id: string, currentStatus: boolean) {
        setIsLoading(id)
        const res = await updateChallengeStatus(id, !currentStatus)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success(`Challenge ${!currentStatus ? 'activated' : 'deactivated'}`)
            refresh()
        }
    }

    async function handleCreateChallenge(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        try {
            const body = {
                title: form.title,
                description: form.description,
                category: form.category,
                difficulty: form.difficulty,
                points: parseInt(form.points),
                flag: form.flag,
                hint: form.hint || undefined,
                is_active: form.is_active,
            }

            const res = await fetch('/api/admin/ctf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error?.formErrors?.[0] || data.error || 'Failed to create challenge')
            }

            toast.success('Challenge created! Flag secured.')
            setForm(emptyForm)
            setShowForm(false)
            refresh()
        } catch (err: any) {
            toast.error(err.message || 'Failed to create challenge')
        } finally {
            setSubmitting(false)
        }
    }

    const getIcon = (category: string) => {
        switch (category) {
            case 'web': return <Globe className="h-5 w-5" />
            case 'pwn': return <Shield className="h-5 w-5" />
            case 'reverse': return <Cpu className="h-5 w-5" />
            case 'crypto': return <Key className="h-5 w-5" />
            default: return <Target className="h-5 w-5" />
        }
    }

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-cosmic-black text-white px-8 py-3.5 rounded-sm font-bold uppercase text-xs tracking-widest shadow-sm shadow-[#212A31]/20 flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:bg-cosmic-dark"
                >
                    {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {showForm ? 'Cancel' : 'New Arena Challenge'}
                </button>
            </div>

            {/* Challenge Creation Form */}
            {showForm && (
                <form onSubmit={handleCreateChallenge} className="bg-white p-8 rounded-[2rem] border border-cosmic-accent shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-cosmic-black uppercase tracking-wider">New CTF Challenge</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Web Starter"
                                className="w-full px-4 py-3 border border-cosmic-accent rounded-sm bg-cosmic-light text-cosmic-black focus:outline-none focus:border-cosmic-black focus:ring-1 focus:ring-cosmic-black"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Category *</label>
                            <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                                className="w-full px-4 py-3 border border-cosmic-accent rounded-sm bg-cosmic-light text-cosmic-black focus:outline-none focus:border-cosmic-black"
                            >
                                <option value="web">Web</option>
                                <option value="forensics">Forensics</option>
                                <option value="crypto">Crypto</option>
                                <option value="pwn">Pwn</option>
                                <option value="reversing">Reversing</option>
                                <option value="osint">OSINT</option>
                                <option value="misc">Misc</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Difficulty *</label>
                            <select
                                value={form.difficulty}
                                onChange={e => setForm({ ...form, difficulty: e.target.value })}
                                className="w-full px-4 py-3 border border-cosmic-accent rounded-sm bg-cosmic-light text-cosmic-black focus:outline-none focus:border-cosmic-black"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                                <option value="insane">Insane</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Points *</label>
                            <input
                                type="number"
                                value={form.points}
                                onChange={e => setForm({ ...form, points: e.target.value })}
                                placeholder="100"
                                className="w-full px-4 py-3 border border-cosmic-accent rounded-sm bg-cosmic-light text-cosmic-black focus:outline-none focus:border-cosmic-black"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Flag * <span className="text-cosmic-accent normal-case">(will be hashed server-side)</span></label>
                        <input
                            type="text"
                            value={form.flag}
                            onChange={e => setForm({ ...form, flag: e.target.value })}
                            placeholder="ICEHC{your_flag_here}"
                            className="w-full px-4 py-3 border border-[#30363D] rounded-sm bg-[#0D1117] text-[#3FB950] font-mono focus:outline-none focus:border-[#3FB950] focus:ring-1 focus:ring-[#3FB950]"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Hint</label>
                        <input
                            type="text"
                            value={form.hint}
                            onChange={e => setForm({ ...form, hint: e.target.value })}
                            placeholder="Optional hint for struggling members"
                            className="w-full px-4 py-3 border border-cosmic-accent rounded-sm bg-cosmic-light text-cosmic-black focus:outline-none focus:border-cosmic-black"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Description *</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Challenge description (supports Markdown)"
                            rows={4}
                            className="w-full px-4 py-3 border border-cosmic-accent rounded-sm bg-cosmic-light text-cosmic-black focus:outline-none focus:border-cosmic-black resize-none"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="ctf_active"
                            checked={form.is_active}
                            onChange={e => setForm({ ...form, is_active: e.target.checked })}
                            className="w-4 h-4 accent-[#3FB950]"
                        />
                        <label htmlFor="ctf_active" className="text-sm font-medium text-cosmic-dark">Activate challenge immediately</label>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-cosmic-black text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-[#C62828] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Creating...' : 'Deploy Challenge'}
                    </button>
                </form>
            )}

            <div className="bg-white rounded-[2rem] border border-cosmic-accent shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-cosmic-light border-b border-cosmic-accent">
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Challenge Intel</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Difficulty</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest text-center">XP Value</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest text-center">Solves</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {challenges.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-16 text-center text-cosmic-accent">
                                        <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
                                        <p className="font-bold text-sm">No challenges deployed. Click &quot;New Arena Challenge&quot; to create one.</p>
                                    </td>
                                </tr>
                            )}
                            {challenges.map(chal => (
                                <tr key={chal.id} className="group hover:bg-cosmic-light transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-3.5 rounded-sm border group-hover:shadow-sm transition-all",
                                                chal.is_active
                                                    ? "bg-cosmic-black text-white border-cosmic-black"
                                                    : "bg-[var(--color-cosmic-light)] text-[#BDBDBD] border-cosmic-accent"
                                            )}>
                                                {getIcon(chal.category)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={cn("text-sm font-bold truncate", !chal.is_active ? "text-cosmic-accent" : "text-cosmic-black")}>{chal.title}</div>
                                                <div className="text-[10px] font-bold text-cosmic-accent uppercase tracking-widest truncate mt-0.5">{chal.category} Category</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                                            chal.is_active ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" : "bg-[var(--color-cosmic-light)] text-cosmic-accent border-cosmic-accent"
                                        )}>
                                            {chal.is_active ? 'Active' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                                            chal.difficulty === 'hard' || chal.difficulty === 'expert' ? "bg-cosmic-brand/10 text-cosmic-brand border-[#FFCDD2]" :
                                                chal.difficulty === 'medium' ? "bg-cosmic-light text-[#F57F17] border-[#FFECB3]" :
                                                    "bg-cosmic-brand/10 text-[#1976D2] border-[#BBDEFB]"
                                        )}>
                                            {chal.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={cn(
                                            "text-sm font-bold tracking-wide",
                                            chal.is_active ? "text-cosmic-black" : "text-[#BDBDBD]"
                                        )}>{chal.points}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2 text-cosmic-accent text-xs font-bold">
                                            <BarChart3 className={cn("h-4 w-4", chal.is_active ? "opacity-70 text-cosmic-black" : "opacity-30")} />
                                            {chal.solves_count || 0}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            <button
                                                onClick={() => handleToggleStatus(chal.id, chal.is_active)}
                                                disabled={!!isLoading}
                                                className={cn(
                                                    "p-2.5 rounded-sm transition-all shadow-sm border",
                                                    chal.is_active
                                                        ? "bg-cosmic-black border-[#424242] text-white hover:bg-black"
                                                        : "bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32] hover:bg-[#4CAF50] hover:text-white"
                                                )}
                                                title={chal.is_active ? "Deactivate Challenge" : "Activate Challenge"}
                                            >
                                                {chal.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            <button className="p-2.5 bg-white border border-cosmic-accent text-cosmic-black hover:bg-cosmic-light hover:border-cosmic-accent rounded-sm transition-all shadow-sm">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
