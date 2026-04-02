import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
    const supabase = createAdminSupabaseClient()
    const { data, error } = await supabase.from('members').select('id, full_name')
    return NextResponse.json({ error, members: data })
}
