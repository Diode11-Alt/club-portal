// app/api/admin/ctf/route.ts — Admin CTF Challenge Management API
import { NextRequest, NextResponse } from 'next/server'
import { assertRole } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'
import { hashFlag } from '@/lib/crypto'

const createChallengeSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().min(1),
    category: z.enum(['web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc']),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']),
    points: z.number().positive().max(1000),
    flag: z.string().min(1),
    hint: z.string().max(500).optional(),
    file_url: z.string().url().optional(),
    is_active: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = createChallengeSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { flag, ...challengeData } = parsed.data
    const flag_hash = hashFlag(flag)

    const supabase = createServerClient()
    const { error } = await supabase.from('ctf_challenges').insert({
        ...challengeData,
        flag_hash,
        created_by: admin.id,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'create_challenge',
        details: { title: challengeData.title, category: challengeData.category, points: challengeData.points }
    })

    return NextResponse.json({ success: true })
}
