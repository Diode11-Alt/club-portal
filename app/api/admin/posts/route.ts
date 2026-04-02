// app/api/admin/posts/route.ts — Admin Posts API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const createPostSchema = z.object({
    title: z.string().max(200).optional(),
    content: z.string().min(1).max(10000),
    type: z.enum(['post', 'announcement', 'resource', 'project']).default('announcement'),
    is_pinned: z.boolean().default(false),
})

const updatePostSchema = z.object({
    id: z.string().uuid(),
    is_pinned: z.boolean().optional(),
    title: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = createPostSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await supabase.from('posts').insert({
        ...parsed.data,
        author_id: admin.id,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'create_post',
        details: { title: parsed.data.title, type: parsed.data.type }
    })

    return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = updatePostSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...fields } = parsed.data
    const supabase = createServerClient()
    const { error } = await supabase.from('posts').update(fields).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'update_post',
        target_id: id,
        details: fields
    })

    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const { id } = z.object({ id: z.string().uuid() }).parse(body)

    const supabase = createServerClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'delete_post',
        target_id: id,
    })

    return NextResponse.json({ success: true })
}
