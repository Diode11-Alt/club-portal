// app/(public)/contact/page.tsx — IIMS IT Club Contact Page (v4.0)
'use client'
import { useState } from 'react'
import { Mail, Shield, MapPin, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react'
import { BRAND } from '@/lib/brand'

interface FormData {
    name: string
    email: string
    subject: string
    message: string
}

interface FieldErrors {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
}

export default function ContactPage() {
    const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
    const [errors, setErrors] = useState<FieldErrors>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    function validate(): boolean {
        const errs: FieldErrors = {}
        if (form.name.trim().length < 2) errs.name = ['Name must be at least 2 characters.']
        if (form.name.trim().length > 100) errs.name = ['Name must be under 100 characters.']
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = ['Enter a valid email address.']
        if (form.subject.trim().length < 5) errs.subject = ['Subject must be at least 5 characters.']
        if (form.subject.trim().length > 200) errs.subject = ['Subject must be under 200 characters.']
        if (form.message.trim().length < 10) errs.message = ['Message must be at least 10 characters.']
        if (form.message.trim().length > 3000) errs.message = ['Message must be under 3000 characters.']
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setServerError(null)
        if (!validate()) return

        setLoading(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    subject: form.subject.trim(),
                    message: form.message.trim(),
                }),
            })

            if (res.status === 429) {
                setServerError('Too many requests. Please try again later.')
                return
            }

            const data = await res.json()
            if (!res.ok) {
                setServerError(data.error || 'Failed to send message.')
                return
            }

            setSuccess(true)
        } catch {
            setServerError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    function updateField(field: keyof FormData, value: string) {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
    }

    return (
        <div className="bg-cosmic-light min-h-screen pt-24 pb-20">
            {/* Header Section */}
            <div className="bg-cosmic-brand text-white py-16 mb-12 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Contact <span className="text-cosmic-black">Us</span>
                    </h1>
                    <p className="text-[#C5CAE9] text-lg max-w-2xl mx-auto leading-relaxed">
                        Have a question, suggestion, or want to collaborate? <br className="hidden md:block" />
                        Reach out to the ICEHC team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left — Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-cosmic-accent rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-cosmic-brand/20 transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-[#E8EAF6] flex items-center justify-center border border-[#C5CAE9]">
                                    <Shield className="h-7 w-7 text-cosmic-brand" />
                                </div>
                                <div>
                                    <p className="font-bold text-cosmic-black text-lg">{BRAND.clubShort}</p>
                                    <p className="text-cosmic-accent text-sm font-medium">Cybersecurity & Ethical Hacking Club of IIMS College</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cosmic-light transition-colors border border-transparent hover:border-cosmic-accent">
                                    <div className="h-10 w-10 shrink-0 bg-cosmic-brand/10 rounded-full flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-cosmic-black" />
                                    </div>
                                    <div>
                                        <p className="text-cosmic-accent text-[10px] font-bold uppercase tracking-widest mb-1">Email Support</p>
                                        <a href={`mailto:${BRAND.clubEmail}`} className="text-cosmic-brand font-semibold hover:text-cosmic-black transition-colors">
                                            {BRAND.clubEmail}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cosmic-light transition-colors border border-transparent hover:border-cosmic-accent">
                                    <div className="h-10 w-10 shrink-0 bg-[#E8EAF6] rounded-full flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-cosmic-brand" />
                                    </div>
                                    <div>
                                        <p className="text-cosmic-accent text-[10px] font-bold uppercase tracking-widest mb-1">Campus Location</p>
                                        <p className="text-cosmic-dark font-semibold">IIMS College, Kathmandu, Nepal</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-cosmic-light transition-colors border border-transparent hover:border-cosmic-accent">
                                    <div className="h-10 w-10 shrink-0 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                                        <ExternalLink className="h-5 w-5 text-[#2E7D32]" />
                                    </div>
                                    <div>
                                        <p className="text-cosmic-accent text-[10px] font-bold uppercase tracking-widest mb-1">Institution</p>
                                        <a
                                            href="https://iimscollege.edu.np/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#2E7D32] font-semibold hover:underline"
                                        >
                                            iimscollege.edu.np →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-cosmic-accent rounded-[2rem] p-8 md:p-10 shadow-lg shadow-[#124E66]/5">
                            {success ? (
                                <div className="text-center py-12">
                                    <div className="h-20 w-20 rounded-full bg-[#E8F5E9] border border-[#A5D6A7] flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-[#2E7D32]" />
                                    </div>
                                    <p className="text-2xl font-bold text-cosmic-black mb-2">Message Received.</p>
                                    <p className="text-cosmic-accent text-base mb-8 max-w-sm mx-auto">
                                        Your transmission has been securely logged. The ICEHC dispatch will respond shortly.
                                    </p>
                                    <button
                                        onClick={() => { setSuccess(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                                        className="text-cosmic-brand font-bold text-sm tracking-wide hover:text-cosmic-black transition-colors px-6 py-3 rounded-full hover:bg-cosmic-light"
                                    >
                                        Send another message <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-bold text-cosmic-black mb-2">Send us a Message</h2>
                                        <p className="text-cosmic-accent text-sm">Fill out the fields below and we'll get back to you as soon as possible.</p>
                                    </div>

                                    {serverError && (
                                        <div className="p-4 rounded-xl bg-cosmic-brand/10 border border-[#FFCDD2] text-cosmic-brand text-sm font-semibold flex items-center gap-3">
                                            <Shield className="h-5 w-5 shrink-0" />
                                            {serverError}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            label="Full Name"
                                            id="name"
                                            type="text"
                                            value={form.name}
                                            onChange={v => updateField('name', v)}
                                            error={errors.name?.[0]}
                                            placeholder="Jane Doe"
                                            required
                                        />
                                        <FormField
                                            label="Email Address"
                                            id="email"
                                            type="email"
                                            value={form.email}
                                            onChange={v => updateField('email', v)}
                                            error={errors.email?.[0]}
                                            placeholder="jane@example.com"
                                            required
                                        />
                                    </div>

                                    <FormField
                                        label="Subject"
                                        id="subject"
                                        type="text"
                                        value={form.subject}
                                        onChange={v => updateField('subject', v)}
                                        error={errors.subject?.[0]}
                                        placeholder="How can we help?"
                                        required
                                    />

                                    <div>
                                        <label htmlFor="message" className="block text-cosmic-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            value={form.message}
                                            onChange={e => updateField('message', e.target.value)}
                                            placeholder="Write your message here..."
                                            required
                                            rows={6}
                                            className="bg-cosmic-light border border-cosmic-accent text-cosmic-black rounded-xl px-4 py-3 focus:outline-none focus:border-cosmic-brand focus:ring-2 focus:ring-cosmic-brand/20 placeholder:text-[#BDBDBD] w-full text-base transition-all resize-none shadow-sm hover:border-[#BDBDBD]"
                                        />
                                        {errors.message?.[0] && (
                                            <p className="text-cosmic-brand text-xs font-semibold mt-1.5">{errors.message[0]}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-cosmic-brand text-white font-bold text-sm tracking-wide px-6 py-4 rounded-xl hover:bg-[#283593] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-xl hover:shadow-[#124E66]/20 mt-4"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Transmitting...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FormField({
    label,
    id,
    type,
    value,
    onChange,
    error,
    placeholder,
    required,
}: {
    label: string
    id: string
    type: string
    value: string
    onChange: (v: string) => void
    error?: string
    placeholder: string
    required?: boolean
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-cosmic-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="bg-cosmic-light border border-cosmic-accent text-cosmic-black rounded-xl px-4 py-3 focus:outline-none focus:border-cosmic-brand focus:ring-2 focus:ring-cosmic-brand/20 placeholder:text-[#BDBDBD] w-full text-base transition-all shadow-sm hover:border-[#BDBDBD]"
            />
            {error && (
                <p className="text-cosmic-brand text-xs font-semibold mt-1.5">{error}</p>
            )}
        </div>
    )
}
