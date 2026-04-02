// app/api/admin/inbox/route.ts — Admin Contact Messages API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole, handleAuthError } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function PATCH(req: NextRequest) {
    try {
        const admin = await assertRole('admin')
        const body = await req.json()
        const parsed = z.object({
            id: z.string().uuid(),
            is_read: z.boolean(),
        }).safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
        }

        const supabase = createAdminSupabaseClient()
        const { error } = await (supabase
            .from('contact_messages'))
            .update({ is_read: parsed.data.is_read })
            .eq('id', parsed.data.id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        await supabase.from('audit_logs').insert({
            actor_id: admin.id,
            action: parsed.data.is_read ? 'mark_contact_read' : 'mark_contact_unread',
            target_id: parsed.data.id,
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        return handleAuthError(err)
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const admin = await assertRole('admin')
        const body = await req.json()
        const { id } = z.object({ id: z.string().uuid() }).parse(body)

        const supabase = createAdminSupabaseClient()
        const { error } = await supabase.from('contact_messages').delete().eq('id', id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        await supabase.from('audit_logs').insert({
            actor_id: admin.id,
            action: 'delete_contact_message',
            target_id: id,
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        return handleAuthError(err)
    }
}
