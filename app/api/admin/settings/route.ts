// app/api/admin/settings/route.ts — Admin Settings API (v4.0 Spec-Compliant)
// Settings use key-value format per CONTEXT.md §7 site_settings table
import { NextRequest, NextResponse } from 'next/server'
import { assertRole } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const updateSettingSchema = z.object({
    key: z.string().regex(/^[a-z_]+$/),
    value: z.string(),
})

export async function PATCH(req: NextRequest) {
    // Settings require superadmin per CONTEXT.md §14
    const admin = await assertRole('superadmin')
    const body = await req.json()
    const parsed = updateSettingSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await (supabase
        .from('site_settings'))
        .update({
            value: parsed.data.value,
            updated_by: admin.id,
            updated_at: new Date().toISOString(),
        })
        .eq('key', parsed.data.key)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'update_setting',
        details: parsed.data
    })

    return NextResponse.json({ success: true })
}
