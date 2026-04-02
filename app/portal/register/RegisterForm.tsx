// app/portal/register/RegisterForm.tsx — Self-contained email/password registration
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    User, BookOpen, GraduationCap, Calendar, FileText, Code2,
    ArrowRight, Loader2, Mail, Lock, Eye, EyeOff
} from 'lucide-react'
import Link from 'next/link'

export default function RegisterForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [skillsInput, setSkillsInput] = useState('')

    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        student_id: '',
        program: 'BCS',
        intake: '',
        bio: '',
    })

    const programs = [
        { value: 'BCS', label: 'BSc (Hons) Computing' },
        { value: 'BBUS', label: 'BBUS' },
        { value: 'BIHM', label: 'BIHM' },
        { value: 'MBA', label: 'MBA' },
        { value: 'Other', label: 'Other' },
    ]

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)

        try {
            const processedSkills = skillsInput
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0)

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    full_name: form.full_name,
                    student_id: form.student_id,
                    program: form.program,
                    intake: form.intake,
                    bio: form.bio,
                    skills: processedSkills,
                }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Registration failed')

            router.push('/portal/pending')
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 rounded-sm bg-cosmic-brand/10 border border-cosmic-black/20 text-[#C62828] text-sm font-medium animate-slide-in">
                    {error}
                </div>
            )}

            {/* Account credentials */}
            <div className="space-y-1 mb-2">
                <h3 className="text-cosmic-brand font-bold text-sm uppercase tracking-wider">Account Credentials</h3>
                <p className="text-cosmic-accent text-xs">Create your login credentials</p>
            </div>

            <div className="grid grid-cols-1 gap-5">
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-cosmic-accent" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all"
                            placeholder="you@iimscollege.edu.np"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-cosmic-accent" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="block w-full pl-10 pr-10 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-cosmic-accent hover:text-[#616161] transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-cosmic-accent" />
                            </div>
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                className="block w-full pl-10 pr-3 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-cosmic-accent pt-6">
                <div className="space-y-1 mb-4">
                    <h3 className="text-cosmic-brand font-bold text-sm uppercase tracking-wider">Academic Information</h3>
                    <p className="text-cosmic-accent text-xs">Used for membership verification</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-cosmic-accent" />
                        </div>
                        <input
                            id="full_name"
                            required
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="student_id" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Student ID</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BookOpen className="h-4 w-4 text-cosmic-accent" />
                        </div>
                        <input
                            id="student_id"
                            required
                            value={form.student_id}
                            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all"
                            placeholder="e.g. 10002345"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="program" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Program</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GraduationCap className="h-4 w-4 text-cosmic-accent" />
                        </div>
                        <select
                            id="program"
                            required
                            value={form.program}
                            onChange={(e) => setForm({ ...form, program: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all appearance-none"
                        >
                            {programs.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="intake" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Intake (Year & Session)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-cosmic-accent" />
                        </div>
                        <input
                            id="intake"
                            required
                            value={form.intake}
                            onChange={(e) => setForm({ ...form, intake: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all"
                            placeholder="e.g. Autumn 2024"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="skills" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Skills (Comma separated)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <Code2 className="h-4 w-4 text-cosmic-accent" />
                    </div>
                    <input
                        id="skills"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all"
                        placeholder="React, Python, Penetration Testing, UI/UX"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-cosmic-dark mb-1.5">Bio (Optional)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <FileText className="h-4 w-4 text-cosmic-accent" />
                    </div>
                    <textarea
                        id="bio"
                        rows={3}
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 bg-cosmic-light border border-cosmic-accent rounded-sm focus:bg-white focus:ring-2 focus:ring-cosmic-brand/20 focus:border-cosmic-brand text-cosmic-black text-sm transition-all resize-none"
                        placeholder="Tell us a bit about yourself..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-cosmic-brand text-white font-semibold flex items-center justify-center gap-2 py-3.5 rounded-sm hover:bg-cosmic-dark active:bg-cosmic-brand disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-[#124E66]/20 transition-all mt-4"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creating Account...
                    </>
                ) : (
                    <>
                        Create Account
                        <ArrowRight className="h-5 w-5" />
                    </>
                )}
            </button>

            <div className="text-center pt-2">
                <p className="text-cosmic-accent text-sm">
                    Already have an account?{' '}
                    <Link href="/portal/login" className="text-cosmic-brand font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </form>
    )
}
