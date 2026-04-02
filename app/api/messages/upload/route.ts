// app/api/messages/upload/route.ts
// Internal Messaging Upload API — Uploads attachments to portal_documents/messages/

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getSession() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    return user ? { user } : null
}







export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized payload' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
        return NextResponse.json({ error: 'Missing file envelope' }, { status: 400 })
    }

    // 10MB limit enforcement
    if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Transmission exceeds 10MB limit.' }, { status: 400 })
    }

    // MIME type whitelist enforcement
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExts = ['pdf', 'docx', 'png', 'jpg']
    if (!allowedExts.includes(ext)) {
        return NextResponse.json({ error: 'Invalid crypto-envelope. Allowed: .pdf, .docx, .png, .jpg' }, { status: 400 })
    }
    const fileType = ext === 'jpg' ? 'jpeg' : ext

    // Create unique filename under the 'messages' namespace
    const fileName = `messages/${session.user.id}/${Date.now()}.${ext}`

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

    return NextResponse.json({
        success: true,
        url: urlData.publicUrl,
        type: fileType
    })
}
