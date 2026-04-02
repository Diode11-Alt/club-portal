// app/portal/notifications/actions.ts — IIMS Collegiate Notification Actions
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markNotificationRead(notificationId: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null

    if (!session) return { error: 'Unauthorized uplink' }

    const { data: member } = await (supabase
        .from('members'))
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Member not found' }

    await (supabase
        .from('notifications'))
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('member_id', (member).id)

    revalidatePath('/portal/notifications')
    return { success: true }
}

export async function markAllNotificationsRead() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null

    if (!session) return { error: 'Unauthorized uplink' }

    const { data: member } = await (supabase
        .from('members'))
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Member not found' }

    await (supabase
        .from('notifications'))
        .update({ is_read: true })
        .eq('member_id', (member).id)
        .eq('is_read', false)

    revalidatePath('/portal/notifications')
    revalidatePath('/portal/dashboard')
    return { success: true }
}
