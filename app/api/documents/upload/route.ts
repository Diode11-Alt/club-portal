// app/api/documents/upload/route.ts
// Document upload API — handles file upload to storage + DB insert using service role key (bypasses RLS)

import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const supabaseAdmin = createAdminSupabaseClient()

    // Check member status — must be approved
    const { data: member } = await supabaseAdmin
        .from('members')
        .select('status')
        .eq('user_id', session.user.id)
        .single()

    if (!member || member.status !== 'approved') {
        return NextResponse.json({ error: 'Only approved members can upload documents' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null

    if (!file || !title) {
        return NextResponse.json({ error: 'File and title are required' }, { status: 400 })
    }

    // 10MB limit enforcement
    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'File exceeds 10MB maximum limit.' }, { status: 400 })
    }

    // MIME type whitelist enforcement
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExts = ['pdf', 'docx', 'png', 'jpg']
    if (!allowedExts.includes(ext)) {
        return NextResponse.json({ error: 'Invalid file format. Allowed: .pdf, .docx, .png, .jpg' }, { status: 400 })
    }
    const fileType = ext === 'jpg' ? 'jpeg' : ext

    // Create unique filename under the 'resources' namespace
    const fileName = `resources/${session.user.id}/${Date.now()}.${ext}`

    // Upload to storage
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await supabaseAdmin.storage
        .from('portal_documents')
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false,
        })

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
        .from('portal_documents')
        .getPublicUrl(fileName)

    // Insert into database (service role bypasses RLS)
    const { error: insertError } = await supabaseAdmin
        .from('documents')
        .insert({
            title,
            file_url: urlData.publicUrl,
            file_type: fileType,
            uploaded_by: session.user.id,
        })

    if (insertError) {
        // Clean up uploaded file if DB insert fails
        await supabaseAdmin.storage.from('portal_documents').remove([fileName])
        return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
