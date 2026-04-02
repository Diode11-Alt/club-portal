// app/api/admin/upload/route.ts — Admin Upload API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const ALLOWED_BUCKETS = ['event-images', 'public-gallery', 'team-avatars', 'club-documents', 'ctf-files']

export async function POST(req: NextRequest) {
    const admin = await assertRole('admin')

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'event-images'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_BUCKETS.includes(bucket)) {
        return NextResponse.json({ error: 'Invalid storage bucket' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const supabase = createServerClient()
    const { error } = await supabase.storage
        .from(bucket)
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
        })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename)

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'upload_file',
        details: { bucket, filename }
    })

    return NextResponse.json({ url: urlData.publicUrl })
}
