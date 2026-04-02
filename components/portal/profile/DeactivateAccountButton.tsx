'use client'

import { useState } from 'react'
import { AlertOctagon, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function DeactivateAccountButton({ requestedAt }: { requestedAt: string | null }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    if (requestedAt) {
        return (
            <div className="bg-cosmic-brand/10 border border-[#FFCDD2] p-6 rounded-sm flex items-start gap-4 animate-fade-in mt-8">
                <AlertOctagon className="w-6 h-6 text-cosmic-brand shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-cosmic-brand font-bold text-sm tracking-widest uppercase mb-1">Deactivation Requested</h4>
                    <p className="text-cosmic-brand text-sm">Your request to deactivate this account was submitted on {new Date(requestedAt).toLocaleDateString()}. An administrator will process it shortly.</p>
                </div>
            </div>
        )
    }

    async function handleDeactivate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)

        const form = new FormData(e.currentTarget)
        const reason = form.get('reason') as string

        try {
            const res = await fetch('/api/members/deactivate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to request deactivation.')

            toast.success('Account deactivation requested.')
            setIsOpen(false)
            router.refresh()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mt-8">
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-cosmic-brand border border-[#FFCDD2] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-cosmic-brand/10 transition-all group"
            >
                <AlertOctagon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Request Account Deactivation
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-sm w-full max-w-md overflow-hidden shadow-sm border border-cosmic-accent animate-scale-up">
                        <div className="p-6 border-b border-[#EEEEEE] flex justify-between items-center bg-cosmic-brand/10">
                            <div>
                                <h3 className="text-lg font-bold text-cosmic-brand flex items-center gap-2">
                                    <AlertOctagon className="w-5 h-5" /> Deactivate Account
                                </h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-cosmic-brand hover:bg-[#FFCDD2] p-1 rounded-sm transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleDeactivate} className="p-6 space-y-4">
                            <p className="text-sm text-cosmic-accent font-medium leading-relaxed">
                                Are you sure you want to deactivate your account? This action will hide your profile from the directory and temporarily suspend your access.
                                An administrator must manually approve the deactivation.
                            </p>
                            <div>
                                <label className="block text-xs font-bold text-cosmic-accent uppercase tracking-widest mb-2">Reason (Optional)</label>
                                <textarea
                                    name="reason"
                                    rows={3}
                                    placeholder="Please let us know why you are leaving..."
                                    className="w-full bg-[var(--color-cosmic-light)] border border-cosmic-accent rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand focus:ring-1 focus:ring-cosmic-brand transition-all resize-none"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-3 bg-[var(--color-cosmic-light)] hover:bg-cosmic-accent text-cosmic-accent rounded-sm font-bold tracking-widest text-xs uppercase transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cosmic-brand hover:bg-cosmic-dark text-white rounded-sm font-bold tracking-widest text-xs uppercase shadow-sm shadow-[#124E66]/20 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
