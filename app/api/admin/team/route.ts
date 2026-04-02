// app/api/admin/team/route.ts — Admin Team/Role Management API (v4.0 Spec-Compliant)
// Team members are just members with admin/superadmin roles (CONTEXT.md §7)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole, handleAuthError } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const updateRoleSchema = z.object({
    id: z.string().uuid(),
    role: z.enum(['member', 'admin', 'superadmin']),
    club_post: z.enum([
        'General Member', 'Web Development', 'Cybersecurity',
        'AI & Machine Learning', 'Mobile Development', 'Cloud & DevOps',
        'Data Science', 'Open Source', 'Graphic Design'
    ]).optional(),
})

export async function PATCH(req: NextRequest) {
    try {
        const admin = await assertRole('superadmin')
        const body = await req.json()
        const parsed = updateRoleSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const { id, ...fields } = parsed.data
        const supabase = createAdminSupabaseClient()
        const { error } = await supabase.from('members').update(fields).eq('id', id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        await supabase.from('audit_logs').insert({
            actor_id: admin.id,
            action: 'update_member_role',
            target_id: id,
            details: fields
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        return handleAuthError(err)
    }
}
