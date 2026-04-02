// app/api/auth/register/route.ts — Email/Password Registration for IIMS IT Club
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { registerLimiter } from '@/lib/ratelimit'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email('Invalid email address').transform(v => v.toLowerCase().trim()),
    password: z.string().min(6, 'Password must be at least 6 characters').max(72, 'Password too long'),
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    student_id: z.string().min(1, 'Student ID is required').max(20).optional(),
    program: z.enum(['BCS', 'BBUS', 'BIHM', 'MBA', 'Other']).optional(),
    intake: z.string().max(30).optional(),
    bio: z.string().max(500).optional(),
    skills: z.array(z.string().max(50)).max(20).default([]),
})

export async function POST(req: NextRequest) {
    try {
        // 1. Rate limiting
        const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
        const { success } = await registerLimiter.limit(ip)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            )
        }

        const body = await req.json()
        const parsed = registerSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 })
        }

        const { email, password, full_name, student_id, program, intake, bio, skills } = parsed.data

        const supabase = createServerClient()

        // 2. Create auth user with email/password
        const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email since this is an internal portal
            user_metadata: { full_name },
        })

        if (signUpError) {
            if (signUpError.message?.includes('already registered')) {
                return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
            }
            return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
        }

        if (!authData.user) {
            return NextResponse.json({ error: 'Failed to create account.' }, { status: 500 })
        }

        // 3. The DB trigger trg_auth_user_created creates the members row.
        //    Wait briefly for trigger to execute, then update with profile data.
        await new Promise(r => setTimeout(r, 500))

        const { error: updateError } = await (supabase
            .from('members'))
            .update({
                full_name,
                student_id: student_id || null,
                program: program || null,
                intake: intake || null,
                bio: bio || null,
                skills,
                // Status stays 'pending' — admin must approve
            })
            .eq('user_id', authData.user.id)

        if (updateError) {
            // Auth user was created, profile just failed to update — not fatal
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
