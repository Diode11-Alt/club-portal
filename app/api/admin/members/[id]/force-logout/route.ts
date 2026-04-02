import { NextRequest, NextResponse } from 'next/server'
import { assertRole, handleAuthError } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const admin = await assertRole('superadmin')
        const params = await props.params;

        const { id } = params
        const supabase = createAdminSupabaseClient()

        // Get the user_id from the member id
        const { data: member } = await supabase.from('members').select('user_id').eq('id', id).single()

        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        // Force sign out user globally
        const { error } = await supabase.auth.admin.signOut(member.user_id, 'global')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Log the audit event
        await supabase.from('audit_logs').insert({
            actor_id: admin.id,
            action: 'force_logout',
            target_id: id,
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        return handleAuthError(err)
    }
}
