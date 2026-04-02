// components/public/ContactSection.tsx — IIMS College Contact & CTA
'use client'
import React, { useState } from 'react'
import { CheckCircle, Mail, MapPin, Phone, ArrowRight, Send } from 'lucide-react'
import { contactSchema } from '@/lib/validations'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ContactSection({ contactEmail }: { contactEmail?: string | null }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            contactSchema.parse(formData)

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Failed to send message')

            setSuccess(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {}
                err.issues.forEach((e) => {
                    if (e.path[0]) fieldErrors[e.path[0] as string] = e.message
                })
                setErrors(fieldErrors)
            } else {
                alert('Message failed to send. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* CTA Band */}
            <section className="py-16 bg-[#1A1A2E] relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-[0.04] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                        Take the first step towards a rewarding career. Apply to IIMS College today.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/portal/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-cosmic-brand text-white font-bold hover:bg-cosmic-dark transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Apply Now
                            <ArrowRight className="h-5 w-5" />
                        </a>
                        <a
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-all"
                        >
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section className="py-24 bg-[var(--color-cosmic-light)]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        {/* Contact Info */}
                        <div className="animate-fade-up">
                            <span className="text-cosmic-brand text-xs font-bold uppercase tracking-widest mb-4 block">Get in Touch</span>

                            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#1A1A2E] mb-6 leading-tight">
                                We'd Love to <span className="text-cosmic-brand">Hear</span> from You
                            </h2>

                            <p className="text-[#666666] text-lg mb-10 leading-relaxed">
                                Have questions about admissions, programs, or campus life?
                                Reach out to our team and we'll get back to you promptly.
                            </p>

                            <div className="space-y-6">
                                <ContactInfoCard
                                    icon={<Mail className="h-5 w-5" />}
                                    title="Email"
                                    value={contactEmail || 'info@iimscollege.edu.np'}
                                    href={`mailto:${contactEmail || 'info@iimscollege.edu.np'}`}
                                />
                                <ContactInfoCard
                                    icon={<Phone className="h-5 w-5" />}
                                    title="Phone"
                                    value="+977-1-4169100"
                                    href="tel:+97714169100"
                                />
                                <ContactInfoCard
                                    icon={<MapPin className="h-5 w-5" />}
                                    title="Campus"
                                    value="Putalisadak, Kathmandu, Nepal"
                                    href="#"
                                />
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="animate-fade-up">
                            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-[#EEEEEE]">
                                {success ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-xl font-poppins font-bold text-[#1A1A2E] mb-2">Message Sent!</h3>
                                        <p className="text-[#666666] mb-6 text-sm">We'll get back to you as soon as possible.</p>
                                        <Button
                                            variant="outline"
                                            onClick={() => setSuccess(false)}
                                            className="rounded-xl border-2 px-6"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <Input
                                            label="Full Name"
                                            placeholder="John Doe"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            error={errors.name}
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <Input
                                                label="Email Address"
                                                type="email"
                                                placeholder="john@example.com"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                error={errors.email}
                                            />
                                            <Input
                                                label="Subject"
                                                placeholder="Admissions Inquiry"
                                                required
                                                value={formData.subject}
                                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                                error={errors.subject}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-[#333333]">Message</label>
                                            <textarea
                                                rows={4}
                                                placeholder="Your message..."
                                                required
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                className="w-full rounded-xl border border-[#EEEEEE] bg-white px-4 py-3 text-sm text-[#333333] focus:ring-2 focus:ring-cosmic-brand focus:border-transparent transition-all outline-none resize-none"
                                            />
                                            {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
                                        </div>
                                        <Button
                                            type="submit"
                                            loading={loading}
                                            className="w-full h-12 rounded-xl text-sm shadow-lg shadow-red-100"
                                            rightIcon={<Send className="h-4 w-4" />}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

function ContactInfoCard({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href: string }) {
    return (
        <a href={href} className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-[#EEEEEE] hover:border-cosmic-brand/20 hover:shadow-md transition-all">
            <div className="p-3 rounded-xl bg-cosmic-brand/8 text-cosmic-brand group-hover:bg-cosmic-dark group-hover:text-white transition-all flex-shrink-0">
                {icon}
            </div>
            <div>
                <span className="block text-xs font-semibold text-[#999999] uppercase tracking-wider mb-0.5">{title}</span>
                <span className="block text-sm font-bold text-[#1A1A2E] group-hover:text-cosmic-brand transition-colors">{value}</span>
            </div>
        </a>
    )
}
