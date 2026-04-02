// app/api/auth/magic-link/route.ts — Send Magic Link for IIMS IT Club (CONTEXT §10.1)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { magicLinkSchema } from '@/lib/validations'
import { magicLinkLimiter } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limiting (3 requests per 15 minutes per IP/User)
        const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
        const { success, limit, remaining, reset } = await magicLinkLimiter.limit(ip)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString()
                    }
                }
            )
        }

        const body = await req.json()
        const result = magicLinkSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid email format' }, { status: 400 })
        }

        const { email } = result.data
        const supabase = createServerClient()

        // Auth redirect URL should point to our callback route
        const redirectUrl = new URL('/auth/callback', req.url).toString()

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUrl,
                shouldCreateUser: true, // Allow new users to sign up via magic link
            },
        })

        if (error) {
            // Generic error message to prevent email enumeration
            return NextResponse.json({ error: 'Failed to send login link. Please try again.' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
