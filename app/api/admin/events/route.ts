// app/api/admin/events/route.ts — Admin Events API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const createEventSchema = z.object({
    title: z.string().min(2).max(200),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().min(1),
    short_desc: z.string().max(200).optional(),
    event_date: z.string(),
    end_date: z.string().optional(),
    location: z.string().max(300).optional(),
    meeting_link: z.string().url().optional(),
    cover_image_url: z.string().optional(),
    type: z.enum(['workshop', 'ctf', 'hackathon', 'seminar', 'meetup', 'competition', 'other']).default('workshop'),
    max_attendees: z.number().positive().optional(),
    is_published: z.boolean().default(false),
})

const updateEventSchema = z.object({
    id: z.string().uuid(),
}).merge(createEventSchema.partial())

export async function POST(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = createEventSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await supabase.from('public_events').insert({
        ...parsed.data,
        created_by: admin.id,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'create_event',
        details: { title: parsed.data.title }
    })

    return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = updateEventSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...fields } = parsed.data
    const supabase = createServerClient()
    const { error } = await supabase.from('public_events').update(fields).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'update_event',
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
    const { error } = await supabase.from('public_events').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'delete_event',
        target_id: id,
    })

    return NextResponse.json({ success: true })
}
