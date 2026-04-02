// app/portal/pending/page.tsx — Awaiting approval screen (IIMS v4.0)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Shield, Mail, CheckCircle2, Clock } from 'lucide-react'
import SignOutButton from './SignOutButton'
import { redirect } from 'next/navigation'
import { BRAND } from '@/lib/brand'

export default async function PendingPage() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/portal/login')
    }

    const { data: member } = await supabase
        .from('members')
        .select('email, student_id')
        .eq('user_id', user.id)
        .single()

    // If profile is incomplete (no student ID), force them to complete registration
    if (member && !member.student_id) {
        redirect('/portal/register')
    }

    const email = member?.email || user.email || null

    return (
        <div className="min-h-screen bg-cosmic-light flex items-center justify-center p-6 relative">
            <div className="w-full max-w-md relative animate-fade-up">
                {/* Brand header */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="h-12 w-12 rounded-sm bg-cosmic-brand flex items-center justify-center shadow-sm">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-cosmic-brand text-base tracking-tight">{BRAND.clubShort}</h2>
                        <span className="text-[10px] text-cosmic-accent font-semibold tracking-widest uppercase">Member Portal</span>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white border border-cosmic-accent shadow-sm shadow-black/5 rounded-sm p-8">
                    {/* Status badge */}
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-[#F57F17] bg-cosmic-light border border-cosmic-brand/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F57F17] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F57F17]"></span>
                            </span>
                            PENDING REVIEW
                        </span>
                    </div>

                    <h1 className="font-bold text-cosmic-black text-xl text-center mb-3">
                        Application Under Review
                    </h1>
                    <p className="text-cosmic-accent text-sm text-center leading-relaxed mb-8">
                        Your membership request has been received. A club administrator will review and approve your account shortly.
                    </p>

                    {/* Status steps */}
                    <div className="space-y-3 mb-8">
                        <StatusStep status="complete" label="Account secured" />
                        <StatusStep status="complete" label="Profile completed" />
                        <StatusStep status="pending" label="Awaiting administrator review" />
                        <StatusStep status="locked" label="Access to portal modules" />
                    </div>

                    {/* Email notification block */}
                    <div className="bg-cosmic-light border border-cosmic-accent rounded-sm p-4 mb-8">
                        <div className="flex items-center gap-2 text-cosmic-brand font-semibold text-xs mb-2 uppercase tracking-wide">
                            <Mail className="h-4 w-4" />
                            Email Notification
                        </div>
                        <p className="text-cosmic-dark text-sm">
                            {email
                                ? <>We will notify <span className="font-semibold">{email}</span> once your application is approved.</>
                                : 'You will receive an email once your application is approved.'
                            }
                        </p>
                    </div>

                    <SignOutButton />
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-cosmic-accent font-medium">
                    Need Help?{' '}
                    <a href={`mailto:${BRAND.clubEmail}`} className="text-cosmic-brand hover:underline font-semibold">
                        Contact Administration
                    </a>
                </p>
            </div>
        </div>
    )
}

function StatusStep({ status, label }: { status: 'complete' | 'pending' | 'locked'; label: string }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-sm border text-sm transition-all ${status === 'complete'
            ? 'text-[#2E7D32] bg-[#E8F5E9] border-[#2E7D32]/20 font-medium'
            : status === 'pending'
                ? 'text-[#F57F17] bg-cosmic-light border-cosmic-brand/20 font-medium'
                : 'text-cosmic-accent bg-white border-cosmic-accent'
            }`}>
            {status === 'complete' ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            ) : status === 'pending' ? (
                <Clock className="h-5 w-5 flex-shrink-0 text-[#F57F17]" />
            ) : (
                <div className="h-5 w-5 rounded-full border-2 border-current flex-shrink-0 opacity-50" />
            )}
            <span>{label}</span>
        </div>
    )
}
