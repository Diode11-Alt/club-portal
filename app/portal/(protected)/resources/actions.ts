// app/portal/resources/actions.ts — IIMS Collegiate Resource Actions
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadDocument(prevState: unknown, formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null

    if (!session) return { error: 'Unauthorized uplink' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const file = formData.get('file') as File | null

    if (!title || !file) return { error: 'Title and File are required' }

    // 10MB limit enforcement
    if (file.size > 10 * 1024 * 1024) {
        return { error: 'File size exceeds 10MB limit' }
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExts = ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'webp']
    if (!allowedExts.includes(ext)) {
        return { error: 'Invalid format. Allowed: PDF, Word, Images' }
    }

    // Get current member
    const { data: member } = await (supabase
        .from('members'))
        .select('id, role')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Operative identity not found' }

    // Upload to Storage
    const fileName = `resources/${session.user.id}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
        .from('portal_documents')
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false,
        })

    if (uploadError) return { error: 'Storage archive failed: ' + uploadError.message }

    const { data: urlData } = supabase.storage
        .from('portal_documents')
        .getPublicUrl(fileName)

    const { error } = await supabase.from('documents').insert({
        uploader_id: (member).id,
        title,
        description,
        file_url: urlData.publicUrl,
        category,
        visibility: formData.get('visibility') as string || 'all',
        is_public: (formData.get('visibility') as string || 'all') === 'all',
        deleted_at: null
    })

    if (error) return { error: 'Archive Database write failed' }

    revalidatePath('/portal/resources')
    return { success: true }
}

export async function deleteDocument(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null
    if (!session) return { error: 'Unauthorized' }

    const { data: member } = await (supabase
        .from('members'))
        .select('id, role')
        .eq('user_id', session.user.id)
        .single()

    // Enforce Tiered Logic
    const { data: doc } = await (supabase
        .from('documents'))
        .select('uploader_id, file_url')
        .eq('id', id)
        .single()

    if (!doc) return { error: 'Document not found' }

    const role = (member).role
    const isOwner = doc.uploader_id === (member).id
    const isTopTier = ['admin', 'superadmin', 'president'].includes(role)

    if (isTopTier) {
        // PERMANENT PURGE (Hard Delete)
        // Purge from Storage
        const fileUrlStr = doc.file_url || ''
        const match = fileUrlStr.match(/portal_documents\/(.+)$/)
        if (match && match[1]) {
            await supabase.storage.from('portal_documents').remove([match[1]])
        }
        // Delete Record
        const { error } = await supabase.from('documents').delete().eq('id', id)
        if (error) return { error: 'Database Redaction failed' }
    } else if (role === 'bod' && isOwner) {
        // SOFT DELETE
        const { error } = await supabase.from('documents')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
        if (error) return { error: 'Soft-redaction failed' }
    } else {
        return { error: 'Insufficient clearance to redact this asset' }
    }

    revalidatePath('/portal/resources')
    revalidatePath('/portal/admin')
    return { success: true }
}

export async function restoreDocument(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { data: member } = await supabase.from('members')
        .select('role')
        .eq('user_id', user.id)
        .single()

    if (!['admin', 'superadmin', 'president'].includes((member).role)) {
        return { error: 'Only high-level command can restore redacted assets' }
    }

    const { error } = await supabase.from('documents')
        .update({ deleted_at: null })
        .eq('id', id)

    if (error) return { error: 'Restoration failed' }

    revalidatePath('/portal/resources')
    revalidatePath('/portal/admin')
    return { success: true }
}
