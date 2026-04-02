import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
    const supabase = createServerClient()
    const { data, error } = await supabase.from('members').select('id, full_name')
    return NextResponse.json({ error, members: data })
}
