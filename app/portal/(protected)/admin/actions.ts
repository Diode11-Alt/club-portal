// app/portal/admin/actions.ts — Standardized Admin Actions
'use server'

import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Member Management
export async function updateMemberStatus(id: string, status: string, role?: string, club_post?: string) {
    const supabase = createAdminSupabaseClient()

    const updates: { status: string; role?: string; club_post?: string } = { status }
    if (role) updates.role = role
    if (club_post !== undefined) updates.club_post = club_post

    const { error } = await (supabase
        .from('members'))
        .update(updates)
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    return { success: true }
}

export async function deleteMember(id: string) {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    return { success: true }
}

// Event Management
export async function toggleEventStatus(id: string, is_published: boolean) {
    const supabase = createAdminSupabaseClient()
    const { error } = await (supabase
        .from('public_events'))
        .update({ status: is_published ? 'upcoming' : null })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    revalidatePath('/portal/events')
    revalidatePath('/events')
    return { success: true }
}

// CTF Management
export async function updateChallengeStatus(id: string, is_active: boolean) {
    const supabase = createAdminSupabaseClient()
    const { error } = await (supabase
        .from('ctf_challenges'))
        .update({ is_active })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    revalidatePath('/portal/ctf')
    return { success: true }
}

// Post Management
export async function deletePost(id: string) {
    const supabase = createAdminSupabaseClient()
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    revalidatePath('/portal/feed')
    return { success: true }
}

// Resource Management
export async function deleteResource(id: string) {
    const { deleteDocument } = await import('../resources/actions')
    return deleteDocument(id)
}
