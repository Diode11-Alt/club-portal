// app/api/portal/upload/route.ts — Member Upload API
import { NextRequest, NextResponse } from 'next/server'
import { assertRole, handleAuthError } from '@/lib/auth'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    try {
        // Only verify they are an approved member
        const member = await assertRole('member')

        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const bucket = (formData.get('bucket') as string) || 'public-gallery'

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

        const ext = file.name.split('.').pop() || 'jpg'
        const filename = `feed/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

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

        return NextResponse.json({ url: urlData.publicUrl })
    } catch (err) {
        return handleAuthError(err)
    }
}
