// app/api/auth/login/route.ts — Email/Password Sign-In for IIMS IT Club Portal
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { magicLinkLimiter } from '@/lib/ratelimit'
import { z } from 'zod'

const loginSchema = z.object({
    email: z.string().email('Invalid email address').transform(v => v.toLowerCase().trim()),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limiting
        const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
        const { success } = await magicLinkLimiter.limit(ip)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                { status: 429 }
            )
        }

        const body = await req.json()
        const parsed = loginSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 })
        }

        const { email, password } = parsed.data

        // 2. Create Supabase client with cookie handling for session persistence
        const cookieStore = await cookies()
        const supabase = createSSRClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get: (name) => cookieStore.get(name)?.value,
                    set: (name, value, options) => {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove: (name, options) => {
                        cookieStore.set({ name, value: '', ...options, maxAge: 0, path: '/' })
                    },
                },
            }
        )

        // 3. Sign in with email/password
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
