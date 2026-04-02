'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export default function JoinPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('submitting')
        // Simulate network request
        setTimeout(() => {
            setStatus('success')
        }, 1500)
    }

    return (
        <div className="bg-cosmic-light min-h-screen py-24">
            <div className="max-w-3xl mx-auto px-6">

                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-cosmic-brand mb-4 tracking-tight">Membership Application</h1>
                    <p className="text-[#4A4A4A] text-lg leading-relaxed">
                        Join the IIMS Cybersecurity & Ethical Hacking Club. Membership is open to all currently enrolled IIMS College students.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="bg-white border border-cosmic-accent p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-[#2E7D32]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-8 w-8 text-[#2E7D32]" />
                        </div>
                        <h2 className="text-2xl font-bold text-cosmic-brand mb-4">Application Received</h2>
                        <p className="text-[#4A4A4A] mb-8 leading-relaxed max-w-md mx-auto">
                            Thank you for your interest in joining ICEHC. Our committee will review your application and contact you at your student email address.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-cosmic-brand text-white font-bold px-6 py-3 text-sm hover:bg-[#4A4A4A] transition-colors"
                        >
                            Return Home
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white border border-cosmic-accent p-8 md:p-12 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="block text-sm font-bold text-cosmic-brand">Full Name <span className="text-cosmic-brand">*</span></label>
                                <input
                                    type="text"
                                    id="fullName"
                                    required
                                    className="w-full border border-cosmic-accent px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand transition-colors"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="studentId" className="block text-sm font-bold text-cosmic-brand">Student ID <span className="text-cosmic-brand">*</span></label>
                                <input
                                    type="text"
                                    id="studentId"
                                    required
                                    className="w-full border border-cosmic-accent px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand transition-colors"
                                    placeholder="e.g. IIMS-1234"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-bold text-cosmic-brand">College Email <span className="text-cosmic-brand">*</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full border border-cosmic-accent px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand transition-colors"
                                    placeholder="student@iimscollege.edu.np"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-bold text-cosmic-brand">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    className="w-full border border-cosmic-accent px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand transition-colors"
                                    placeholder="+977"
                                />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="program" className="block text-sm font-bold text-cosmic-brand">Academic Program <span className="text-cosmic-brand">*</span></label>
                                <select
                                    id="program"
                                    required
                                    defaultValue=""
                                    className="w-full border border-cosmic-accent px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand transition-colors appearance-none bg-white font-medium text-cosmic-brand"
                                >
                                    <option value="" disabled>Select your program</option>
                                    <option value="bcs">BCS (Hons) Computer Science</option>
                                    <option value="bbus">BBUS (Hons) Business</option>
                                    <option value="bihm">BIHM (Hons) Hospitality</option>
                                    <option value="mba">MBA (Master of Business Administration)</option>
                                    <option value="other">Other / Not Listed</option>
                                </select>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label htmlFor="reason" className="block text-sm font-bold text-cosmic-brand">Why do you want to join ICEHC? <span className="text-cosmic-brand">*</span></label>
                                <textarea
                                    id="reason"
                                    required
                                    rows={4}
                                    className="w-full border border-cosmic-accent px-4 py-3 text-sm focus:outline-none focus:border-cosmic-brand transition-colors resize-y"
                                    placeholder="Briefly describe your interest in cybersecurity..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-cosmic-accent flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-xs text-[#4A4A4A] leading-relaxed flex-1">
                                By submitting this form, you agree to abide by the ICEHC Code of Conduct and IIMS College IT policies. <strong className="text-cosmic-brand">Ethical behavior is strictly enforced.</strong>
                            </p>
                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full md:w-auto px-8 py-3 bg-cosmic-brand text-white font-bold text-sm tracking-wide hover:bg-cosmic-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                            >
                                {status === 'submitting' ? 'Submitting...' : 'Submit Form'}
                            </button>
                        </div>
                    </form>
                )}

                {/* Login hint */}
                <div className="mt-8 text-center">
                    <p className="text-[#4A4A4A] text-sm">
                        Already a member?{' '}
                        <Link href="/portal/login" className="text-cosmic-brand font-bold hover:underline transition-all">
                            Login to Portal
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}
