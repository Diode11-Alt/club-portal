// components/portal/admin/MembersTab.tsx — IIMS IT Club Operative Management (v4.0)
'use client'

import { useState } from 'react'
import { BadgeCheck, Ban, Trash2, MoreHorizontal, UserCheck, Shield, ShieldAlert, MoreVertical, Settings } from 'lucide-react'
import { updateMemberStatus, deleteMember } from '@/app/portal/(protected)/admin/actions'
import Avatar from '@/components/ui/Avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Member = any
type CurrentUser = { id: string; role: string; club_post: string }

const CLUB_POSTS = [
    'President', 'Vice President', 'Secretary', 'Joint Secretary',
    'Treasurer', 'Event & Activities Coordinator', 'Marketing & Communication Lead',
    'Logistics & Operations Lead', 'Executive Head', 'Technical Lead', 'General Member'
]

export default function MembersTab({ members, currentUser, refresh }: { members: Member[], currentUser?: CurrentUser, refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [designatingMember, setDesignatingMember] = useState<Member | null>(null)

    const isSuperadminOrPresident = currentUser?.role === 'superadmin' || currentUser?.club_post === 'President'

    async function handleDesignate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!designatingMember) return

        setIsLoading(designatingMember.id)
        const form = new FormData(e.currentTarget)
        const role = form.get('role') as string
        const club_post = form.get('club_post') as string
        const is_public_profile = form.get('is_public_profile') === 'on'
        const display_order = parseInt(form.get('display_order') as string, 10) || 999

        try {
            const res = await fetch('/api/admin/members', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: designatingMember.id,
                    role,
                    club_post,
                    is_public_profile,
                    display_order,
                    status: designatingMember.status // preserve status
                })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to update designation')

            toast.success('Member designation updated')
            setDesignatingMember(null)
            refresh()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(null)
        }
    }

    async function handleStatus(id: string, status: string, role?: string) {
        setIsLoading(id)
        const res = await updateMemberStatus(id, status, role)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success(`Member updated to ${status}`)
            refresh()
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Abort member profile? This action cannot be reversed.')) return
        setIsLoading(id)
        const res = await deleteMember(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Member record deleted')
            refresh()
        }
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="bg-white rounded-[2rem] border border-cosmic-accent shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-cosmic-light border-b border-cosmic-accent">
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Member</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Role Clearance</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-cosmic-accent uppercase tracking-widest text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {members.map(member => (
                                <tr key={member.id} className="group hover:bg-cosmic-light transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <Avatar src={member.avatar_url} name={member.full_name || member.email} size="sm" className="shadow-sm" />
                                            <div className="min-w-0">
                                                <div className="text-cosmic-black text-sm font-bold truncate">{member.full_name || member.email}</div>
                                                <div className="text-cosmic-accent text-[10px] font-semibold truncate">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border",
                                            member.role === 'admin' || member.role === 'superadmin'
                                                ? "bg-cosmic-brand/10 text-cosmic-brand border-[#FFCDD2] shadow-sm"
                                                : "bg-cosmic-brand/10 text-[#1976D2] border-[#BBDEFB]"
                                        )}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border",
                                            member.status === 'approved' ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" :
                                                member.status === 'pending' ? "bg-cosmic-light text-[#F57F17] border-[#FFECB3] animate-pulse" :
                                                    "bg-[var(--color-cosmic-light)] text-cosmic-accent border-cosmic-accent"
                                        )}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            {member.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatus(member.id, 'approved')}
                                                    disabled={!!isLoading}
                                                    className="p-2.5 bg-[#E8F5E9] hover:bg-[#4CAF50] text-[#2E7D32] hover:text-white rounded-sm transition-all shadow-sm border border-[#C8E6C9]"
                                                    title="Authorize Protocol"
                                                >
                                                    <UserCheck className="h-4 w-4" />
                                                </button>
                                            )}
                                            {isSuperadminOrPresident && (
                                                <button
                                                    onClick={() => setDesignatingMember(member)}
                                                    disabled={!!isLoading}
                                                    className="p-2.5 bg-cosmic-brand/10 hover:bg-[#1976D2] text-[#1976D2] hover:text-white rounded-sm transition-all shadow-sm border border-[#BBDEFB]"
                                                    title="Manage Designation"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                disabled={!!isLoading}
                                                className="p-2.5 bg-white hover:bg-cosmic-black text-cosmic-accent hover:text-white rounded-sm transition-all shadow-sm border border-cosmic-accent"
                                                title="Purge Record"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Designation Modal */}
            {designatingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-sm w-full max-w-md overflow-hidden shadow-sm border border-cosmic-accent animate-scale-up">
                        <div className="p-6 border-b border-[#EEEEEE]">
                            <h3 className="text-xl font-bold border-b-2 border-cosmic-black inline-block pb-1">Manage Designation</h3>
                            <p className="text-sm text-cosmic-accent mt-2">Adjusting clearances for {designatingMember.full_name}</p>
                        </div>
                        <form onSubmit={handleDesignate} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-cosmic-accent uppercase tracking-widest mb-2">System Role</label>
                                <select
                                    name="role"
                                    defaultValue={designatingMember.role}
                                    className="w-full bg-[var(--color-cosmic-light)] border border-cosmic-accent rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand focus:ring-1 focus:ring-cosmic-brand transition-all"
                                >
                                    <option value="member">Member</option>
                                    <option value="bod">Board of Directors (BOD)</option>
                                    {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin' || currentUser?.club_post === 'President') && <option value="admin">Admin</option>}
                                    {currentUser?.role === 'superadmin' && <option value="superadmin">Superadmin</option>}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-cosmic-accent uppercase tracking-widest mb-2">Club Post</label>
                                <select
                                    name="club_post"
                                    defaultValue={designatingMember.club_post}
                                    className="w-full bg-[var(--color-cosmic-light)] border border-cosmic-accent rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand focus:ring-1 focus:ring-cosmic-brand transition-all"
                                >
                                    {CLUB_POSTS.map(post => {
                                        if (post === 'President' && currentUser?.role !== 'superadmin') return null;
                                        return <option key={post} value={post}>{post}</option>
                                    })}
                                </select>
                            </div>

                            <div className="flex items-center gap-4 mt-4 bg-cosmic-light p-4 rounded-sm border border-cosmic-accent">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="is_public_profile"
                                        id="is_public_profile"
                                        defaultChecked={designatingMember.is_public_profile || false}
                                        className="h-4 w-4 text-cosmic-brand rounded border-cosmic-accent focus:ring-cosmic-brand"
                                    />
                                    <label htmlFor="is_public_profile" className="text-xs font-bold text-cosmic-black">Publicly Visible Profile</label>
                                </div>
                                <div className="flex items-center gap-3 ml-auto">
                                    <label htmlFor="display_order" className="text-xs font-bold text-cosmic-accent uppercase tracking-widest">Order</label>
                                    <input
                                        type="number"
                                        name="display_order"
                                        id="display_order"
                                        defaultValue={designatingMember.display_order || 999}
                                        min="1"
                                        className="w-20 bg-white border border-cosmic-accent rounded-sm px-3 py-2 text-sm text-center focus:outline-none focus:border-cosmic-brand focus:ring-1 focus:ring-cosmic-brand"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setDesignatingMember(null)}
                                    className="flex-1 px-4 py-3 bg-[var(--color-cosmic-light)] hover:bg-cosmic-accent text-cosmic-accent rounded-sm font-bold tracking-widest text-xs uppercase transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!!isLoading}
                                    className="flex-1 px-4 py-3 bg-cosmic-brand hover:bg-cosmic-dark text-white rounded-sm font-bold tracking-widest text-xs uppercase shadow-sm shadow-[#124E66]/20 transition-all disabled:opacity-50"
                                >
                                    {isLoading === designatingMember.id ? 'Updating...' : 'Confirm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
