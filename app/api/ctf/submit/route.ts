// app/api/ctf/submit/route.ts — Secure CTF Flag Submission Endpoint (v4.0)
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getSession, getMember } from '@/lib/auth'
import { flagSubmitLimiter } from '@/lib/ratelimit'
import { ctfSubmitSchema } from '@/lib/validations'
import { hashFlag } from '@/lib/crypto'

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting (10 requests per minute per IP)
        const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
        const { success } = await flagSubmitLimiter.limit(ip)

        if (!success) {
            return NextResponse.json({ error: 'Rate limit exceeded. Too many attempts.' }, { status: 429 })
        }

        // 2. Authentication & Authorization
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized uplink' }, { status: 401 })
        }

        const member = await getMember(session.user.id)
        if (!member) {
            return NextResponse.json({ error: 'Operative identity not found' }, { status: 403 })
        }

        // 3. Input Validation
        const body = await req.json()
        const validated = ctfSubmitSchema.safeParse(body)

        if (!validated.success) {
            return NextResponse.json({ error: 'Invalid input format' }, { status: 400 })
        }

        const { challenge_id, flag } = validated.data

        // We MUST use the service role to read flag_hash if it's protected from public SELECTs
        const supabaseAdmin = createAdminSupabaseClient()

        // Fetch challenge details
        const { data: challenge } = await (supabaseAdmin
            .from('ctf_challenges'))
            .select('id, flag_hash, is_active')
            .eq('id', challenge_id)
            .single()

        if (!challenge || !challenge.is_active) {
            return NextResponse.json({ error: 'Challenge invalid or inactive' }, { status: 404 })
        }

        // 5. Hash & Compare Flag (Timing-safe mitigation via artificial delay)
        // Hash the incoming flag (which trims spaces + lowercases as defined in lib/crypto.ts)
        const submittedHash = hashFlag(flag)

        // Artificial 50ms delay to deter basic timing analysis attacks
        await new Promise(r => setTimeout(r, 50))

        if (submittedHash !== challenge.flag_hash) {
            return NextResponse.json({ error: 'Incorrect flag detected' }, { status: 400 })
        }

        // 6. Check for duplicate submissions
        const { data: existingSolve } = await (supabaseAdmin
            .from('ctf_solves'))
            .select('id')
            .eq('challenge_id', challenge_id)
            .eq('member_id', member.id)
            .maybeSingle()

        if (existingSolve) {
            return NextResponse.json({ error: 'Challenge already pwned by your operative unit' }, { status: 400 })
        }

        // 7. Record Solve (Points are awarded automatically by DB trigger: trg_ctf_solve)
        const { error: insertError } = await (supabaseAdmin
            .from('ctf_solves'))
            .insert({
                challenge_id,
                member_id: member.id,
            })

        if (insertError) {
            return NextResponse.json({ error: 'Database write failed during capture' }, { status: 500 })
        }

        // 8. Revalidate paths so the UI updates ranking and challenges instantly
        const { revalidatePath } = require('next/cache')
        revalidatePath('/portal/dashboard')
        revalidatePath('/portal/ctf')

        // Success! The database trigger has awarded the points behind the scenes.
        return NextResponse.json({ success: true, message: 'Flag captured successfully' })

    } catch (error) {
        return NextResponse.json({ error: 'Internal server error during analysis' }, { status: 500 })
    }
}
