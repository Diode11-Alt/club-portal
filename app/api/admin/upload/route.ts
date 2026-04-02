// app/api/admin/upload/route.ts — Admin Upload API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole, handleAuthError } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

const ALLOWED_BUCKETS = ['event-images', 'public-gallery', 'team-avatars', 'club-documents', 'ctf-files']

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ALLOWED_TYPES: Record<string, string[]> = {
    'event-images': ['image/jpeg', 'image/png', 'image/webp'],
    'public-gallery': ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    'team-avatars': ['image/jpeg', 'image/png', 'image/webp'],
    'club-documents': ['application/pdf'],
    'ctf-files': ['application/pdf', 'application/zip', 'application/x-tar', 'application/gzip', 'text/plain'],
}

export async function POST(req: NextRequest) {
    try {
        const admin = await assertRole('admin')

        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const bucket = (formData.get('bucket') as string) || 'event-images'

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        if (!ALLOWED_BUCKETS.includes(bucket)) {
            return NextResponse.json({ error: 'Invalid storage bucket' }, { status: 400 })
        }

        // Server-side file size validation
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File exceeds maximum size of 10MB' }, { status: 413 })
        }

        // Server-side MIME type validation
        const allowedForBucket = ALLOWED_TYPES[bucket]
        if (allowedForBucket && !allowedForBucket.includes(file.type)) {
            return NextResponse.json(
                { error: `File type '${file.type}' is not allowed for bucket '${bucket}'` },
                { status: 415 }
            )
        }

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg'
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

        const buffer = Buffer.from(await file.arrayBuffer())

        const supabase = createAdminSupabaseClient()
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
    } catch (err) {
        return handleAuthError(err)
    }
}
